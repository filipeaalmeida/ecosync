import sys
from flask import Flask, jsonify, abort, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import traceback
import re
import time
from psycopg2 import sql as psql

from db import DB
from util import converter_data, logstd
from constants import AGUARDANDO_PROCESSAMENTO, PENDENTE, CUMPRIDA

app = Flask(__name__)
CORS(app)

def ler_arquivo(arquivo):
    dados = {
        "titulo" : None,
        "data_validade" : None,
        "razao_social" : None,
        "municipio" : None,
        "caracterizacao" : "",
        "exigencias": "",
        "data_emissao" : None
    }
    footer = {
        "Documento assinado",
        "Assinado em",
        "Código de Autenticação",
        "Agência Estadual",
        "Autenticidade em",
        "Documento Assinado"
    }

    campo, gravando = "titulo", False

    reader = PdfReader(arquivo)
    texto = ""
    for page in reader.pages:
        texto += page.extract_text()

    gravando_data_emissao = False

    for texto in texto.splitlines():
        pular_linha = False
        for string in footer:
            if texto.strip().startswith(string):
                pular_linha = True
                break
        if pular_linha:
            continue

        if "DATA EMISSÃO" in texto:
            gravando_data_emissao = True
            continue
        elif gravando_data_emissao:
            dados["data_emissao"] = texto.strip()
            gravando_data_emissao = False
            continue

        if campo == "titulo" and texto:
            dados["titulo"] = texto
            campo, gravando = "data_validade", False
        elif campo == "data_validade":
            if "VALIDADE" in texto:
                dados["data_validade"] = texto.split("VALIDADE")[-1].strip()
                campo, gravando = "razao_social", False
        elif campo == "razao_social":
            if "2 - Razão Social" in texto:
                gravando = True
            elif gravando:
                dados["razao_social"] = " ".join(texto.split()[1:])
                campo, gravando = "municipio", False
        elif campo == "municipio":
            if "4 - Município" in texto:
                gravando = True
            elif gravando:
                dados["municipio"] = " ".join(texto.split()[:-1])
                campo, gravando = "caracterizacao", False
        elif campo == "caracterizacao":
            if "8 - Caracterização do Empreendimento" in texto or "8 - Sumário da Atividade Principal" in texto:
                gravando = True
            elif gravando:
                if "9 - Exigências" in texto:
                    campo, gravando = "exigencias", True
                    dados["caracterizacao"] = dados["caracterizacao"].strip()
                else:
                    dados["caracterizacao"] = dados["caracterizacao"] + texto + "\n"
        elif campo == "exigencias":
            if gravando:
                if "10 - Requisitos" in texto or "10 - Objetivo da Autorização" in texto:
                    dados["exigencias"] = dados["exigencias"].strip()
                    campo, gravando = "", False
                else:
                    dados["exigencias"] = dados["exigencias"] + texto + "\n"
    return dados
 
def get_filters_exigencias():
    filters = {
        'processo': request.args.get('processo'),
        'status': request.args.get('status'),
        'prazo_inicial': request.args.get('prazoInicial'),
        'prazo_final': request.args.get('prazoFinal'),
    }

    # Remover filtros None ou vazios
    filters = {k: v for k, v in filters.items() if v}

    return filters

@app.route('/api/exigencias', methods=['GET'])
def get_exigencias_filtradas():
    print("XXXXXXXXXXXXX", flush=True)
    try:
        DB.init()
        cursor = DB.get_cursor()

        filters = get_filters_exigencias()

        # Remover filtros None ou vazios
        filters = {k: v for k, v in filters.items() if v}

        exigencias = get_exigencias(cursor, filters)
    except ValueError as e:
        abort(400, str(e))
    except Exception as e:
        traceback.print_exc()
        abort(500, 'Erro ao obter exigências filtradas')
    finally:
        DB.close()

    return jsonify(exigencias)

def get_exigencias(cursor, filters):

    sql = """
    SELECT e.id, e.descricao, e.prazo, e.agrupada, e.status, e.prazo < current_date as atrasada, l.processo
    FROM exigencia e 
    INNER JOIN licenca l ON l.id = e.licenca_id
    WHERE e.data_remocao IS NULL
    """

    values = []

    if "licenca_id" in filters:
        sql += " AND e.licenca_id = %s"
        values.append(filters["licenca_id"])
    if "processo" in filters:
        sql += " AND l.processo = %s"
        values.append(filters["processo"])
    if "status" in filters:
        sql += " AND e.status = %s"
        values.append(CUMPRIDA if filters["status"] == "cumprida" else PENDENTE if filters["status"] == "pendente" else filters["status"])
    if "prazo_inicial" in filters:
        sql += " AND e.prazo >= %s"
        values.append(filters["prazo_inicial"])
    if "prazo_final" in filters:
        sql += " AND e.prazo <= %s"
        values.append(filters["prazo_final"])

    sql += " ORDER BY e.prazo, e.id"

    cursor.execute(sql, tuple(values))
    exigencias = cursor.fetchall()

    ret = []
    for ex in exigencias:
        exigencia = {}
        exigencia["id"] = ex['id']
        exigencia["exigencia-descricao"] = ex['descricao']
        exigencia["exigencia-prazo"] = ex['prazo'].strftime("%Y-%m-%d") if ex['prazo'] else None
        exigencia["exigencia-processo"] = ex['processo']

        acoes = []
        if ex["agrupada"]:
            acoes.append("minuta")
        if ex["status"] == CUMPRIDA:
            acoes.append("cancelar-cumprir")
            exigencia["cor"] = "VERDE"
        else:
            acoes.append("cumprir")
            if ex["atrasada"]:
                exigencia["cor"] = "VERMELHO"

        exigencia["exigencia-acoes"] = acoes

        ret.append(exigencia)

    return ret

def pesquisar_licenca(processo, cursor):
    sql_licenca = """
    SELECT id, processo, titulo, caracterizacao, razao_social, municipio, data_emissao, data_validade, prazo_renovacao, status FROM licenca WHERE data_remocao IS NULL AND processo = %s
    """

    cursor.execute(sql_licenca, (processo,))
    licenca = cursor.fetchone()

    if licenca:
        licenca_id = licenca['id']
        exigencias = get_exigencias(cursor, {"licenca_id":licenca_id})

        data = {
            "id": licenca['id'],
            "processo": licenca['processo'],
            "status": licenca['status'].replace("_", " "),
            "titulo": licenca['titulo'],
            "caracterizacao-empreendimento": licenca['caracterizacao'],
            "razao-social": licenca['razao_social'],
            "municipio": licenca['municipio'],
            "data-emissao": licenca['data_emissao'].strftime("%Y-%m-%d") if licenca['data_emissao'] else None,
            "data-validade": licenca['data_validade'].strftime("%Y-%m-%d") if licenca['data_validade'] else None,
            "prazo-renovacao": licenca['prazo_renovacao'].strftime("%Y-%m-%d") if licenca['prazo_renovacao'] else None,
            "exigencias": exigencias
        }

    else:
        data = {}

    return data

@app.route('/api/licencas', methods=['POST'])
def inserir_licenca():

    if 'arquivo' not in request.files:
        abort(400, 'Nenhum arquivo enviado.')
    
    arquivo = request.files['arquivo']
    processo = request.form.get('codigoProcesso')

    if not arquivo or not processo:
        abort(400, 'Arquivo ou código do processo não fornecido.')        

    try:
        dados = ler_arquivo(arquivo)

        DB.init()
        sql = """
        INSERT INTO licenca (data_criacao, processo, titulo, caracterizacao, razao_social, municipio, data_emissao, exigencias, data_validade, status)
        VALUES (now(), %s, %s, %s, %s, %s, %s, %s, %s, %s);

        UPDATE licenca SET prazo_renovacao = data_validade - 120;
        """

        cursor = DB.get_cursor()
        cursor.execute(sql, (processo, dados["titulo"], dados["caracterizacao"], dados["razao_social"], dados["municipio"], converter_data(dados["data_emissao"]), dados["exigencias"], converter_data(dados["data_validade"]), AGUARDANDO_PROCESSAMENTO))

        DB.commit()
    except Exception as e:
        DB.rollback()
        traceback.print_exc()
        response = jsonify({"error": "Erro ao processar o arquivo."})
        response.status_code = 500
        return response
    finally:
        DB.close()

    response = jsonify({'mensagem': 'Licença inserida com sucesso!'})
    response.status_code = 201
    return response

def extrair_por_regex(texto, regex):
    match = re.search(regex, texto, re.MULTILINE)
    return match.group(1).strip() if match else None


@app.route('/api/licencas/<int:licenca_id>', methods=['PUT'])
def atualizar_licenca(licenca_id):

    try:
        DB.init()
        cursor = DB.get_cursor()
        sql_licenca = """
        UPDATE licenca SET data_alteracao = now(),
            titulo = %s,
            caracterizacao = %s,
            razao_social = %s,
            municipio = %s,
            data_emissao = %s,
            data_validade = %s,
            prazo_renovacao = %s
        WHERE id = %s
        """

        cursor.execute(sql_licenca, (
            request.json['titulo'],
            request.json['caracterizacao-empreendimento'],
            request.json['razao-social'],
            request.json['municipio'],
            request.json['data-emissao'],
            request.json['data-validade'],
            request.json['prazo-renovacao'],
            licenca_id,
        ))

        exigencias = request.json['exigencias']

        sql_busca_exigencias = "SELECT id FROM exigencia WHERE licenca_id = %s"
        cursor.execute(sql_busca_exigencias, (licenca_id,))
        exigencias_atuais = {row["id"] for row in cursor.fetchall()}
        exigencias_request = {e['id'] for e in request.json['exigencias']}
        exigencias_para_remover = exigencias_atuais - exigencias_request      

        if exigencias_para_remover:
            sql_remover_exigencia = "UPDATE exigencia SET data_remocao = now() WHERE id = ANY(%s)"
            cursor.execute(sql_remover_exigencia, (list(exigencias_para_remover),))

        for e in exigencias:
            if "-" in str(e["id"]):
                sql_exigencia = f"""
                INSERT INTO exigencia (licenca_id, descricao, prazo, data_criacao, status)
                VALUES (%s, %s, %s, now(), '{PENDENTE}')
                """
                cursor.execute(sql_exigencia, (licenca_id, e["exigencia-descricao"], e["exigencia-prazo"] if e["exigencia-prazo"] else None))
                e["id"] = cursor.lastrowid
            else:
                sql_exigencia = """
                UPDATE exigencia SET descricao = %s, prazo = %s WHERE id = %s
                """
                cursor.execute(sql_exigencia, (e["exigencia-descricao"], e["exigencia-prazo"] if e["exigencia-prazo"] else None, e["id"]))

        DB.commit()

        exigencias = get_exigencias(cursor, {"licenca_id":licenca_id})

        return jsonify({"message": "Licença atualizada com sucesso.", "exigencias": exigencias}), 200
    except Exception as e:
        DB.rollback()
        traceback.print_exc()
        response = jsonify({"error": "Erro ao atualizar licença."})
        response.status_code = 500
        return response
    finally:
        DB.close()

@app.route('/api/exigencias/<int:exigencia_id>/cumprir', methods=['PUT'])
def cumprir_exigencia(exigencia_id):
    filters = get_filters_exigencias()
    return alterar_status_exigencia(exigencia_id, filters, CUMPRIDA)

@app.route('/api/exigencias/<int:exigencia_id>/cancelar-cumprir', methods=['PUT'])
def cancelar_cumprir_exigencia(exigencia_id):
    filters = get_filters_exigencias()
    return alterar_status_exigencia(exigencia_id, filters, PENDENTE)

def alterar_status_exigencia(exigencia_id, filters, status):

    exigencias = []

    try:
        DB.init()
        sql_exigencia = """
            UPDATE exigencia SET data_alteracao = now(), status = %s WHERE id = %s
        """

        cursor = DB.get_cursor()
        cursor.execute(sql_exigencia, (status, exigencia_id,))

        sql_licenca = """
            SELECT licenca_id FROM exigencia WHERE id = %s
        """
        
        cursor.execute(sql_licenca, (exigencia_id,))
        licenca = cursor.fetchone()

        exigencias = get_exigencias(cursor, filters if filters else {"licenca_id":licenca["licenca_id"]})

        DB.commit()

    except Exception as e:
        DB.rollback()
        traceback.print_exc()
        response = jsonify({"error": "Erro ao atualizar a exigência."})
        response.status_code = 500
        return response
    finally:
        DB.close()

    return jsonify({"message": "Exigência atualizada com sucesso.", "exigencias":exigencias}), 200

@app.route('/api/licencas/<path:processo>', methods=['GET'])
def get_licenca(processo):

    try:
        DB.init()
        cursor = DB.get_cursor()
        data = pesquisar_licenca(processo, cursor)
    except:
        traceback.print_exc()
        abort(500, 'Erro ao pesquisar licença')
    finally:
        DB.close()
    return jsonify(data)

# if __name__ == '__main__':
#     print(ler_arquivo("/Users/filipe/Google Drive/faa consultoria/engea/licencas gpt/arquivos/AUTORIZAÇÃO_MARINE.pdf"))
    # print(ler_arquivo("/Users/filipe/Google Drive/faa consultoria/engea/licencas gpt/arquivos/RLO_LO.pdf"))
    # print(ler_arquivo("/Users/filipe/Google Drive/faa consultoria/engea/licencas gpt/arquivos/PLU_UFV_376_PARNAMIRIM.pdf"))
    # app.run(debug=True, port=5000)

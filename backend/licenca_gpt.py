import traceback, sys
import time
from concurrent.futures import ThreadPoolExecutor
import json
import re
from db import DB
from constants import AGUARDANDO_PROCESSAMENTO, PROCESSADA, ERRO_PROCESSAMENTO, PENDENTE
import util
import env
from datetime import datetime, timedelta
from openai import OpenAI

def get_exigencias_aguardando_processamento(cursor):
    sql = f"SELECT id, exigencias, data_emissao, data_validade FROM licenca WHERE status = '{AGUARDANDO_PROCESSAMENTO}'"
    # sql = f"SELECT id, exigencias, data_emissao FROM licenca WHERE id = 11"
    cursor.execute(sql)
    licenca = cursor.fetchall()
    return licenca

def atualizar_status(cursor, id, status):
    sql = f"UPDATE licenca SET status = '{status}', data_processamento = now() WHERE id = {id}"
    cursor.execute(sql)

def quebrar_texto_exigencias(texto: str) -> list:
    itens = re.split(r'\n\s*(?=\d+\.)', texto.strip())

    agrupados = {}
    for item in itens:
        numero_item = re.match(r'(\d+)', item).group()
        if numero_item not in agrupados:
            agrupados[numero_item] = item
        else:
            agrupados[numero_item] += '\n' + item

    return list(agrupados.values())


def opeanai_chat(client:OpenAI, content_user:str) -> str:
    response = client.chat.completions.create(
        # model="gpt-3.5-turbo",
        # model="gpt-4-turbo-preview",
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "O assistente é um analista ambiental experiente."
            },
            {
                "role": "user",
                "content": content_user
            }
        ],
        temperature=0.3,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    response_content = response.choices[0].message.content
    response_content = response_content.replace("\n", '')
    return response_content

def opeanai_chat_with_timeout(client, content_user, retry=True, timeout_seconds=10):
    with ThreadPoolExecutor() as executor:
        if not retry:
            util.logstd("Tentando novamente...")

        future = executor.submit(opeanai_chat, client, content_user)
        try:
            return future.result(timeout=timeout_seconds)
        except Exception as e:
            util.logstd(f"A chamada para GPT excedeu o tempo limite ou ocorreu um erro: {str(e)}")
            if retry:
                util.logstd("Aguardando 5 segundos...")
                time.sleep(5)
                return opeanai_chat_with_timeout(client, content_user, False, timeout_seconds * 2)
            else:
                raise e

def get_json_exigencias_gpt(exigencias_str:str, data_emissao:datetime.date, client:OpenAI) -> list:
    exigencias = quebrar_texto_exigencias(exigencias_str)

    json_exigencias = []

    i = 0
    for exigencia in exigencias:
        exigencia = exigencia.replace("\n", " ")

        i = i + 1

        content_user = (
            """O texto a seguir é uma exigência extraída de uma licença ambiental, que deverá ser cumprida dentro do prazo pela empresa para a qual a licença foi concebida.\n"""
            f"""A licença foi emitida em {data_emissao}.\n"""
            """Analise o texto a seguir e retorne um JSON, que deverá seguir o formato exemplificado abaixo:\n"""
            """{"data_limite": "2023-03-26", "recorrente": false, prazo_recorrencia": null} ou {"data_limite": "2023-08-23", "recorrente": false, prazo_recorrencia": 120} ou {"data_limite": null, "recorrente": false, prazo_recorrencia": null}\n"""
            """A data_limite deverá ser calculada com base nas informaçÕes indicadas no texto, tendo em vista a data de emissão da lincença e o prazo limite para o seu cumprimento.\n"""
            """O campo recorrente será true sempre que no texto houver uma ideia de recorrência, indicando que a exigência deverá ser cumprida não apenas uma vez, mas a cada período de tempo. Nesse caso, a data_limite indicada no JSON será a data da primeira recorrência.\n"""
            """O prazo_recorrente deverá ser indicado sempre em dias e será a quantidade de dias após a data_limite que a exigência deverá ser cumprida novamente. Se o prazo da recorrência for semestral, deverá ser apresentado, portanto, 180. Se for anual, 365. Se for mensal, 30. \n"""
            """Se no texto não houver definição de prazo e data limite para cumprimento da exigência, retorne "data_limite": null.\n"""
            """A resposta deverá conter APENAS o JSON, sem nenhum texto adicional.\n"""
            f"""Texto da exigência: {exigencia}"""
        )

        util.logstd("Chatting with GPT..." + str(i) + "/" + str(len(exigencias)))
        response_content = opeanai_chat_with_timeout(client, content_user)
        util.logstd("GPT response received.")

        entry = json.loads(response_content)
        entry["descricao"] = exigencia

        json_exigencias.append(entry)

    return json_exigencias

def processar_exigencia(cursor, id, exigencias_str, data_emissao, data_validade, client):
    exigencias = get_json_exigencias_gpt(exigencias_str, data_emissao, client)

    exigencias_agrupadas = [exigencia for exigencia in exigencias if not exigencia["data_limite"]]
    if exigencias_agrupadas:
        descricao = "\n".join([exigencia["descricao"] for exigencia in exigencias_agrupadas])
        exigencias_agrupadas[0]["descricao"] = descricao
        exigencias_agrupadas[0]["agrupada"] = True
        exigencias_agrupadas = [exigencias_agrupadas[0]]

    exigencias_nao_agrupadas = [exigencia for exigencia in exigencias if exigencia["data_limite"]]
    for exigencia in exigencias_nao_agrupadas:
        exigencia["agrupada"] = False

    exigencias = exigencias_nao_agrupadas + exigencias_agrupadas

    for exigencia in exigencias:
        agrupada = exigencia["agrupada"]
        descricao = exigencia["descricao"]
        data_limite = exigencia["data_limite"]
        recorrente = exigencia["recorrente"]
        prazo_recorrencia = exigencia["prazo_recorrencia"]

        if not agrupada:
            sql = f"""
            INSERT INTO exigencia (licenca_id, agrupada, descricao, prazo, status, data_criacao)
            VALUES (%s, %s, %s, %s, '{PENDENTE}', now())
            """
            cursor.execute(sql, (id, agrupada, descricao, data_limite))    

            if recorrente and data_limite:
                data_limite = datetime.strptime(data_limite, "%Y-%m-%d").date()
                data_limite = data_limite + timedelta(days=prazo_recorrencia)
                while data_limite < data_validade:
                    sql = f"""
                    INSERT INTO exigencia (licenca_id, agrupada, descricao, prazo, status, data_criacao)
                    VALUES (%s, %s, %s, %s, '{PENDENTE}', now())
                    """
                    cursor.execute(sql, (id, agrupada, descricao, data_limite))
                    data_limite = data_limite + timedelta(days=prazo_recorrencia)
        else:
            sql = f"""
            INSERT INTO exigencia (licenca_id, agrupada, descricao, prazo, status, data_criacao)
            VALUES (%s, %s, %s, (select prazo_renovacao from licenca where id = %s), '{PENDENTE}', now())
            """
            cursor.execute(sql, (id, agrupada, descricao, id))    

def main():
    try:
        client = OpenAI(api_key=env.OPENAI_API_KEY)
        DB.init()
        cursor = DB.get_cursor()
        licencas = get_exigencias_aguardando_processamento(cursor)
        util.logstd(f"Processando {len(licencas)} licenças...")
        for licenca in licencas:
            try:
                id = licenca["id"]
                exigencias = licenca["exigencias"]
                data_emissao = licenca["data_emissao"]
                data_validade = licenca["data_validade"]
                util.logstd(f"Processando licença {id}...")
                processar_exigencia(cursor, id, exigencias, data_emissao, data_validade, client)
                util.logstd(f"Atualizando status da licença {id} para processada...")
                atualizar_status(cursor, id, PROCESSADA)
                util.logstd(f"Licença {id} processada com sucesso.")
                DB.commit()
            except:
                traceback.print_exc()
                try:
                    util.logstd(f"Erro ao processar licença {id}.")
                    DB.rollback()
                    util.logstd(f"Atualizando status da licença {id} para erro...")
                    atualizar_status(cursor, id, ERRO_PROCESSAMENTO)
                    DB.commit()
                except:
                    DB.rollback()
                    traceback.print_exc()
    except Exception as e:
        DB.rollback()
        traceback.print_exc()
    finally:
        DB.close()

if __name__ == "__main__":
    main()        
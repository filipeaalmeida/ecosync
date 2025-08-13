from fastapi import APIRouter, Depends
from typing import Dict, Any
from datetime import datetime, timedelta
from app.utils.firebase import get_firestore_client
from app.middlewares.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_dashboard_data(
    empresa_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obter dados consolidados para o dashboard"""
    db = get_firestore_client()
    
    hoje = datetime.now()
    proximos_30_dias = hoje + timedelta(days=30)
    proximos_90_dias = hoje + timedelta(days=90)
    
    # Preparar queries base
    processos_query = db.collection("processos")
    licencas_query = db.collection("licencas")
    exigencias_query = db.collection("exigencias")
    
    if empresa_id:
        processos_query = processos_query.where("empresa_id", "==", empresa_id)
        licencas_query = licencas_query.where("empresa_id", "==", empresa_id)
        exigencias_query = exigencias_query.where("empresa_id", "==", empresa_id)
    
    # Contadores de processos
    processos_total = 0
    processos_em_analise = 0
    processos_aprovados = 0
    processos_pendentes = 0
    
    for doc in processos_query.stream():
        processo = doc.to_dict()
        processos_total += 1
        
        status = processo.get("status")
        if status == "em_analise":
            processos_em_analise += 1
        elif status == "aprovado":
            processos_aprovados += 1
        elif status == "pendente":
            processos_pendentes += 1
    
    # Contadores de licenças
    licencas_total = 0
    licencas_vigentes = 0
    licencas_vencidas = 0
    licencas_vencendo_30_dias = 0
    licencas_vencendo_90_dias = 0
    
    for doc in licencas_query.stream():
        licenca = doc.to_dict()
        licencas_total += 1
        
        data_validade = licenca.get("data_validade")
        status = licenca.get("status")
        
        if status == "vigente":
            licencas_vigentes += 1
            
            if data_validade:
                if data_validade < hoje:
                    licencas_vencidas += 1
                elif data_validade <= proximos_30_dias:
                    licencas_vencendo_30_dias += 1
                elif data_validade <= proximos_90_dias:
                    licencas_vencendo_90_dias += 1
        elif status == "vencida":
            licencas_vencidas += 1
    
    # Contadores de exigências
    exigencias_total = 0
    exigencias_pendentes = 0
    exigencias_em_andamento = 0
    exigencias_concluidas = 0
    exigencias_vencidas = 0
    exigencias_urgentes = 0
    
    for doc in exigencias_query.stream():
        exigencia = doc.to_dict()
        exigencias_total += 1
        
        status = exigencia.get("status")
        prioridade = exigencia.get("prioridade")
        prazo = exigencia.get("prazo")
        
        if status == "pendente":
            exigencias_pendentes += 1
        elif status == "em_andamento":
            exigencias_em_andamento += 1
        elif status == "concluida":
            exigencias_concluidas += 1
        
        if prazo and prazo < hoje and status not in ["concluida", "cancelada"]:
            exigencias_vencidas += 1
        
        if prioridade == "urgente" and status not in ["concluida", "cancelada"]:
            exigencias_urgentes += 1
    
    # Calcular métricas
    taxa_conclusao_exigencias = round(
        (exigencias_concluidas / exigencias_total * 100) if exigencias_total > 0 else 0, 
        2
    )
    
    taxa_aprovacao_processos = round(
        (processos_aprovados / processos_total * 100) if processos_total > 0 else 0,
        2
    )
    
    # Retornar dados consolidados
    return {
        "processos": {
            "total": processos_total,
            "em_analise": processos_em_analise,
            "aprovados": processos_aprovados,
            "pendentes": processos_pendentes,
            "taxa_aprovacao": taxa_aprovacao_processos
        },
        "licencas": {
            "total": licencas_total,
            "vigentes": licencas_vigentes,
            "vencidas": licencas_vencidas,
            "vencendo_30_dias": licencas_vencendo_30_dias,
            "vencendo_90_dias": licencas_vencendo_90_dias
        },
        "exigencias": {
            "total": exigencias_total,
            "pendentes": exigencias_pendentes,
            "em_andamento": exigencias_em_andamento,
            "concluidas": exigencias_concluidas,
            "vencidas": exigencias_vencidas,
            "urgentes": exigencias_urgentes,
            "taxa_conclusao": taxa_conclusao_exigencias
        },
        "alertas": {
            "licencas_vencendo": licencas_vencendo_30_dias,
            "exigencias_vencidas": exigencias_vencidas,
            "exigencias_urgentes": exigencias_urgentes,
            "processos_pendentes": processos_pendentes
        },
        "ultima_atualizacao": datetime.now().isoformat()
    }

@router.get("/timeline", response_model=list)
async def get_timeline_data(
    dias: int = 30,
    empresa_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obter dados de timeline para os próximos X dias"""
    db = get_firestore_client()
    
    hoje = datetime.now()
    data_limite = hoje + timedelta(days=dias)
    
    eventos = []
    
    # Buscar licenças vencendo
    licencas_query = db.collection("licencas").where("status", "==", "vigente")
    if empresa_id:
        licencas_query = licencas_query.where("empresa_id", "==", empresa_id)
    
    for doc in licencas_query.stream():
        licenca = doc.to_dict()
        data_validade = licenca.get("data_validade")
        
        if data_validade and hoje <= data_validade <= data_limite:
            eventos.append({
                "tipo": "licenca_vencimento",
                "data": data_validade.isoformat(),
                "titulo": f"Vencimento de Licença: {licenca.get('numero_licenca')}",
                "descricao": licenca.get('descricao', ''),
                "prioridade": "alta" if (data_validade - hoje).days <= 7 else "media",
                "id": doc.id
            })
    
    # Buscar exigências com prazo
    exigencias_query = db.collection("exigencias").where("status", "!=", "concluida")
    if empresa_id:
        exigencias_query = exigencias_query.where("empresa_id", "==", empresa_id)
    
    for doc in exigencias_query.stream():
        exigencia = doc.to_dict()
        prazo = exigencia.get("prazo")
        
        if prazo and hoje <= prazo <= data_limite:
            eventos.append({
                "tipo": "exigencia_prazo",
                "data": prazo.isoformat(),
                "titulo": f"Prazo de Exigência: {exigencia.get('titulo')}",
                "descricao": exigencia.get('descricao', ''),
                "prioridade": exigencia.get('prioridade', 'media'),
                "id": doc.id
            })
    
    # Ordenar eventos por data
    eventos.sort(key=lambda x: x['data'])
    
    return eventos

@router.get("/estatisticas", response_model=dict)
async def get_estatisticas(
    periodo_dias: int = 30,
    empresa_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Obter estatísticas históricas"""
    db = get_firestore_client()
    
    data_inicio = datetime.now() - timedelta(days=periodo_dias)
    
    # Estatísticas de processos criados no período
    processos_query = db.collection("processos").where("data_abertura", ">=", data_inicio)
    if empresa_id:
        processos_query = processos_query.where("empresa_id", "==", empresa_id)
    
    processos_periodo = sum(1 for _ in processos_query.stream())
    
    # Estatísticas de exigências concluídas no período
    exigencias_query = db.collection("exigencias").where("data_conclusao", ">=", data_inicio)
    if empresa_id:
        exigencias_query = exigencias_query.where("empresa_id", "==", empresa_id)
    
    exigencias_concluidas_periodo = sum(1 for _ in exigencias_query.stream())
    
    # Estatísticas de licenças emitidas no período
    licencas_query = db.collection("licencas").where("data_emissao", ">=", data_inicio)
    if empresa_id:
        licencas_query = licencas_query.where("empresa_id", "==", empresa_id)
    
    licencas_emitidas_periodo = sum(1 for _ in licencas_query.stream())
    
    return {
        "periodo_dias": periodo_dias,
        "data_inicio": data_inicio.isoformat(),
        "processos_criados": processos_periodo,
        "exigencias_concluidas": exigencias_concluidas_periodo,
        "licencas_emitidas": licencas_emitidas_periodo,
        "media_processos_dia": round(processos_periodo / periodo_dias, 2),
        "media_exigencias_dia": round(exigencias_concluidas_periodo / periodo_dias, 2)
    }
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.exigencia import Exigencia, ExigenciaCreate, ExigenciaUpdate
from app.utils.firebase import get_firestore_client
from app.middlewares.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Exigencia])
async def listar_exigencias(
    status_filter: Optional[str] = None,
    prioridade_filter: Optional[str] = None,
    processo_id: Optional[str] = None,
    licenca_id: Optional[str] = None,
    empresa_id: Optional[str] = None,
    vencidas: Optional[bool] = None,
    current_user: dict = Depends(get_current_user)
):
    """Listar todas as exigências com filtros opcionais"""
    db = get_firestore_client()
    query = db.collection("exigencias")
    
    # Aplicar filtros
    if status_filter:
        query = query.where("status", "==", status_filter)
    if prioridade_filter:
        query = query.where("prioridade", "==", prioridade_filter)
    if processo_id:
        query = query.where("processo_id", "==", processo_id)
    if licenca_id:
        query = query.where("licenca_id", "==", licenca_id)
    if empresa_id:
        query = query.where("empresa_id", "==", empresa_id)
    
    # Executar query
    docs = query.stream()
    exigencias = []
    hoje = datetime.now()
    
    for doc in docs:
        exigencia_data = doc.to_dict()
        exigencia_data["id"] = doc.id
        
        # Verificar se está vencida
        if exigencia_data.get("prazo") and exigencia_data["prazo"] < hoje:
            if exigencia_data["status"] not in ["concluida", "cancelada"]:
                exigencia_data["status"] = "vencida"
        
        # Filtrar por vencidas se necessário
        if vencidas is not None:
            is_vencida = exigencia_data.get("status") == "vencida"
            if vencidas != is_vencida:
                continue
        
        exigencias.append(Exigencia(**exigencia_data))
    
    # Ordenar por prioridade e prazo
    prioridade_ordem = {"urgente": 0, "alta": 1, "media": 2, "baixa": 3}
    exigencias.sort(key=lambda x: (
        prioridade_ordem.get(x.prioridade, 4),
        x.prazo if x.prazo else datetime.max
    ))
    
    return exigencias

@router.get("/dashboard", response_model=dict)
async def dashboard_exigencias(
    current_user: dict = Depends(get_current_user)
):
    """Obter estatísticas das exigências para o dashboard"""
    db = get_firestore_client()
    
    hoje = datetime.now()
    proximos_7_dias = hoje + timedelta(days=7)
    proximos_30_dias = hoje + timedelta(days=30)
    
    # Buscar todas as exigências
    exigencias = db.collection("exigencias").stream()
    
    total = 0
    pendentes = 0
    em_andamento = 0
    concluidas = 0
    vencidas = 0
    vencendo_7_dias = 0
    vencendo_30_dias = 0
    
    por_prioridade = {"baixa": 0, "media": 0, "alta": 0, "urgente": 0}
    
    for doc in exigencias:
        exigencia = doc.to_dict()
        total += 1
        
        status = exigencia.get("status")
        prazo = exigencia.get("prazo")
        prioridade = exigencia.get("prioridade", "media")
        
        # Contabilizar por status
        if status == "pendente":
            pendentes += 1
        elif status == "em_andamento":
            em_andamento += 1
        elif status == "concluida":
            concluidas += 1
        elif status == "vencida" or (prazo and prazo < hoje and status not in ["concluida", "cancelada"]):
            vencidas += 1
        
        # Contabilizar por prioridade
        if prioridade in por_prioridade:
            por_prioridade[prioridade] += 1
        
        # Contabilizar vencimentos próximos
        if prazo and status not in ["concluida", "cancelada", "vencida"]:
            if prazo <= proximos_7_dias:
                vencendo_7_dias += 1
            elif prazo <= proximos_30_dias:
                vencendo_30_dias += 1
    
    return {
        "total": total,
        "pendentes": pendentes,
        "em_andamento": em_andamento,
        "concluidas": concluidas,
        "vencidas": vencidas,
        "vencendo_7_dias": vencendo_7_dias,
        "vencendo_30_dias": vencendo_30_dias,
        "por_prioridade": por_prioridade,
        "taxa_conclusao": round((concluidas / total * 100) if total > 0 else 0, 2)
    }

@router.get("/{exigencia_id}", response_model=Exigencia)
async def obter_exigencia(
    exigencia_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obter detalhes de uma exigência específica"""
    db = get_firestore_client()
    doc = db.collection("exigencias").document(exigencia_id).get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exigência não encontrada"
        )
    
    exigencia_data = doc.to_dict()
    exigencia_data["id"] = doc.id
    return Exigencia(**exigencia_data)

@router.post("/", response_model=Exigencia, status_code=status.HTTP_201_CREATED)
async def criar_exigencia(
    exigencia: ExigenciaCreate,
    current_user: dict = Depends(get_current_user)
):
    """Criar nova exigência"""
    db = get_firestore_client()
    
    # Preparar dados da exigência
    exigencia_dict = exigencia.dict()
    exigencia_dict["status"] = "pendente"
    exigencia_dict["data_criacao"] = datetime.now()
    exigencia_dict["data_atualizacao"] = datetime.now()
    exigencia_dict["documentos_anexados"] = []
    
    # Adicionar ao Firestore
    doc_ref = db.collection("exigencias").add(exigencia_dict)
    
    # Retornar exigência criada
    exigencia_dict["id"] = doc_ref[1].id
    return Exigencia(**exigencia_dict)

@router.put("/{exigencia_id}", response_model=Exigencia)
async def atualizar_exigencia(
    exigencia_id: str,
    exigencia_update: ExigenciaUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Atualizar exigência existente"""
    db = get_firestore_client()
    doc_ref = db.collection("exigencias").document(exigencia_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exigência não encontrada"
        )
    
    # Preparar dados para atualização
    update_data = {k: v for k, v in exigencia_update.dict().items() if v is not None}
    update_data["data_atualizacao"] = datetime.now()
    
    # Se mudando para concluída, adicionar data de conclusão
    if update_data.get("status") == "concluida":
        update_data["data_conclusao"] = datetime.now()
    
    # Atualizar no Firestore
    doc_ref.update(update_data)
    
    # Retornar exigência atualizada
    updated_doc = doc_ref.get()
    exigencia_data = updated_doc.to_dict()
    exigencia_data["id"] = updated_doc.id
    return Exigencia(**exigencia_data)

@router.delete("/{exigencia_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_exigencia(
    exigencia_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Deletar exigência"""
    db = get_firestore_client()
    doc_ref = db.collection("exigencias").document(exigencia_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exigência não encontrada"
        )
    
    # Deletar documento
    doc_ref.delete()
    return None

@router.post("/{exigencia_id}/concluir", response_model=Exigencia)
async def concluir_exigencia(
    exigencia_id: str,
    observacoes: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Marcar exigência como concluída"""
    db = get_firestore_client()
    doc_ref = db.collection("exigencias").document(exigencia_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exigência não encontrada"
        )
    
    # Atualizar status
    update_data = {
        "status": "concluida",
        "data_conclusao": datetime.now(),
        "data_atualizacao": datetime.now()
    }
    
    if observacoes:
        update_data["observacoes"] = observacoes
    
    doc_ref.update(update_data)
    
    # Retornar exigência atualizada
    updated_doc = doc_ref.get()
    exigencia_data = updated_doc.to_dict()
    exigencia_data["id"] = updated_doc.id
    return Exigencia(**exigencia_data)
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.licenca import Licenca, LicencaCreate, LicencaUpdate
from app.utils.firebase import get_firestore_client
from app.middlewares.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Licenca])
async def listar_licencas(
    status_filter: Optional[str] = None,
    tipo_filter: Optional[str] = None,
    empresa_id: Optional[str] = None,
    vencendo_em_dias: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    """Listar todas as licenças com filtros opcionais"""
    db = get_firestore_client()
    query = db.collection("licencas")
    
    # Aplicar filtros
    if status_filter:
        query = query.where("status", "==", status_filter)
    if tipo_filter:
        query = query.where("tipo", "==", tipo_filter)
    if empresa_id:
        query = query.where("empresa_id", "==", empresa_id)
    
    # Filtro para licenças vencendo em X dias
    if vencendo_em_dias:
        data_limite = datetime.now() + timedelta(days=vencendo_em_dias)
        query = query.where("data_validade", "<=", data_limite)
    
    # Executar query
    docs = query.stream()
    licencas = []
    
    for doc in docs:
        licenca_data = doc.to_dict()
        licenca_data["id"] = doc.id
        
        # Verificar e atualizar status baseado na data de validade
        if licenca_data.get("data_validade"):
            if licenca_data["data_validade"] < datetime.now():
                licenca_data["status"] = "vencida"
        
        licencas.append(Licenca(**licenca_data))
    
    return licencas

@router.get("/vencimentos", response_model=dict)
async def dashboard_vencimentos(
    current_user: dict = Depends(get_current_user)
):
    """Obter estatísticas de vencimentos de licenças"""
    db = get_firestore_client()
    
    hoje = datetime.now()
    proximos_30_dias = hoje + timedelta(days=30)
    proximos_60_dias = hoje + timedelta(days=60)
    proximos_90_dias = hoje + timedelta(days=90)
    
    # Buscar todas as licenças vigentes
    licencas = db.collection("licencas").where("status", "==", "vigente").stream()
    
    vencidas = 0
    vencendo_30_dias = 0
    vencendo_60_dias = 0
    vencendo_90_dias = 0
    total_vigentes = 0
    
    for doc in licencas:
        licenca = doc.to_dict()
        data_validade = licenca.get("data_validade")
        
        if data_validade:
            total_vigentes += 1
            if data_validade < hoje:
                vencidas += 1
            elif data_validade <= proximos_30_dias:
                vencendo_30_dias += 1
            elif data_validade <= proximos_60_dias:
                vencendo_60_dias += 1
            elif data_validade <= proximos_90_dias:
                vencendo_90_dias += 1
    
    return {
        "total_vigentes": total_vigentes,
        "vencidas": vencidas,
        "vencendo_30_dias": vencendo_30_dias,
        "vencendo_60_dias": vencendo_60_dias,
        "vencendo_90_dias": vencendo_90_dias
    }

@router.get("/{licenca_id}", response_model=Licenca)
async def obter_licenca(
    licenca_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obter detalhes de uma licença específica"""
    db = get_firestore_client()
    doc = db.collection("licencas").document(licenca_id).get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Licença não encontrada"
        )
    
    licenca_data = doc.to_dict()
    licenca_data["id"] = doc.id
    return Licenca(**licenca_data)

@router.post("/", response_model=Licenca, status_code=status.HTTP_201_CREATED)
async def criar_licenca(
    licenca: LicencaCreate,
    current_user: dict = Depends(get_current_user)
):
    """Criar nova licença"""
    db = get_firestore_client()
    
    # Verificar se número da licença já existe
    existing = db.collection("licencas").where(
        "numero_licenca", "==", licenca.numero_licenca
    ).limit(1).stream()
    
    if any(existing):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Número de licença já existe"
        )
    
    # Preparar dados da licença
    licenca_dict = licenca.dict()
    licenca_dict["status"] = "vigente"
    licenca_dict["documentos"] = []
    
    # Verificar se já está vencida
    if licenca_dict["data_validade"] < datetime.now():
        licenca_dict["status"] = "vencida"
    
    # Adicionar ao Firestore
    doc_ref = db.collection("licencas").add(licenca_dict)
    
    # Retornar licença criada
    licenca_dict["id"] = doc_ref[1].id
    return Licenca(**licenca_dict)

@router.put("/{licenca_id}", response_model=Licenca)
async def atualizar_licenca(
    licenca_id: str,
    licenca_update: LicencaUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Atualizar licença existente"""
    db = get_firestore_client()
    doc_ref = db.collection("licencas").document(licenca_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Licença não encontrada"
        )
    
    # Preparar dados para atualização
    update_data = {k: v for k, v in licenca_update.dict().items() if v is not None}
    
    # Atualizar no Firestore
    doc_ref.update(update_data)
    
    # Retornar licença atualizada
    updated_doc = doc_ref.get()
    licenca_data = updated_doc.to_dict()
    licenca_data["id"] = updated_doc.id
    return Licenca(**licenca_data)

@router.delete("/{licenca_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_licenca(
    licenca_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Deletar licença"""
    db = get_firestore_client()
    doc_ref = db.collection("licencas").document(licenca_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Licença não encontrada"
        )
    
    # Deletar documento
    doc_ref.delete()
    return None

@router.post("/{licenca_id}/renovar", response_model=Licenca)
async def renovar_licenca(
    licenca_id: str,
    nova_data_validade: datetime,
    current_user: dict = Depends(get_current_user)
):
    """Renovar uma licença"""
    db = get_firestore_client()
    doc_ref = db.collection("licencas").document(licenca_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Licença não encontrada"
        )
    
    # Atualizar status e data de validade
    doc_ref.update({
        "status": "vigente",
        "data_validade": nova_data_validade,
        "data_renovacao": datetime.now()
    })
    
    # Retornar licença renovada
    updated_doc = doc_ref.get()
    licenca_data = updated_doc.to_dict()
    licenca_data["id"] = updated_doc.id
    return Licenca(**licenca_data)
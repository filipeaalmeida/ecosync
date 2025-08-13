from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from typing import List, Optional
from datetime import datetime
from app.models.processo import Processo, ProcessoCreate, ProcessoUpdate
from app.utils.firebase import get_firestore_client, upload_file_to_storage
from app.middlewares.auth import get_current_user
import uuid

router = APIRouter()

@router.get("/", response_model=List[Processo])
async def listar_processos(
    status_filter: Optional[str] = None,
    tipo_filter: Optional[str] = None,
    empresa_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Listar todos os processos com filtros opcionais"""
    db = get_firestore_client()
    query = db.collection("processos")
    
    # Aplicar filtros
    if status_filter:
        query = query.where("status", "==", status_filter)
    if tipo_filter:
        query = query.where("tipo", "==", tipo_filter)
    if empresa_id:
        query = query.where("empresa_id", "==", empresa_id)
    
    # Executar query
    docs = query.stream()
    processos = []
    
    for doc in docs:
        processo_data = doc.to_dict()
        processo_data["id"] = doc.id
        processos.append(Processo(**processo_data))
    
    return processos

@router.get("/{processo_id}", response_model=Processo)
async def obter_processo(
    processo_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obter detalhes de um processo específico"""
    db = get_firestore_client()
    doc = db.collection("processos").document(processo_id).get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado"
        )
    
    processo_data = doc.to_dict()
    processo_data["id"] = doc.id
    return Processo(**processo_data)

@router.post("/", response_model=Processo, status_code=status.HTTP_201_CREATED)
async def criar_processo(
    processo: ProcessoCreate,
    current_user: dict = Depends(get_current_user)
):
    """Criar novo processo"""
    db = get_firestore_client()
    
    # Verificar se número do processo já existe
    existing = db.collection("processos").where(
        "numero_processo", "==", processo.numero_processo
    ).limit(1).stream()
    
    if any(existing):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Número de processo já existe"
        )
    
    # Preparar dados do processo
    processo_dict = processo.dict()
    processo_dict["status"] = "pendente"
    processo_dict["data_abertura"] = datetime.now()
    processo_dict["data_atualizacao"] = datetime.now()
    processo_dict["documentos"] = []
    
    # Adicionar ao Firestore
    doc_ref = db.collection("processos").add(processo_dict)
    
    # Retornar processo criado
    processo_dict["id"] = doc_ref[1].id
    return Processo(**processo_dict)

@router.put("/{processo_id}", response_model=Processo)
async def atualizar_processo(
    processo_id: str,
    processo_update: ProcessoUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Atualizar processo existente"""
    db = get_firestore_client()
    doc_ref = db.collection("processos").document(processo_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado"
        )
    
    # Preparar dados para atualização
    update_data = {k: v for k, v in processo_update.dict().items() if v is not None}
    update_data["data_atualizacao"] = datetime.now()
    
    # Atualizar no Firestore
    doc_ref.update(update_data)
    
    # Retornar processo atualizado
    updated_doc = doc_ref.get()
    processo_data = updated_doc.to_dict()
    processo_data["id"] = updated_doc.id
    return Processo(**processo_data)

@router.delete("/{processo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_processo(
    processo_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Deletar processo"""
    db = get_firestore_client()
    doc_ref = db.collection("processos").document(processo_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado"
        )
    
    # Deletar documento
    doc_ref.delete()
    return None

@router.post("/{processo_id}/documentos", status_code=status.HTTP_201_CREATED)
async def upload_documento(
    processo_id: str,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload de documento para um processo"""
    db = get_firestore_client()
    doc_ref = db.collection("processos").document(processo_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processo não encontrado"
        )
    
    # Ler arquivo
    file_content = await file.read()
    
    # Gerar nome único para o arquivo
    file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
    file_name = f"processos/{processo_id}/{uuid.uuid4()}.{file_extension}"
    
    # Upload para Storage
    file_url = upload_file_to_storage(file_name, file_content, file.content_type)
    
    if not file_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao fazer upload do arquivo"
        )
    
    # Atualizar lista de documentos do processo
    processo_data = doc.to_dict()
    documentos = processo_data.get("documentos", [])
    documentos.append({
        "nome": file.filename,
        "url": file_url,
        "upload_date": datetime.now(),
        "uploaded_by": current_user["uid"]
    })
    
    doc_ref.update({
        "documentos": documentos,
        "data_atualizacao": datetime.now()
    })
    
    return {
        "message": "Documento enviado com sucesso",
        "file_url": file_url,
        "file_name": file.filename
    }
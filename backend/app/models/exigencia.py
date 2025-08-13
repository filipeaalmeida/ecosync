from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class StatusExigencia(str, Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDA = "concluida"
    VENCIDA = "vencida"
    CANCELADA = "cancelada"

class PrioridadeExigencia(str, Enum):
    BAIXA = "baixa"
    MEDIA = "media"
    ALTA = "alta"
    URGENTE = "urgente"

class Exigencia(BaseModel):
    id: Optional[str] = None
    titulo: str
    descricao: str
    processo_id: Optional[str] = None
    licenca_id: Optional[str] = None
    status: StatusExigencia = StatusExigencia.PENDENTE
    prioridade: PrioridadeExigencia = PrioridadeExigencia.MEDIA
    prazo: datetime
    responsavel_id: str
    empresa_id: str
    orgao_solicitante: Optional[str] = None
    data_criacao: datetime = Field(default_factory=datetime.now)
    data_atualizacao: Optional[datetime] = None
    data_conclusao: Optional[datetime] = None
    documentos_anexados: List[str] = Field(default_factory=list)
    observacoes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "titulo": "Apresentar laudo técnico de emissões",
                "descricao": "Necessário apresentar laudo técnico atualizado de emissões atmosféricas",
                "processo_id": "proc_123",
                "status": "pendente",
                "prioridade": "alta",
                "prazo": "2024-12-31T00:00:00",
                "responsavel_id": "user_456",
                "empresa_id": "emp_789",
                "orgao_solicitante": "CETESB"
            }
        }

class ExigenciaCreate(BaseModel):
    titulo: str
    descricao: str
    processo_id: Optional[str] = None
    licenca_id: Optional[str] = None
    prioridade: PrioridadeExigencia = PrioridadeExigencia.MEDIA
    prazo: datetime
    responsavel_id: str
    empresa_id: str
    orgao_solicitante: Optional[str] = None
    observacoes: Optional[str] = None

class ExigenciaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[StatusExigencia] = None
    prioridade: Optional[PrioridadeExigencia] = None
    prazo: Optional[datetime] = None
    responsavel_id: Optional[str] = None
    observacoes: Optional[str] = None
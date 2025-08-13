from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class StatusProcesso(str, Enum):
    EM_ANALISE = "em_analise"
    APROVADO = "aprovado"
    REPROVADO = "reprovado"
    PENDENTE = "pendente"
    ARQUIVADO = "arquivado"

class TipoProcesso(str, Enum):
    LICENCA_PREVIA = "licenca_previa"
    LICENCA_INSTALACAO = "licenca_instalacao"
    LICENCA_OPERACAO = "licenca_operacao"
    RENOVACAO = "renovacao"
    AMPLIACAO = "ampliacao"

class Processo(BaseModel):
    id: Optional[str] = None
    numero_processo: str = Field(..., description="Número único do processo")
    tipo: TipoProcesso
    status: StatusProcesso = StatusProcesso.PENDENTE
    descricao: str
    empresa_id: str
    responsavel_id: str
    data_abertura: datetime = Field(default_factory=datetime.now)
    data_atualizacao: Optional[datetime] = None
    data_vencimento: Optional[datetime] = None
    documentos: List[str] = Field(default_factory=list)
    observacoes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "numero_processo": "PROC-2024-001",
                "tipo": "licenca_operacao",
                "status": "em_analise",
                "descricao": "Licença de operação para planta industrial",
                "empresa_id": "emp_123",
                "responsavel_id": "user_456",
                "data_vencimento": "2025-12-31T00:00:00",
                "observacoes": "Processo em análise técnica"
            }
        }

class ProcessoCreate(BaseModel):
    numero_processo: str
    tipo: TipoProcesso
    descricao: str
    empresa_id: str
    responsavel_id: str
    data_vencimento: Optional[datetime] = None
    observacoes: Optional[str] = None

class ProcessoUpdate(BaseModel):
    tipo: Optional[TipoProcesso] = None
    status: Optional[StatusProcesso] = None
    descricao: Optional[str] = None
    responsavel_id: Optional[str] = None
    data_vencimento: Optional[datetime] = None
    observacoes: Optional[str] = None
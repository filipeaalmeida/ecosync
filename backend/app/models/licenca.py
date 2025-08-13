from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class StatusLicenca(str, Enum):
    VIGENTE = "vigente"
    VENCIDA = "vencida"
    EM_RENOVACAO = "em_renovacao"
    SUSPENSA = "suspensa"
    CANCELADA = "cancelada"

class TipoLicenca(str, Enum):
    AMBIENTAL = "ambiental"
    OPERACAO = "operacao"
    INSTALACAO = "instalacao"
    PREVIA = "previa"
    SIMPLIFICADA = "simplificada"

class Licenca(BaseModel):
    id: Optional[str] = None
    numero_licenca: str = Field(..., description="Número único da licença")
    tipo: TipoLicenca
    status: StatusLicenca = StatusLicenca.VIGENTE
    orgao_emissor: str
    empresa_id: str
    processo_id: Optional[str] = None
    data_emissao: datetime
    data_validade: datetime
    descricao: str
    condicionantes: List[str] = Field(default_factory=list)
    documentos: List[str] = Field(default_factory=list)
    responsavel_tecnico: Optional[str] = None
    observacoes: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "numero_licenca": "LIC-2024-001",
                "tipo": "operacao",
                "status": "vigente",
                "orgao_emissor": "CETESB",
                "empresa_id": "emp_123",
                "processo_id": "proc_456",
                "data_emissao": "2024-01-15T00:00:00",
                "data_validade": "2026-01-15T00:00:00",
                "descricao": "Licença de Operação para atividade industrial",
                "condicionantes": ["Monitoramento mensal de efluentes", "Relatório anual de emissões"],
                "responsavel_tecnico": "João Silva"
            }
        }

class LicencaCreate(BaseModel):
    numero_licenca: str
    tipo: TipoLicenca
    orgao_emissor: str
    empresa_id: str
    processo_id: Optional[str] = None
    data_emissao: datetime
    data_validade: datetime
    descricao: str
    condicionantes: List[str] = Field(default_factory=list)
    responsavel_tecnico: Optional[str] = None
    observacoes: Optional[str] = None

class LicencaUpdate(BaseModel):
    tipo: Optional[TipoLicenca] = None
    status: Optional[StatusLicenca] = None
    orgao_emissor: Optional[str] = None
    data_validade: Optional[datetime] = None
    descricao: Optional[str] = None
    condicionantes: Optional[List[str]] = None
    responsavel_tecnico: Optional[str] = None
    observacoes: Optional[str] = None
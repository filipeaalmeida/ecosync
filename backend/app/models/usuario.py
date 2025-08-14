from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UsuarioResponse(BaseModel):
    """
    Modelo de resposta para dados do usuário
    """
    uid: str
    nome: str
    email: EmailStr
    perfil: str
    permissoes: List[str]
    ativo: bool
    idEmpresa: Optional[str] = None
    data_criacao: Optional[datetime] = None
    data_atualizacao: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class UsuarioListItem(BaseModel):
    """
    Modelo simplificado para listagem de usuários
    """
    id: str
    nome: str
    email: EmailStr
    ativo: bool
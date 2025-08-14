from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.middlewares.auth import get_current_user
from app.models.usuario import UsuarioResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticação"]
)

@router.get("/me", response_model=UsuarioResponse)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)) -> UsuarioResponse:
    """
    Retorna os dados do usuário autenticado.
    
    Login, logout, cadastro, reset e alteração de senha são gerenciados pelo Firebase Auth no frontend.
    
    Returns:
        UsuarioResponse: Dados do usuário incluindo permissões baseadas no perfil
    """
    return UsuarioResponse(
        uid=current_user['uid'],
        nome=current_user['nome'],
        email=current_user['email'],
        perfil=current_user['perfil'],
        permissoes=current_user['permissoes'],
        ativo=current_user['ativo'],
        idEmpresa=current_user.get('idEmpresa'),
        data_criacao=current_user.get('data_criacao'),
        data_atualizacao=current_user.get('data_atualizacao')
    )
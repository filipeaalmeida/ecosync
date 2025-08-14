from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from typing import Optional, Dict, Any
from app.utils.firebase import get_firestore_client

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Valida o token JWT do Firebase Auth e retorna os dados do usuário
    """
    try:
        # Verificar o token com Firebase Auth
        decoded_token = auth.verify_id_token(credentials.credentials)
        uid = decoded_token['uid']
        
        # Buscar dados adicionais do usuário no Firestore
        db = get_firestore_client()
        user_doc = db.collection('usuarios').document(uid).get()
        
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado no sistema"
            )
        
        user_data = user_doc.to_dict()
        
        # Verificar se usuário está ativo
        if not user_data.get('ativo', False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuário inativo"
            )
        
        # Mapear permissões baseadas no perfil
        perfil = user_data.get('perfil', '').lower()
        permissoes = get_permissions_by_profile(perfil)
        
        # Retornar dados do usuário com permissões
        return {
            'uid': uid,
            'nome': user_data.get('nome', ''),
            'email': user_data.get('email', ''),
            'perfil': user_data.get('perfil', ''),
            'permissoes': permissoes,
            'ativo': user_data.get('ativo', False),
            'idEmpresa': user_data.get('idEmpresa', ''),
            'data_criacao': user_data.get('data_criacao'),
            'data_atualizacao': user_data.get('data_atualizacao')
        }
        
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro na autenticação: {str(e)}"
        )

def get_permissions_by_profile(perfil: str) -> list:
    """
    Retorna as permissões baseadas no perfil do usuário
    """
    permissions_map = {
        'administrador': ['criar', 'editar', 'excluir', 'visualizar', 'gerenciar-usuarios'],
        'operador': ['criar', 'editar', 'visualizar'],
        'visualizador': ['visualizar']
    }
    
    return permissions_map.get(perfil, ['visualizar'])

def require_permission(permission: str):
    """
    Decorator para verificar se o usuário tem uma permissão específica
    """
    async def permission_checker(current_user: Dict = Depends(get_current_user)) -> Dict:
        if permission not in current_user.get('permissoes', []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permissão '{permission}' necessária para acessar este recurso"
            )
        return current_user
    return permission_checker

def check_permissions(user: Dict, required_permissions: list) -> bool:
    """
    Verifica se o usuário tem todas as permissões necessárias
    """
    user_permissions = user.get('permissoes', [])
    return all(perm in user_permissions for perm in required_permissions)
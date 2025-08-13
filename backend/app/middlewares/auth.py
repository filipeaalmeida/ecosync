from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.firebase import verify_firebase_token

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Middleware para verificar autenticação do usuário"""
    token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token não fornecido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar token com Firebase
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return decoded_token

async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Middleware para verificar autenticação opcional"""
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
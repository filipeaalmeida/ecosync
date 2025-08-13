from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.utils.firebase import verify_firebase_token, create_custom_token, get_user
from app.middlewares.auth import get_current_user

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str

class UserInfo(BaseModel):
    uid: str
    email: Optional[str]
    display_name: Optional[str]
    photo_url: Optional[str]
    phone_number: Optional[str]

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Endpoint de login - retorna token de autenticação
    Nota: Este endpoint precisa ser integrado com Firebase Auth no frontend
    """
    # Este endpoint será usado principalmente pelo frontend
    # A autenticação real acontece no Firebase Auth (frontend)
    # Aqui apenas validamos o token recebido
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Login deve ser feito através do Firebase Auth no frontend"
    )

@router.post("/verify-token")
async def verify_token(token: str):
    """Verificar se um token é válido"""
    decoded_token = verify_firebase_token(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )
    
    return {
        "valid": True,
        "uid": decoded_token.get("uid"),
        "email": decoded_token.get("email")
    }

@router.get("/me", response_model=UserInfo)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Obter informações do usuário atual"""
    user = get_user(current_user["uid"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )
    
    return UserInfo(
        uid=user.uid,
        email=user.email,
        display_name=user.display_name,
        photo_url=user.photo_url,
        phone_number=user.phone_number
    )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Endpoint de logout
    Nota: O logout real deve ser feito no Firebase Auth (frontend)
    """
    return {"message": "Logout realizado com sucesso", "user_id": current_user["uid"]}

@router.post("/refresh-token")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Renovar token de autenticação"""
    # Criar novo token customizado
    new_token = create_custom_token(current_user["uid"])
    
    if not new_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao renovar token"
        )
    
    return {
        "access_token": new_token.decode() if isinstance(new_token, bytes) else new_token,
        "token_type": "bearer",
        "user_id": current_user["uid"]
    }
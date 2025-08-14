import os
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from datetime import datetime, timedelta

# Variáveis globais para armazenar as instâncias
_db = None
_bucket = None

def initialize_firebase():
    """Inicializar Firebase Admin SDK"""
    global _db, _bucket
    
    if not firebase_admin._apps:
        # Usar credenciais padrão do ambiente (ADC - Application Default Credentials)
        # No Cloud Run, usa automaticamente a service account configurada
        # No desenvolvimento local, usa gcloud auth application-default login
        firebase_admin.initialize_app(options={
            'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
        })
    
    # Inicializar Firestore
    _db = firestore.client()
    
    # Inicializar Storage
    _bucket = storage.bucket()
    
    return _db, _bucket

def get_firestore_client():
    """Retornar cliente Firestore"""
    global _db
    if _db is None:
        initialize_firebase()
    return _db

def get_storage_bucket():
    """Retornar bucket do Storage"""
    global _bucket
    if _bucket is None:
        initialize_firebase()
    return _bucket

def verify_firebase_token(id_token: str):
    """Verificar token do Firebase Auth"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Erro ao verificar token: {e}")
        return None

def generate_signed_upload_url(file_path: str, content_type: str = "application/octet-stream", expiration_hours: int = 1):
    """
    Gerar URL assinada para upload direto do frontend para Firebase Storage
    
    Args:
        file_path: Caminho onde o arquivo será armazenado no Storage
        content_type: Tipo de conteúdo do arquivo
        expiration_hours: Horas até a URL expirar (padrão: 1 hora)
    
    Returns:
        dict: URL assinada e informações adicionais
    """
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob(file_path)
        
        # Definir expiração
        expiration = datetime.utcnow() + timedelta(hours=expiration_hours)
        
        # Gerar URL assinada para PUT (upload)
        signed_url = blob.generate_signed_url(
            version="v4",
            expiration=expiration,
            method="PUT",
            content_type=content_type
        )
        
        return {
            "upload_url": signed_url,
            "file_path": file_path,
            "content_type": content_type,
            "expires_at": expiration.isoformat(),
            "method": "PUT"
        }
        
    except Exception as e:
        print(f"Erro ao gerar URL assinada: {e}")
        return None

def generate_signed_download_url(file_path: str, expiration_hours: int = 24):
    """
    Gerar URL assinada para download de arquivo do Firebase Storage
    
    Args:
        file_path: Caminho do arquivo no Storage
        expiration_hours: Horas até a URL expirar (padrão: 24 horas)
    
    Returns:
        str: URL assinada para download
    """
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob(file_path)
        
        if not blob.exists():
            return None
        
        # Definir expiração
        expiration = datetime.utcnow() + timedelta(hours=expiration_hours)
        
        # Gerar URL assinada para GET (download)
        signed_url = blob.generate_signed_url(
            version="v4",
            expiration=expiration,
            method="GET"
        )
        
        return signed_url
        
    except Exception as e:
        print(f"Erro ao gerar URL de download: {e}")
        return None

def delete_file_from_storage(file_path: str):
    """Deletar arquivo do Firebase Storage"""
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob(file_path)
        
        if blob.exists():
            blob.delete()
            return True
        return False
    except Exception as e:
        print(f"Erro ao deletar arquivo: {e}")
        return False
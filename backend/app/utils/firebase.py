import os
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from google.cloud import firestore as firestore_client
import json

# Variáveis globais para armazenar as instâncias
_db = None
_bucket = None

def initialize_firebase():
    """Inicializar Firebase Admin SDK"""
    global _db, _bucket
    
    if not firebase_admin._apps:
        # Verificar se existe um arquivo de credenciais ou usar as credenciais padrão
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET", "ecosync-storage")
            })
        else:
            # Usar credenciais padrão do ambiente (para Cloud Run)
            firebase_admin.initialize_app(options={
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET", "ecosync-storage")
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

def create_custom_token(uid: str):
    """Criar token customizado para um usuário"""
    try:
        custom_token = auth.create_custom_token(uid)
        return custom_token
    except Exception as e:
        print(f"Erro ao criar token customizado: {e}")
        return None

def get_user(uid: str):
    """Obter informações do usuário pelo UID"""
    try:
        user = auth.get_user(uid)
        return user
    except Exception as e:
        print(f"Erro ao obter usuário: {e}")
        return None

def upload_file_to_storage(file_path: str, file_data: bytes, content_type: str = None):
    """Upload de arquivo para o Firebase Storage"""
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob(file_path)
        
        if content_type:
            blob.content_type = content_type
            
        blob.upload_from_string(file_data)
        
        # Tornar o arquivo público (opcional)
        # blob.make_public()
        
        # Retornar URL do arquivo
        return blob.public_url if blob.public_url else f"gs://{bucket.name}/{file_path}"
    except Exception as e:
        print(f"Erro ao fazer upload do arquivo: {e}")
        return None

def download_file_from_storage(file_path: str):
    """Download de arquivo do Firebase Storage"""
    try:
        bucket = get_storage_bucket()
        blob = bucket.blob(file_path)
        
        if blob.exists():
            return blob.download_as_bytes()
        return None
    except Exception as e:
        print(f"Erro ao fazer download do arquivo: {e}")
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
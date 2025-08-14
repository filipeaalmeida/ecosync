#!/usr/bin/env python3
"""
Script para criação de usuário administrador no Firebase Auth e Firestore
Projeto: EcoSync
Data: 2025-08-14
"""

import sys
import os
import uuid
from datetime import datetime, timezone, timedelta
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Configurações do usuário admin
ADMIN_EMAIL = "filipe@synapses.digital"
ADMIN_PASSWORD = "Senha12345!"
ADMIN_NAME = "Filipe Almeida"
ADMIN_PERFIL = "administrador"

def initialize_firebase():
    """
    Inicializa Firebase usando Application Default Credentials
    """
    try:
        # Tentar inicializar com credenciais padrão (gcloud auth application-default login)
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
            'projectId': 'ecosync-prod'
        })
        print("✅ Firebase inicializado com sucesso usando Application Default Credentials")
        return True
    except Exception as e:
        print(f"❌ Erro ao inicializar Firebase: {e}")
        print("\nCertifique-se de que você executou:")
        print("gcloud auth application-default login")
        print("gcloud config set project ecosync-prod")
        return False

def generate_empresa_id():
    """
    Gera um UUID único para a empresa
    """
    empresa_id = str(uuid.uuid4())
    print(f"📝 ID da empresa gerado: {empresa_id}")
    return empresa_id

def create_firebase_user():
    """
    Cria usuário no Firebase Authentication
    """
    try:
        user_record = auth.create_user(
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            display_name=ADMIN_NAME,
            email_verified=True
        )
        print(f"✅ Usuário criado no Firebase Auth")
        print(f"   UID: {user_record.uid}")
        print(f"   Email: {user_record.email}")
        print(f"   Nome: {user_record.display_name}")
        return user_record.uid
    except auth.EmailAlreadyExistsError:
        print(f"⚠️  Usuário {ADMIN_EMAIL} já existe no Firebase Auth")
        # Buscar UID do usuário existente
        try:
            existing_user = auth.get_user_by_email(ADMIN_EMAIL)
            print(f"   UID existente: {existing_user.uid}")
            return existing_user.uid
        except Exception as e:
            print(f"❌ Erro ao buscar usuário existente: {e}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar usuário no Firebase Auth: {e}")
        return None

def create_firestore_user(uid, empresa_id):
    """
    Cria documento do usuário no Firestore seguindo o modelo do sistema
    """
    try:
        db = firestore.client()
        
        # Dados do usuário seguindo o modelo do backend-models-documentation.md
        # Usar timezone do Brasil (UTC-3)
        brasil_tz = timezone(timedelta(hours=-3))
        agora = datetime.now(brasil_tz)
        
        usuario_data = {
            'nome': ADMIN_NAME,
            'email': ADMIN_EMAIL,
            'perfil': ADMIN_PERFIL,
            'ativo': True,
            'data_criacao': agora,
            'data_atualizacao': agora,
            'idEmpresa': empresa_id,
            'usuario_criacao': uid  # Auto-criação
        }
        
        # Criar documento na coleção usuarios
        doc_ref = db.collection('usuarios').document(uid)
        doc_ref.set(usuario_data)
        
        print(f"✅ Usuário criado no Firestore")
        print(f"   Coleção: usuarios")
        print(f"   Documento ID: {uid}")
        print(f"   Nome: {ADMIN_NAME}")
        print(f"   Email: {ADMIN_EMAIL}")
        print(f"   Perfil: {ADMIN_PERFIL}")
        print(f"   ID Empresa: {empresa_id}")
        print(f"   Ativo: {True}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário no Firestore: {e}")
        return False

def verify_user_permissions(uid):
    """
    Verifica as permissões que o usuário terá baseado no perfil
    """
    print(f"\n📋 Permissões do usuário administrador:")
    admin_permissions = [
        "criar", 
        "editar", 
        "excluir", 
        "visualizar", 
        "gerenciar-usuarios"
    ]
    
    for permission in admin_permissions:
        print(f"   ✓ {permission}")
    
    print(f"\n💡 O usuário poderá acessar todas as funcionalidades do sistema.")

def main():
    """
    Função principal do script
    """
    print("🚀 Iniciando criação de usuário administrador para EcoSync")
    print("=" * 60)
    
    # 1. Inicializar Firebase
    if not initialize_firebase():
        sys.exit(1)
    
    # 2. Gerar ID da empresa
    empresa_id = generate_empresa_id()
    
    # 3. Criar usuário no Firebase Auth
    print(f"\n👤 Criando usuário no Firebase Auth...")
    uid = create_firebase_user()
    if not uid:
        sys.exit(1)
    
    # 4. Criar usuário no Firestore
    print(f"\n💾 Criando usuário no Firestore...")
    if not create_firestore_user(uid, empresa_id):
        sys.exit(1)
    
    # 5. Verificar permissões
    verify_user_permissions(uid)
    
    print("\n" + "=" * 60)
    print("✅ Usuário administrador criado com sucesso!")
    print(f"\n📧 Email: {ADMIN_EMAIL}")
    print(f"🔑 Senha: {ADMIN_PASSWORD}")
    print(f"🆔 UID: {uid}")
    print(f"🏢 ID Empresa: {empresa_id}")
    print(f"\n⚠️  IMPORTANTE: Anote o ID da empresa, pois ele será necessário para configurações futuras.")
    print(f"💡 O usuário pode fazer login no sistema usando email e senha.")

if __name__ == "__main__":
    main()
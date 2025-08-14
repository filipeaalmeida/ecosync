#!/usr/bin/env python3
"""
Script para criação de usuários de teste (Operador e Visualizador)
Projeto: EcoSync
Data: 2025-08-14
"""

import sys
import os
import uuid
from datetime import datetime, timezone, timedelta
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Configurações dos usuários de teste
USERS_CONFIG = [
    # {
    #     'email': 'filipe@synapses.digital',
    #     'password': 'Senha12345!',
    #     'nome': 'Filipe Almeida',
    #     'perfil': 'administrador'
    # },    
    # {
    #     'email': 'filipe2@synapses.digital',
    #     'password': 'Senha12345!',
    #     'nome': 'João Silva',
    #     'perfil': 'operador'
    # },
    # {
    #     'email': 'filipe3@synapses.digital',
    #     'password': 'Senha12345!',
    #     'nome': 'Maria Souza',
    #     'perfil': 'visualizador'
    # },
    {
        'email': 'filipe11@synapses.digital',
        'password': 'Senha12345!',
        'nome': 'Admin Teste',
        'perfil': 'operador'
    },    
    {
        'email': 'filipe12@synapses.digital',
        'password': 'Senha12345!',
        'nome': 'Operador Teste',
        'perfil': 'operador'
    },
    {
        'email': 'filipe13@synapses.digital',
        'password': 'Senha12345!',
        'nome': 'Visualizador Teste',
        'perfil': 'visualizador'
    }
]

# ID da empresa (usar o mesmo para todos os usuários de teste)
EMPRESA_ID = None  # Será solicitado ao usuário ou gerado

def initialize_firebase():
    """
    Inicializa Firebase usando Application Default Credentials
    """
    try:
        # Verificar se já foi inicializado
        try:
            firebase_admin.get_app()
            print("✅ Firebase já estava inicializado")
            return True
        except ValueError:
            pass
            
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

def get_empresa_id():
    """
    Obtém o ID da empresa (solicita ao usuário ou gera novo)
    """
    global EMPRESA_ID
    
    print("\n🏢 Configuração do ID da Empresa:")
    print("1. Usar ID existente (se você já criou o admin)")
    print("2. Gerar novo ID")
    
    choice = input("\nEscolha (1 ou 2): ").strip()
    
    if choice == '1':
        EMPRESA_ID = input("Digite o ID da empresa existente: ").strip()
        print(f"📝 Usando ID da empresa: {EMPRESA_ID}")
    else:
        EMPRESA_ID = str(uuid.uuid4())
        print(f"📝 Novo ID da empresa gerado: {EMPRESA_ID}")
    
    return EMPRESA_ID

def create_firebase_user(config):
    """
    Cria usuário no Firebase Authentication
    """
    try:
        user_record = auth.create_user(
            email=config['email'],
            password=config['password'],
            display_name=config['nome'],
            email_verified=True
        )
        print(f"✅ Usuário criado no Firebase Auth")
        print(f"   UID: {user_record.uid}")
        print(f"   Email: {user_record.email}")
        print(f"   Nome: {user_record.display_name}")
        return user_record.uid
    except auth.EmailAlreadyExistsError:
        print(f"⚠️  Usuário {config['email']} já existe no Firebase Auth")
        # Buscar UID do usuário existente
        try:
            existing_user = auth.get_user_by_email(config['email'])
            print(f"   UID existente: {existing_user.uid}")
            return existing_user.uid
        except Exception as e:
            print(f"❌ Erro ao buscar usuário existente: {e}")
            return None
    except Exception as e:
        print(f"❌ Erro ao criar usuário no Firebase Auth: {e}")
        return None

def create_firestore_user(uid, config, empresa_id):
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
            'nome': config['nome'],
            'email': config['email'],
            'perfil': config['perfil'],
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
        print(f"   Nome: {config['nome']}")
        print(f"   Email: {config['email']}")
        print(f"   Perfil: {config['perfil']}")
        print(f"   ID Empresa: {empresa_id}")
        print(f"   Ativo: {True}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário no Firestore: {e}")
        return False

def verify_user_permissions(config):
    """
    Verifica as permissões que o usuário terá baseado no perfil
    """
    print(f"\n📋 Permissões do perfil {config['perfil']}:")
    
    permissions_map = {
        'operador': ["criar", "editar", "visualizar"],
        'visualizador': ["visualizar"]
    }
    
    permissions = permissions_map.get(config['perfil'], [])
    
    for permission in permissions:
        print(f"   ✓ {permission}")
    
    if config['perfil'] == 'operador':
        print(f"\n💡 Usuário poderá criar, editar e visualizar processos/exigências")
    elif config['perfil'] == 'visualizador':
        print(f"\n💡 Usuário poderá apenas visualizar dados (somente leitura)")

def main():
    """
    Função principal do script
    """
    print("🚀 Iniciando criação de usuários de teste para EcoSync")
    print("=" * 60)
    
    # 1. Inicializar Firebase
    if not initialize_firebase():
        sys.exit(1)
    
    # 2. Obter ID da empresa
    empresa_id = get_empresa_id()
    
    print("\n" + "=" * 60)
    print("Criando usuários de teste...")
    print("=" * 60)
    
    created_users = []
    
    # 3. Criar cada usuário
    for i, user_config in enumerate(USERS_CONFIG, 1):
        print(f"\n[{i}/{len(USERS_CONFIG)}] Processando usuário: {user_config['nome']}")
        print("-" * 40)
        
        # Criar no Firebase Auth
        print(f"👤 Criando no Firebase Auth...")
        uid = create_firebase_user(user_config)
        if not uid:
            print(f"⚠️  Pulando criação do Firestore para {user_config['email']}")
            continue
        
        # Criar no Firestore
        print(f"💾 Criando no Firestore...")
        if create_firestore_user(uid, user_config, empresa_id):
            created_users.append({
                'uid': uid,
                'email': user_config['email'],
                'nome': user_config['nome'],
                'perfil': user_config['perfil']
            })
        
        # Verificar permissões
        verify_user_permissions(user_config)
    
    # 4. Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO DA CRIAÇÃO")
    print("=" * 60)
    
    if created_users:
        print(f"\n✅ {len(created_users)} usuário(s) criado(s) com sucesso:")
        print(f"\n🏢 ID Empresa: {empresa_id}")
        print("\n📋 Usuários criados:\n")
        
        for user in created_users:
            print(f"   👤 {user['nome']}")
            print(f"      📧 Email: {user['email']}")
            print(f"      🔑 Senha: Senha12345!")
            print(f"      🎭 Perfil: {user['perfil']}")
            print(f"      🆔 UID: {user['uid']}")
            
            if user['perfil'] == 'operador':
                print(f"      📝 Permissões: criar, editar, visualizar")
            elif user['perfil'] == 'visualizador':
                print(f"      📝 Permissões: visualizar")
            print()
    else:
        print("❌ Nenhum usuário foi criado com sucesso")
    
    print("\n⚠️  IMPORTANTE: Todos os usuários usam a mesma senha: Senha12345!")
    print("💡 Os usuários podem fazer login no sistema usando email e senha.")

if __name__ == "__main__":
    main()
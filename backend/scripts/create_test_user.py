#!/usr/bin/env python3
"""
Script para criar um usuário de teste no Firestore
"""
import sys
import os
from datetime import datetime, timezone, timedelta

# Adicionar o diretório raiz do backend ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.env_loader import load_env_from_yaml
from app.utils.firebase import initialize_firebase, get_firestore_client
from firebase_admin import auth

def create_test_user():
    """Cria um usuário de teste no Firebase Auth e Firestore"""
    
    # Carregar configurações e inicializar Firebase
    load_env_from_yaml()
    initialize_firebase()
    
    # Dados do usuário de teste
    email = "admin@ecosync.com"
    password = "Test123456!"
    nome = "Administrador Teste"
    
    try:
        # Criar usuário no Firebase Auth
        print(f"Criando usuário no Firebase Auth: {email}")
        user = auth.create_user(
            email=email,
            password=password,
            display_name=nome
        )
        print(f"Usuário criado com sucesso. UID: {user.uid}")
        
        # Adicionar dados do usuário no Firestore
        db = get_firestore_client()
        
        # Calcular UTC-3
        utc_minus_3 = timezone(timedelta(hours=-3))
        now = datetime.now(utc_minus_3)
        
        user_data = {
            'nome': nome,
            'email': email,
            'perfil': 'Administrador',
            'ativo': True,
            'idEmpresa': 'empresa_teste_123',
            'data_criacao': now,
            'data_atualizacao': now,
            'usuario_criacao': user.uid
        }
        
        print(f"Salvando dados do usuário no Firestore...")
        db.collection('usuarios').document(user.uid).set(user_data)
        print("Dados salvos com sucesso!")
        
        print("\n" + "="*50)
        print("USUÁRIO DE TESTE CRIADO COM SUCESSO!")
        print("="*50)
        print(f"Email: {email}")
        print(f"Senha: {password}")
        print(f"UID: {user.uid}")
        print(f"Perfil: Administrador")
        print(f"ID Empresa: empresa_teste_123")
        print("="*50)
        
    except auth.EmailAlreadyExistsError:
        print(f"Usuário com email {email} já existe")
        
        # Buscar o usuário existente
        existing_user = auth.get_user_by_email(email)
        print(f"UID do usuário existente: {existing_user.uid}")
        
        # Verificar se existe no Firestore
        db = get_firestore_client()
        user_doc = db.collection('usuarios').document(existing_user.uid).get()
        
        if not user_doc.exists:
            print("Usuário não existe no Firestore. Criando...")
            utc_minus_3 = timezone(timedelta(hours=-3))
            now = datetime.now(utc_minus_3)
            
            user_data = {
                'nome': nome,
                'email': email,
                'perfil': 'Administrador',
                'ativo': True,
                'idEmpresa': 'empresa_teste_123',
                'data_criacao': now,
                'data_atualizacao': now,
                'usuario_criacao': existing_user.uid
            }
            
            db.collection('usuarios').document(existing_user.uid).set(user_data)
            print("Dados criados no Firestore com sucesso!")
        else:
            print("Usuário já existe no Firestore")
            print("Dados do usuário:", user_doc.to_dict())
            
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        return False
    
    return True

if __name__ == "__main__":
    create_test_user()
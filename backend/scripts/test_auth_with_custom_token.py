#!/usr/bin/env python3
"""
Script para testar o endpoint /api/auth/me usando custom token
"""
import sys
import os
import requests
import json

# Adicionar o diretório raiz do backend ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.env_loader import load_env_from_yaml
from app.utils.firebase import initialize_firebase
from firebase_admin import auth

def test_auth_me_with_custom_token():
    """Testar o endpoint /api/auth/me com custom token"""
    
    # Carregar configurações e inicializar Firebase
    load_env_from_yaml()
    initialize_firebase()
    
    # UID do usuário de teste criado anteriormente
    uid = "SiHBEkXrVucDq5JpJjTXc2McZdZ2"
    
    try:
        # Criar um custom token para o usuário
        print(f"Criando custom token para UID: {uid}")
        custom_token = auth.create_custom_token(uid)
        
        # Converter bytes para string se necessário
        if isinstance(custom_token, bytes):
            custom_token = custom_token.decode('utf-8')
        
        print(f"Custom token criado com sucesso")
        print(f"Token (primeiros 50 chars): {custom_token[:50]}...")
        
        # Testar endpoint com o custom token
        # Nota: Custom tokens precisam ser trocados por ID tokens primeiro
        # Mas para teste direto, vamos tentar usar o ID token do usuário
        
        # Buscar o usuário para confirmar que existe
        user = auth.get_user(uid)
        print(f"\nUsuário encontrado:")
        print(f"  Email: {user.email}")
        print(f"  Nome: {user.display_name}")
        print(f"  UID: {user.uid}")
        
        # Para teste completo, precisaríamos trocar o custom token por um ID token
        # usando a API REST do Firebase, mas isso requer a API key do projeto
        
        print("\n" + "="*50)
        print("TESTE PARCIAL CONCLUÍDO")
        print("="*50)
        print("✅ Firebase Admin SDK está funcionando")
        print("✅ Usuário existe no Firebase Auth")
        print("✅ Custom token pode ser criado")
        print("\nPara teste completo com ID token:")
        print("1. Configure FIREBASE_API_KEY no env-vars-dev.yaml")
        print("2. Use o frontend para fazer login e obter o ID token")
        print("3. Ou use a API REST do Firebase para trocar custom token por ID token")
        
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    test_auth_me_with_custom_token()
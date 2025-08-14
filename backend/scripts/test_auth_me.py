#!/usr/bin/env python3
"""
Script para testar o endpoint /api/auth/me
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

def get_id_token(email: str, api_key: str):
    """
    Obter ID token usando a API REST do Firebase Auth
    Nota: Em produção, isso seria feito no frontend
    """
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
    
    payload = {
        "email": email,
        "password": "Test123456!",
        "returnSecureToken": True
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        return response.json()['idToken']
    else:
        print(f"Erro ao fazer login: {response.json()}")
        return None

def test_auth_me_endpoint():
    """Testar o endpoint /api/auth/me"""
    
    # Carregar configurações
    load_env_from_yaml()
    
    # Obter a API key do Firebase (você precisa configurar isso)
    # Para testes, você pode obter do console do Firebase
    api_key = os.getenv("FIREBASE_API_KEY")
    
    if not api_key:
        print("AVISO: FIREBASE_API_KEY não configurada.")
        print("Para testar completamente, configure a API key do Firebase.")
        print("Você pode obter a API key no console do Firebase em:")
        print("Configurações do projeto > Geral > Apps Web > Configuração do SDK")
        print("\nTestando apenas a estrutura do endpoint...")
        
        # Teste básico sem autenticação
        response = requests.get("http://localhost:8081/api/auth/me")
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 403:
            print("\n✅ Endpoint está funcionando corretamente!")
            print("   Retornou 403 (Forbidden) como esperado para requisição sem token")
        
        return
    
    # Obter token de autenticação
    email = "admin@ecosync.com"
    print(f"Obtendo token para {email}...")
    id_token = get_id_token(email, api_key)
    
    if not id_token:
        print("Não foi possível obter token de autenticação")
        return
    
    print("Token obtido com sucesso!")
    
    # Testar endpoint com token
    headers = {
        "Authorization": f"Bearer {id_token}"
    }
    
    print("\nTestando endpoint /api/auth/me...")
    response = requests.get("http://localhost:8081/api/auth/me", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ SUCESSO! Dados do usuário retornados:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        # Validar campos esperados
        expected_fields = ['uid', 'nome', 'email', 'perfil', 'permissoes', 'ativo']
        for field in expected_fields:
            if field in data:
                print(f"✓ Campo '{field}' presente")
            else:
                print(f"✗ Campo '{field}' ausente")
        
        # Validar permissões do administrador
        if data.get('perfil') == 'Administrador':
            expected_permissions = ['criar', 'editar', 'excluir', 'visualizar', 'gerenciar-usuarios']
            actual_permissions = data.get('permissoes', [])
            
            print(f"\nPermissões esperadas: {expected_permissions}")
            print(f"Permissões retornadas: {actual_permissions}")
            
            if set(expected_permissions) == set(actual_permissions):
                print("✓ Permissões corretas para Administrador")
            else:
                print("✗ Permissões incorretas para Administrador")
    else:
        print(f"\n❌ ERRO: {response.json()}")

if __name__ == "__main__":
    test_auth_me_endpoint()
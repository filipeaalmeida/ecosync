import os
import yaml
import sys
from pathlib import Path

def load_env_from_yaml():
    """
    Carrega variáveis de ambiente do arquivo YAML.
    Procura por env-vars-dev.yaml para desenvolvimento local.
    NÃO usa valores padrão - se o arquivo não existir, falha.
    """
    # Determinar o caminho base do projeto
    base_path = Path(__file__).parent.parent.parent  # backend/
    deploy_path = base_path / "deploy"
    
    # Arquivo de configuração para desenvolvimento
    env_file = deploy_path / "env-vars-dev.yaml"
    
    if not env_file.exists():
        print(f"ERRO: Arquivo de configuração não encontrado: {env_file}")
        print("Por favor, crie o arquivo env-vars-dev.yaml na pasta deploy/")
        print("Use o arquivo env-vars-prod.yaml.example como referência")
        sys.exit(1)
    
    try:
        # Ler arquivo YAML
        with open(env_file, 'r') as f:
            config = yaml.safe_load(f)
        
        if not config or 'env_variables' not in config:
            print(f"ERRO: Arquivo {env_file} não contém 'env_variables'")
            sys.exit(1)
        
        # Setar variáveis de ambiente
        env_vars = config['env_variables']
        for key, value in env_vars.items():
            os.environ[key] = str(value)
            
        print(f"✓ Variáveis de ambiente carregadas de: {env_file.name}")
        
        # Verificar variáveis obrigatórias
        required_vars = [
            'PORT',
            'ENVIRONMENT', 
            'ALLOWED_ORIGINS',
            'FIREBASE_STORAGE_BUCKET',
        ]
        
        missing_vars = []
        for var in required_vars:
            if var not in env_vars or not env_vars[var]:
                missing_vars.append(var)
        
        if missing_vars:
            print(f"ERRO: Variáveis obrigatórias não configuradas: {', '.join(missing_vars)}")
            sys.exit(1)
            
    except yaml.YAMLError as e:
        print(f"ERRO ao ler arquivo YAML: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"ERRO ao carregar variáveis de ambiente: {e}")
        sys.exit(1)
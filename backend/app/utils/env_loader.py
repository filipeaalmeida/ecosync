import os
import yaml
from pathlib import Path

def load_env_from_yaml():
    """
    Carrega variáveis de ambiente do arquivo YAML apenas para desenvolvimento local.
    Em produção (Cloud Run), as variáveis já são definidas pelo sistema.
    """
    # Verificar se está em ambiente de produção (Cloud Run define estas variáveis automaticamente)
    if os.getenv("K_SERVICE"):  # Variável definida pelo Cloud Run
        print("✓ Executando em Cloud Run - usando variáveis de ambiente do sistema")
        return
        
    # Desenvolvimento local - carregar do arquivo YAML
    base_path = Path(__file__).parent.parent.parent  # backend/
    deploy_path = base_path / "deploy"
    
    # Procurar por arquivo de desenvolvimento local
    env_file = deploy_path / "env-vars-dev-cloud.yaml"  # Usar o example como base
    
    if not env_file.exists():
        print("AVISO: Executando em desenvolvimento sem arquivo YAML")
        print("Para desenvolvimento local, crie env-vars-dev.yaml na pasta deploy/")
        return
    
    try:
        # Ler arquivo YAML
        with open(env_file, 'r') as f:
            config = yaml.safe_load(f)
        
        if not config or 'env_variables' not in config:
            print(f"AVISO: Arquivo {env_file} não contém 'env_variables'")
            return
        
        # Setar variáveis de ambiente apenas se não estiverem definidas
        env_vars = config['env_variables']
        for key, value in env_vars.items():
            if key not in os.environ:
                os.environ[key] = str(value)
            
        print(f"✓ Variáveis de ambiente carregadas de: {env_file.name}")
            
    except yaml.YAMLError as e:
        print(f"AVISO: Erro ao ler arquivo YAML: {e}")
    except Exception as e:
        print(f"AVISO: Erro ao carregar variáveis de ambiente: {e}")
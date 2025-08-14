## Regras do Projeto EcoSync

### ⚠️ IMPORTANTE - Estrutura de Pastas
- **NUNCA** altere nada nas pastas `frontend_old` e `backend_old`. Estas são versões antigas mantidas apenas para referência.
- Todo desenvolvimento deve ser feito nas pastas `frontend` e `backend`.

### Frontend
- Tudo que for criado no frontend precisa estar em português. Todos os textos, nome de menus, botões, etc.
- Todo o desenvolvimento do frontend deve ser feito na pasta `frontend`
- **Header**: Usar sempre o componente `Header` existente em `src/components/Header.tsx`. Nunca desenvolva um novo header.
- **Tabelas com dados do backend**: Toda tabela que buscar dados do backend DEVE implementar paginação. Use o componente `Pagination` (a ser criado em `src/components/Pagination.tsx`) para padronizar a paginação em todas as tabelas.
- **Autenticação**: O frontend NÃO deve verificar se o usuário está autenticado, apenas no momento do login. Quando o backend retornar erro 401 (não autorizado), o frontend deve redirecionar imediatamente para a tela de login. Para isso, TODAS as chamadas de API devem usar EXCLUSIVAMENTE a função `apiCall` de `src/services/api.ts`, que automaticamente intercepta erros 401 e redireciona para `/login`.
- Tecnologia: React com TypeScript e Tailwind CSS
- **Verificação de código**: Após terminar qualquer desenvolvimento no frontend, SEMPRE executar:
  ```bash
  npx tsc --noEmit  # Verifica erros de TypeScript
  npx eslint src/   # Verifica warnings e problemas de código
  ```
  Esses comandos são rápidos (~2-4 segundos) e devem ser executados ANTES de entregar o código como pronto.

### Backend
- Todo o desenvolvimento do backend deve ser feito na pasta `backend`
- Tecnologia: Python com FastAPI
- Banco de dados: Firestore (Firebase)
- Autenticação: Firebase Auth
- Storage de arquivos: Firebase Storage (para documentos dos processos)
- IA: Google Gemini (biblioteca `genai`)
- Deploy: Google Cloud Run

#### Estrutura do Backend:
```
backend/
├── main.py                    # Arquivo principal da aplicação FastAPI
├── requirements.txt           # Dependências para desenvolvimento local
├── app/                       # Código da aplicação
│   ├── __init__.py
│   ├── utils/                 # Utilitários e configurações
│   │   ├── __init__.py
│   │   ├── env_loader.py      # Carrega variáveis de ambiente do YAML
│   │   └── firebase.py        # Integração com Firebase (Auth, Firestore, Storage)
│   ├── models/                # Modelos Pydantic (vazio por enquanto)
│   ├── routers/               # Endpoints da API (vazio por enquanto)
│   ├── middlewares/           # Middlewares de autenticação (vazio por enquanto)
│   └── services/              # Lógica de negócio (quando necessário)
└── deploy/                    # ⚠️ TUDO relacionado a deploy DEVE ficar aqui
    ├── cloudbuild.yaml        # Configuração do Cloud Build
    ├── Dockerfile             # Imagem Docker para produção
    ├── requirements.txt       # Dependências para produção
    ├── env-vars-dev.yaml      # Variáveis de desenvolvimento (NÃO commitado)
    ├── env-vars-prod.yaml     # Variáveis de produção (NÃO commitado)
    ├── env-vars.yaml.example  # Template para produção
    └── README.md              # Instruções de deploy
```

#### ⚠️ IMPORTANTE - Pasta deploy/:
- **TODOS** os arquivos relacionados a deploy devem ficar em `backend/deploy/`
- **NUNCA** coloque arquivos de deploy na raiz do backend
- Os arquivos `env-vars-dev.yaml` e `env-vars-prod.yaml` não são commitados (estão no .gitignore)
- Use os arquivos `.example` como templates

#### Configuração de Variáveis de Ambiente:
- **Desenvolvimento**: `deploy/env-vars-dev.yaml` (carregado por `app/utils/env_loader.py`)
- **Produção**: `deploy/env-vars-prod.yaml` (usado pelo Cloud Build)
- **NÃO usa valores padrão** - o sistema falha se as configurações estiverem incompletas

### Integrações
- Frontend se comunica com Backend via API REST
- Autenticação é feita via Firebase Auth (token JWT)
- Uploads de arquivos vão direto para Firebase Storage
- todas as datas deve ser gravadas no banco de dados pelo backend com o timestamp UTC - 3.

### Setup da Infraestrutura
- Script de setup automatizado: `setup/setup-production.sh`
- **NUNCA** modifique o script para ser interativo - ele deve rodar completamente automatizado
- Configurações de projeto estão no topo do script e devem ser editadas conforme necessário
- O script configura Firebase, GCP APIs, IAM, Storage e Cloud Run automaticamente
- para desenvolvimento local, usar Application Default Credentials (ADC) da GCP e Firebase. NUNCA utilizar credenciais.

### Credenciais de Teste
Para fazer login no sistema durante desenvolvimento e testes, sempre use o usuário abaixo:
- **Email**: `filipe@synapses.digital`
- **Senha**: `Senha12345!`
# EcoSync Backend

Backend da aplicação EcoSync para gestão de licenças ambientais.

## Tecnologias

- **Python 3.11**
- **FastAPI** - Framework web moderno e rápido
- **Firebase** - Autenticação e Storage
- **Firestore** - Banco de dados NoSQL
- **Google Cloud Run** - Plataforma de deploy

## Estrutura do Projeto

```
backend_new/
├── app/
│   ├── models/         # Modelos Pydantic
│   ├── routers/        # Endpoints da API
│   ├── middlewares/    # Middlewares (autenticação, etc)
│   ├── services/       # Lógica de negócio
│   └── utils/          # Utilitários (Firebase, etc)
├── tests/              # Testes
├── main.py            # Arquivo principal
├── requirements.txt   # Dependências
├── Dockerfile        # Configuração Docker
├── cloudbuild.yaml   # Configuração Cloud Build
└── .env.example      # Exemplo de variáveis de ambiente
```

## Configuração Local

### 1. Criar ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com suas configurações
```

### 4. Configurar Firebase

1. Criar projeto no Firebase Console
2. Baixar arquivo de credenciais (serviceAccountKey.json)
3. Colocar o arquivo na raiz do projeto
4. Atualizar GOOGLE_APPLICATION_CREDENTIALS no .env

### 5. Executar localmente

```bash
python main.py
```

A API estará disponível em `http://localhost:8080`

## Documentação da API

Com o servidor rodando, acesse:
- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`

## Deploy no Cloud Run

### Pré-requisitos

1. Conta no Google Cloud Platform
2. Projeto criado no GCP
3. Cloud Build API habilitada
4. Cloud Run API habilitada

### Deploy Manual

```bash
# Build da imagem
docker build -t gcr.io/[PROJECT-ID]/ecosync-backend .

# Push para Container Registry
docker push gcr.io/[PROJECT-ID]/ecosync-backend

# Deploy no Cloud Run
gcloud run deploy ecosync-backend \
  --image gcr.io/[PROJECT-ID]/ecosync-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy Automático (CI/CD)

Configure o Cloud Build para fazer deploy automático a cada push:

1. Conecte seu repositório ao Cloud Build
2. Configure o arquivo `cloudbuild.yaml`
3. Defina as substituições necessárias

## Endpoints Principais

### Autenticação
- `POST /api/auth/verify-token` - Verificar token Firebase
- `GET /api/auth/me` - Dados do usuário autenticado

### Processos
- `GET /api/processos` - Listar processos
- `POST /api/processos` - Criar processo
- `PUT /api/processos/{id}` - Atualizar processo
- `DELETE /api/processos/{id}` - Deletar processo

### Licenças
- `GET /api/licencas` - Listar licenças
- `POST /api/licencas` - Criar licença
- `PUT /api/licencas/{id}` - Atualizar licença
- `POST /api/licencas/{id}/renovar` - Renovar licença

### Exigências
- `GET /api/exigencias` - Listar exigências
- `POST /api/exigencias` - Criar exigência
- `PUT /api/exigencias/{id}` - Atualizar exigência
- `POST /api/exigencias/{id}/concluir` - Concluir exigência

### Dashboard
- `GET /api/dashboard` - Dados consolidados
- `GET /api/dashboard/timeline` - Timeline de eventos
- `GET /api/dashboard/estatisticas` - Estatísticas históricas

## Testes

```bash
# Executar todos os testes
pytest

# Com coverage
pytest --cov=app tests/
```

## Segurança

- Autenticação via Firebase Auth
- Tokens JWT verificados em cada requisição
- CORS configurado para domínios específicos
- Variáveis sensíveis em variáveis de ambiente
- Usuário não-root no container Docker

## Monitoramento

O Cloud Run fornece métricas automáticas:
- Latência
- Requisições por segundo
- Uso de CPU e memória
- Logs estruturados

Acesse pelo Console do GCP em Cloud Run > Metrics
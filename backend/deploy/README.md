# Deploy do Backend no Cloud Run

## Arquivos de Deploy

- **`cloudbuild.yaml`**: Configuração do Cloud Build para deploy automático
- **`env-vars-prod.yaml`**: Variáveis de ambiente de produção (não versionado)
- **`env-vars-prod.yaml.example`**: Template das variáveis de ambiente

## Como Fazer o Deploy

### 1. Configurar o Projeto no GCP
```bash
# Definir projeto
gcloud config set project ecosync-project

# Habilitar APIs necessárias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar template e preencher com valores reais
cp env-vars-prod.yaml.example env-vars-prod.yaml
# Editar env-vars-prod.yaml com seus valores
```

### 3. Adicionar Credenciais do Firebase
Coloque o arquivo `serviceAccountKey.json` na raiz do backend antes do deploy.

### 4. Deploy Manual
```bash
# Da pasta backend/deploy
gcloud builds submit --config=cloudbuild.yaml ..
```

### 5. Deploy Automático (CI/CD)
Configure um Cloud Build Trigger no Console do GCP:
1. Cloud Build > Triggers
2. Criar trigger
3. Conectar repositório
4. Arquivo de configuração: `backend/deploy/cloudbuild.yaml`
5. Configurar substitutions se necessário

## Variáveis de Ambiente

Todas as variáveis estão definidas em `env-vars-prod.yaml` (não versionado) e são configuradas automaticamente pelo `cloudbuild.yaml`.

Para atualizar variáveis após o deploy:
```bash
gcloud run services update ecosync-backend \
  --update-env-vars KEY=value \
  --region=us-central1
```

## URLs de Produção

Após o deploy, o Cloud Run fornecerá uma URL como:
- `https://ecosync-backend-xxxxx-uc.a.run.app`

Configure esta URL no frontend para consumir a API.
# Deploy do Backend no Cloud Run

## Arquivos de Deploy

- **`deploy-backend.sh`**: Script simplificado de deploy direto do source
- **`env-vars-prod-gcloud.yaml`**: Variáveis de ambiente de produção (não versionado)
- **`env-vars-dev-gcloud.yaml`**: Variáveis de ambiente de desenvolvimento (não versionado)
- **`env-vars.yaml.example`**: Template das variáveis de ambiente

## Como Fazer o Deploy

### 1. Configurar Variáveis de Ambiente
```bash
# Criar arquivos de configuração baseados no template
cp env-vars.yaml.example env-vars-prod-gcloud.yaml
cp env-vars.yaml.example env-vars-dev-gcloud.yaml

# Editar os arquivos com os valores corretos para cada ambiente
```

### 2. Deploy Simples
```bash
# Deploy para produção (default)
./deploy-backend.sh

# Deploy para desenvolvimento
./deploy-backend.sh dev
```

### 3. Deploy Manual com gcloud
```bash
# O script executa internamente este comando:
gcloud run deploy ecosync-backend \
  --source ../ \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --timeout 1800 \
  --min-instances 0 \
  --max-instances 10 \
  --env-vars-file env-vars-prod-gcloud.yaml
```

## Variáveis de Ambiente

As variáveis são carregadas dos arquivos `env-vars-*-gcloud.yaml`:
- Formato simples: `KEY: "value"`
- Não usar variável `PORT` (definida automaticamente pelo Cloud Run)
- Arquivos não são versionados (estão no .gitignore)

## URLs de Produção

Após o deploy, o Cloud Run fornecerá URLs como:
- **Produção**: `https://ecosync-backend-687164090326.us-central1.run.app`
- **Desenvolvimento**: `https://ecosync-backend-xxxxx-uc.a.run.app`

Configure estas URLs no frontend para consumir a API.

## Endpoints Disponíveis

- `GET /` - Informações básicas da API
- `GET /health` - Healthcheck com status dos serviços (Firestore, Storage)
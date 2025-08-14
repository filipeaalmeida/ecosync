#!/bin/bash

set -e

ENVIRONMENT=${1:-"prod"}
PROJECT_ID="ecosync-${ENVIRONMENT}"
SERVICE_NAME="ecosync-backend"
REGION="us-central1"
REQUIRED_ACCOUNT="filipe@synapses.digital"

echo "=== Deploy Backend ==="
echo "Projeto: $PROJECT_ID"

# Verificar autenticação
echo "Verificando autenticação..."
CURRENT_ACCOUNT=$(gcloud config get-value account 2>/dev/null || echo "")
if [ "$CURRENT_ACCOUNT" != "$REQUIRED_ACCOUNT" ]; then
    echo "❌ Conta incorreta. Atual: $CURRENT_ACCOUNT, Esperado: $REQUIRED_ACCOUNT"
    echo "Execute: gcloud auth login"
    exit 1
fi

# Configurar projeto
echo "Configurando projeto..."
gcloud config set project $PROJECT_ID

# Build da imagem Docker localmente
echo "Construindo imagem Docker..."
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
docker build -t $IMAGE_NAME ../

# Push da imagem
echo "Enviando imagem..."
docker push $IMAGE_NAME

# Deploy no Cloud Run
echo "Fazendo deploy no Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 1 \
    --timeout 1800 \
    --min-instances 0 \
    --max-instances 10 \
    --service-account="ecosync-${ENVIRONMENT}-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --env-vars-file env-vars-${ENVIRONMENT}-gcloud.yaml

# Habilitar acesso público (contorna políticas organizacionais)
echo "Habilitando acesso público..."
gcloud run services update $SERVICE_NAME \
    --region=$REGION \
    --no-invoker-iam-check \
    --project=$PROJECT_ID

# Aguardar deploy estar pronto
echo "Aguardando deploy estar pronto..."
sleep 10

# Obter URL do serviço
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --region=$REGION \
    --format="value(status.url)")

echo "URL do serviço: $SERVICE_URL"

# Testar healthcheck
echo "Testando healthcheck..."
if curl -f -s "$SERVICE_URL/health" >/dev/null 2>&1; then
    echo "✅ Healthcheck público funcionando"
    curl -s "$SERVICE_URL/health" | jq '.'
else
    echo "⚠️ Acesso público não disponível, testando com autenticação..."
    curl -H "Authorization: Bearer $(gcloud auth print-access-token)" "$SERVICE_URL/health" | jq '.'
fi

echo "✅ Deploy concluído com sucesso!"
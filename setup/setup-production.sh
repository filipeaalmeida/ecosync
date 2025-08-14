#!/bin/bash

# =============================================================================
# Setup Automatizado para Produção na GCP
# =============================================================================

set -e

# Parâmetro de início (default: 0)
START_SECTION=${1:-0}

echo "=== Setup de Infraestrutura GCP ==="
echo "Iniciando da seção: $START_SECTION"
echo ""

# =============================================================================
# CONFIGURAÇÕES - ALTERE AQUI ANTES DE EXECUTAR
# =============================================================================

# Configurações principais
PROJECT_SHORT_NAME="ecosync"
PROJECT_FULL_NAME="EcoSync"
ENVIRONMENT="prod"
REGION="us-central1"

# Variáveis calculadas dinamicamente
PROJECT_ID="${PROJECT_SHORT_NAME}-${ENVIRONMENT}"
ENVIRONMENT_UPPER=$(echo "$ENVIRONMENT" | tr '[:lower:]' '[:upper:]')
PROJECT_NAME="${PROJECT_FULL_NAME} ${ENVIRONMENT_UPPER}"
STORAGE_BUCKET="${PROJECT_ID}-bucket"
SERVICE_ACCOUNT_NAME="${PROJECT_ID}-sa"
SERVICE_ACCOUNT_DISPLAY_NAME="${PROJECT_FULL_NAME} Service Account"
GCLOUD_CONFIG_NAME="${PROJECT_ID}-config"


echo "Configurações calculadas:"
echo "  PROJECT_ID: $PROJECT_ID"
echo "  PROJECT_NAME: $PROJECT_NAME"
echo "  STORAGE_BUCKET: $STORAGE_BUCKET"
echo "  SERVICE_ACCOUNT_NAME: $SERVICE_ACCOUNT_NAME"
echo "  SERVICE_ACCOUNT_DISPLAY_NAME: $SERVICE_ACCOUNT_DISPLAY_NAME"
echo "  GCLOUD_CONFIG_NAME: $GCLOUD_CONFIG_NAME"
echo "  REGION: $REGION"
echo ""


# =============================================================================
# 0. AUTENTICAÇÃO
# =============================================================================

if [ $START_SECTION -le 0 ]; then
    echo ">>> SEÇÃO 0: AUTENTICAÇÃO"
    
    # Limpar credenciais antigas para garantir estado limpo
    echo "Limpando credenciais antigas..."
    gcloud auth revoke --all 2>/dev/null || true

    echo "Fazendo autenticação no Google Cloud..."
    echo "Selecione a conta desejada na janela do browser que será aberta."
    echo ""

    # Criar/ativar configuração específica para este projeto
    echo "Criando configuração $GCLOUD_CONFIG_NAME..."
    gcloud config configurations create $GCLOUD_CONFIG_NAME 2>/dev/null || gcloud config configurations activate $GCLOUD_CONFIG_NAME

    # Fazer login interativo
    gcloud auth login

    echo ""
    echo "✅ Autenticação da conta concluída!"
    echo ""

    # Mostrar informações da conta para confirmação
    ACTIVE_ACCOUNT=$(gcloud config get-value account)
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "nenhum")

    echo "Informações da sessão atual:"
    echo "  Conta: $ACTIVE_ACCOUNT"
    echo "  Projeto atual: $CURRENT_PROJECT"
    echo ""
    echo "⚠️  IMPORTANTE: Este script criará/configurará o projeto: $PROJECT_ID"
    echo "   Tudo será cobrado na conta: $ACTIVE_ACCOUNT"
    echo ""

    read -p "Confirma que esta é a conta correta para cobrar o projeto $PROJECT_ID? (y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "❌ Operação cancelada pelo usuário"
        echo "Execute 'gcloud auth login' novamente com a conta correta"
        exit 1
    fi

    echo ""
    echo "✅ Conta confirmada. Continuando setup do projeto $PROJECT_ID..."
    echo ""
else
    echo ">>> Pulando SEÇÃO 0: AUTENTICAÇÃO"
fi


# =============================================================================
# 1. CRIAÇÃO E CONFIGURAÇÃO DO PROJETO
# =============================================================================

if [ $START_SECTION -le 1 ]; then
    echo ">>> SEÇÃO 1: CRIAÇÃO E CONFIGURAÇÃO DO PROJETO"
    echo "Criando projeto $PROJECT_ID..."

    # Criar projeto (se não existir)
    if ! gcloud projects describe $PROJECT_ID >/dev/null 2>&1; then
        echo "Projeto não existe. Criando..."
        gcloud projects create $PROJECT_ID --name="$PROJECT_NAME"
        
        # Aguardar a criação
        echo "Aguardando criação do projeto..."
        sleep 10
    else
        echo "Projeto já existe. Continuando..."
    fi

    echo "Configurando projeto $PROJECT_ID..."
    gcloud config set project $PROJECT_ID

    # Fazer login no Firebase CLI após configurar o projeto
    echo "Fazendo login no Firebase CLI..."
    firebase logout 2>/dev/null || true  # Limpa sessão anterior se existir
    firebase login

    # Verificar se há billing account configurado
    echo "Verificando billing account..."
    BILLING_ACCOUNT=$(gcloud beta billing projects describe $PROJECT_ID --format="value(billingAccountName)" 2>/dev/null)

    if [[ -z "$BILLING_ACCOUNT" || "$BILLING_ACCOUNT" == "" ]]; then
        echo ""
        echo "❌ ERRO: Billing account não configurado!"
        echo ""
        echo "O projeto precisa de uma billing account para usar os serviços GCP."
        echo "Configure o billing em: https://console.cloud.google.com/billing"
        echo ""
        echo "Passos:"
        echo "1. Acesse o link acima"
        echo "2. Selecione o projeto: $PROJECT_ID"
        echo "3. Vincule a uma billing account"
        echo "4. Execute este script novamente"
        echo ""
        exit 1
    fi

    echo "✅ Billing account configurado: $BILLING_ACCOUNT"
    echo ""
else
    echo ">>> Pulando SEÇÃO 1: CRIAÇÃO E CONFIGURAÇÃO DO PROJETO"
fi

# =============================================================================
# 2. HABILITAÇÃO DE APIs
# =============================================================================

if [ $START_SECTION -le 2 ]; then
    echo ">>> SEÇÃO 2: HABILITAÇÃO DE APIs"
    echo "Habilitando APIs necessárias..."
    
    gcloud services enable \
      compute.googleapis.com \
      run.googleapis.com \
      cloudbuild.googleapis.com \
      containerregistry.googleapis.com \
      firebase.googleapis.com \
      firestore.googleapis.com \
      storage.googleapis.com \
      iam.googleapis.com \
      generativelanguage.googleapis.com \
      cloudfunctions.googleapis.com \
      cloudtasks.googleapis.com

    # Configurar região após APIs habilitadas
    echo "Configurando região padrão..."
    gcloud config set compute/region $REGION
else
    echo ">>> Pulando SEÇÃO 2: HABILITAÇÃO DE APIs"
fi

# =============================================================================
# 3. CONFIGURAÇÃO DO FIREBASE
# =============================================================================

if [ $START_SECTION -le 3 ]; then
    echo ">>> SEÇÃO 3: CONFIGURAÇÃO DO FIREBASE"
    echo "Configurando Firebase..."

    # Verificar se Firebase está logado
    echo "Verificando autenticação do Firebase..."
    firebase projects:list > /dev/null 2>&1 || {
        echo "Firebase não está autenticado. Por favor, faça login manualmente:"
        echo "Execute: firebase login"
        echo "Depois execute este script novamente."
        exit 1
    }

    # Verificar se o projeto já tem Firebase configurado
    echo "Verificando se Firebase já está configurado no projeto $PROJECT_ID..."
    if firebase projects:list 2>/dev/null | grep "$PROJECT_ID"; then
        echo "✅ Firebase já está configurado neste projeto."
    else
        # Aguardar um pouco para garantir que o projeto está pronto
        echo "Aguardando projeto estar totalmente provisionado..."
        sleep 5

        # Tentar adicionar Firebase ao projeto
        echo "Adicionando Firebase ao projeto $PROJECT_ID..."
        firebase projects:addfirebase $PROJECT_ID 2>&1 | tee firebase-add.log
        FIREBASE_RESULT=${PIPESTATUS[0]}

        if [ $FIREBASE_RESULT -ne 0 ]; then
            echo ""
            echo "❌ Não foi possível adicionar Firebase automaticamente."
            echo ""
            echo "   AÇÃO NECESSÁRIA:"
            echo "   ----------------"
            echo "   1. Abra: https://console.firebase.google.com"
            echo "   2. Clique em 'Adicionar projeto'"
            echo "   3. Selecione o projeto existente: $PROJECT_ID"
            echo "   4. Siga as instruções na tela"
            echo ""
            echo "   Depois de adicionar Firebase, execute este script novamente."
            echo ""
            rm -f firebase-add.log
            exit 1
        fi

        echo "✅ Firebase adicionado com sucesso!"
        rm -f firebase-add.log
    fi

    # Configurar Firestore
    echo "Verificando Firestore..."
    if gcloud firestore databases describe --project=$PROJECT_ID >/dev/null 2>&1; then
        echo "✅ Firestore já está configurado."
    else
        echo "Criando banco de dados Firestore..."
        gcloud firestore databases create \
          --location=$REGION \
          --project=$PROJECT_ID \
          --type=firestore-native || {
            echo "❌ Erro ao criar Firestore. Verifique as permissões."
            exit 1
        }
        echo "✅ Firestore criado com sucesso!"
    fi

    # Configurar Authentication
    # (Provedores serão configurados manualmente no console)

    # Configurar Firebase Hosting
    echo "Verificando Firebase Hosting..."
    firebase hosting:sites:list --project $PROJECT_ID 2>/dev/null | grep -q $PROJECT_ID || {
        echo "Criando site do Firebase Hosting..."
        firebase hosting:sites:create $PROJECT_ID --project $PROJECT_ID || echo "  Site de hosting pode já existir."
    }
    echo "✅ Firebase Hosting configurado."
else
    echo ">>> Pulando SEÇÃO 3: CONFIGURAÇÃO DO FIREBASE"
fi

# =============================================================================
# 4. CONFIGURAÇÃO IAM
# =============================================================================

if [ $START_SECTION -le 4 ]; then
    echo ">>> SEÇÃO 4: CONFIGURAÇÃO IAM"
    echo "Configurando IAM..."

    # Criar service account para Cloud Run
    echo "Verificando Service Account..."
    if gcloud iam service-accounts describe "${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" --project=$PROJECT_ID >/dev/null 2>&1; then
        echo "✅ Service Account já existe."
    else
        echo "Criando Service Account..."
        gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
          --display-name="$SERVICE_ACCOUNT_DISPLAY_NAME"
        echo "✅ Service Account criada com sucesso!"
    fi

    # Configurar permissões necessárias
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/datastore.user"

    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/storage.objectAdmin"

    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/firebase.admin"

    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/cloudfunctions.developer"

    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/cloudtasks.admin"

else
    echo ">>> Pulando SEÇÃO 4: CONFIGURAÇÃO IAM"
fi

# =============================================================================
# 5. CONFIGURAÇÃO DO STORAGE
# =============================================================================

if [ $START_SECTION -le 5 ]; then
    echo ">>> SEÇÃO 5: CONFIGURAÇÃO DO STORAGE"
    echo "Configurando Cloud Storage..."

    # Criar bucket principal
    echo "Verificando Storage Bucket..."
    if gsutil ls -b gs://$STORAGE_BUCKET >/dev/null 2>&1; then
        echo "✅ Storage Bucket já existe."
    else
        echo "Criando Storage Bucket..."
        gsutil mb -l $REGION gs://$STORAGE_BUCKET
        echo "✅ Storage Bucket criado com sucesso!"
    fi

    # Configurar CORS para frontend
    echo '[
      {
        "origin": ["*"],
        "method": ["GET", "PUT", "POST", "DELETE"],
        "responseHeader": ["Content-Type"],
        "maxAgeSeconds": 3600
      }
    ]' | gsutil cors set /dev/stdin gs://$STORAGE_BUCKET
else
    echo ">>> Pulando SEÇÃO 5: CONFIGURAÇÃO DO STORAGE"
fi

# =============================================================================
# 6. CONFIGURAÇÃO PARA USO FUTURO (COMENTADO)
# =============================================================================

# Cloud Tasks - APIs habilitadas, permissões configuradas
# Queues serão criadas quando necessário
# Exemplo de criação de queue:
# gcloud tasks queues create nome-da-queue \
#   --location=$REGION \
#   --max-concurrent-dispatches=100 \
#   --max-retry-duration=3600s

# =============================================================================
# OUTPUTS
# =============================================================================

echo ""
echo "=== SETUP DE INFRAESTRUTURA CONCLUÍDO ==="
echo ""
echo "Informações importantes:"
echo "  Projeto: $PROJECT_ID"
echo "  Região: $REGION"
echo "  Storage Bucket: gs://$STORAGE_BUCKET"
echo "  Service Account: ${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
echo ""
echo "Próximos passos:"
echo "1. Configure env-vars-prod.yaml com PROJECT_ID=$PROJECT_ID"
echo "2. Configure Firebase Authentication no console"
echo "3. Obtenha a chave do Gemini API e configure GEMINI_API_KEY"
echo "4. Faça o deploy do backend usando:"
echo "   cd backend/deploy && ./deploy-backend.sh"
echo "5. Configure firebase.json e faça deploy do frontend:"
echo "   cd frontend && firebase init hosting && firebase deploy"
echo ""
if [ -f "serviceAccountKey.json" ]; then
    echo "Arquivos gerados:"
    echo "  - serviceAccountKey.json (mova para local seguro)"
else
    echo "Notas sobre autenticação:"
    echo "  - Chave JSON não foi criada (política organizacional)"
    echo "  - Use Workload Identity no Cloud Run (automático)"
    echo "  - Para dev local: gcloud auth application-default login"
fi
echo ""
echo "APIs e permissões configuradas para uso futuro:"
echo "  - Cloud Functions (deploy manual quando necessário)"
echo "  - Cloud Tasks (queues criadas conforme demanda)"
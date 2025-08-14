#!/bin/bash

# Deploy do Frontend EcoSync para Firebase Hosting

set -e

# Definir o projeto (qa ou prod)
ENV=${1:-prod}
REQUIRED_ACCOUNT="filipe@synapses.digital"

if [ "$ENV" = "prod" ]; then
    PROJECT_ID="ecosync-prod"
elif [ "$ENV" = "qa" ]; then
    PROJECT_ID="ecosync-qa"
else
    echo "Ambiente inválido. Use: ./deploy-frontend.sh [qa|prod]"
    exit 1
fi

echo "=== Deploy Frontend ==="
echo "Projeto: $PROJECT_ID"

# Verificar autenticação do Firebase
echo "Verificando autenticação..."
CURRENT_ACCOUNT=$(firebase login:list 2>/dev/null | grep "✓" | awk '{print $2}' || echo "")
if [ "$CURRENT_ACCOUNT" != "$REQUIRED_ACCOUNT" ]; then
    echo "❌ Conta incorreta. Atual: $CURRENT_ACCOUNT, Esperado: $REQUIRED_ACCOUNT"
    echo "Execute: firebase login"
    exit 1
fi

# Configurar projeto do Firebase
echo "Configurando projeto..."
firebase use $PROJECT_ID --add 2>/dev/null || firebase use $PROJECT_ID

# Voltar para a raiz do projeto
cd "$(dirname "$0")/../.."

# Build da aplicação
echo "Construindo aplicação..."
cd frontend
npm run build

# Deploy para Firebase Hosting (da raiz do projeto)
echo "Fazendo deploy..."
cd ..
firebase deploy --only hosting --project $PROJECT_ID

echo "✅ Deploy concluído para $ENV ($PROJECT_ID)"
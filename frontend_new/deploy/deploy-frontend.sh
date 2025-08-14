#!/bin/bash

set -e

ENVIRONMENT=${1:-"prod"}
PROJECT_ID="ecosync-${ENVIRONMENT}"

echo "=== Deploy Frontend ==="
echo "Projeto: $PROJECT_ID"

# Build do projeto
npm run build

# Deploy para Firebase Hosting
firebase deploy --project $PROJECT_ID --only hosting

echo "✅ Deploy concluído"
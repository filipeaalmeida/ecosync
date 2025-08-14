# Regras para Criação do Backend - EcoSync

*Conjunto completo de regras e diretrizes para implementação do backend*

## 1. Arquitetura Geral

### 1.1 Sistema Multi-tenant
- **OBRIGATÓRIO**: Todos os modelos devem ter o campo `idEmpresa`
- O backend deve **automaticamente** filtrar todos os dados pelo `idEmpresa` do usuário
- O `idEmpresa` é obtido do usuário autenticado (Firebase Auth), **nunca** da requisição
- Usuários só podem acessar dados da sua própria empresa

### 1.2 Autenticação e Autorização
- **Login, logout, reset e change password são gerenciados pelo Firebase Auth** - não implementar no backend
- Único endpoint de autenticação: `GET /api/auth/me` (dados do usuário atual + permissões)
- Todas as requisições devem validar o token JWT do Firebase Auth
- **Sistema de permissões**: Cada rota deve validar se o usuário tem a permissão necessária
- Frontend deve mapear telas/funcionalidades baseado nas **permissões**, não no perfil

### 1.3 Sistema de Permissões

#### 1.3.1 Middleware de Autorização
- **OBRIGATÓRIO**: Criar middleware que valida permissões para cada rota
- O middleware deve verificar se o usuário tem a permissão necessária antes de executar a rota
- Retornar 403 Forbidden se o usuário não tiver a permissão necessária

#### 1.3.2 Mapa de Rotas x Permissões
```python
ROUTE_PERMISSIONS = {
    # Autenticação
    "GET /api/auth/me": [],  # Sem permissão específica - apenas autenticado
    
    # Usuários (apenas admin)
    "GET /api/usuarios": ["gerenciar-usuarios"],
    
    # Busca (todos podem buscar)
    "GET /api/search": ["visualizar"],
    
    # Processos
    "GET /api/processos": ["visualizar"],
    "POST /api/processos": ["criar"],
    "GET /api/processos/{id}": ["visualizar"],
    "PUT /api/processos/{id}": ["editar"],
    "DELETE /api/processos/{id}": ["excluir"],
    "GET /api/processos/upload-url": ["criar"],
    "GET /api/processos/{id}/download-url": ["visualizar"],
    
    # Exigências
    "GET /api/exigencias": ["visualizar"],
    "GET /api/exigencias/status": ["visualizar"],
    "POST /api/exigencias": ["criar"],
    "PUT /api/exigencias/{id}": ["editar"],
    "DELETE /api/exigencias/{id}": ["excluir"],
    "PATCH /api/exigencias/{id}/status": ["editar"],
    "PATCH /api/exigencias/{id}/responsavel": ["editar"],
    "GET /api/exigencias/export": ["visualizar"],
    
    # Notificações
    "GET /api/notificacoes": ["visualizar"],
    "GET /api/notificacoes/resumo": ["visualizar"],
    "PATCH /api/notificacoes/{id}/marcar-lida": ["visualizar"],
    "PATCH /api/notificacoes/marcar-todas-lidas": ["visualizar"],
    "GET /api/processos/{id}/notificacoes": ["visualizar"],
    "POST /api/processos/{id}/notificacoes": ["editar"],
    "DELETE /api/processos/notificacoes/{id}": ["editar"],
}
```

#### 1.3.3 Permissões por Perfil
- **Administrador**: `["criar", "editar", "excluir", "visualizar", "gerenciar-usuarios"]`
- **Operador**: `["criar", "editar", "visualizar"]`
- **Visualizador**: `["visualizar"]`

#### 1.3.4 Endpoint /api/auth/me
- **OBRIGATÓRIO**: Deve retornar as permissões do usuário, não apenas o perfil
- Resposta deve incluir:
```json
{
  "uid": "user123",
  "nome": "João Silva",
  "email": "joao@ecosync.com",
  "perfil": "Administrador",
  "permissoes": ["criar", "editar", "excluir", "visualizar", "gerenciar-usuarios"],
  "ativo": true
}
```
- Frontend usa o array `permissoes` para controlar acesso às funcionalidades

### 1.4 Datas e Timestamps
- **Todas as datas devem ser gravadas com timestamp UTC-3**
- Campos obrigatórios em todos os modelos: `data_criacao`, `data_atualizacao`, `idEmpresa`

## 2. Upload e Download de Arquivos

### 2.1 Fluxo de Upload
1. Frontend solicita URL assinada: `GET /api/processos/upload-url`
2. Backend gera URL assinada do Firebase Storage e retorna `upload_url` + `file_id`
3. Frontend faz upload diretamente para o Firebase Storage
4. Frontend envia apenas o `file_id` para criar processo: `POST /api/processos`

### 2.2 Fluxo de Download
1. Frontend solicita URL assinada: `GET /api/processos/{id}/download-url`
2. Backend gera URL assinada e retorna `download_url` + `expires_in`
3. Frontend faz download diretamente do Firebase Storage

### 2.3 Regras de Upload/Download
- **Nunca** enviar bytes de arquivo para o backend
- URLs assinadas devem ter expiração (padrão: 1 hora)
- Validar tipo de arquivo (apenas PDF para processos)

## 3. Criação de Processos com IA

### 3.1 Fluxo Sincronamente
- `POST /api/processos` recebe **apenas** o `file_id`
- Backend deve **sincronamente**:
  1. Baixar o arquivo do Firebase Storage
  2. Executar análise com IA (Google Gemini)
  3. Extrair dados do processo
  4. Criar o processo no banco
  5. Retornar o processo criado com dados extraídos

### 3.2 Resposta da Criação
```json
{
  "id": "proc123",
  "processo": {
    "numero_processo": "LO_CIRANDA_02",
    "tipo": "LICENÇA DE OPERAÇÃO",
    "razao_social": "CIRANDA 4 ENERGIAS RENOVÁVEIS S.A.",
    // ... demais campos extraídos
  },
  "message": "Processo criado com sucesso",
  "success": true
}
```

## 4. Exigências e Status

### 4.1 Status de Exigências
- **OBRIGATÓRIO**: Usar IDs para status, não nomes de exibição
- IDs válidos: `"nao-iniciado"`, `"em-progresso"`, `"pendente"`, `"concluido"`
- Endpoint `GET /api/exigencias/status` retorna lista com `id`, `nome` e `cor`

### 4.2 Campo Responsável
- O campo correto é `responsavel` (UID do usuário), **não** `atribuido_a`
- Sempre usar UID do Firebase Auth como valor
- Filtros também devem usar `responsavel` nos parâmetros

### 4.3 Filtro por Processo
- **Não implementar** `GET /api/processos/{id}/exigencias`
- Usar `GET /api/exigencias` com parâmetro `processo_id`

## 5. Notificações

### 5.1 Dados das Notificações
- **Não incluir** `usuario_criacao` (criadas pelo sistema)
- **Não incluir** `descricao_completa` (usar apenas `titulo`)
- Campo `responsavel` deve ser renomeado para `atribuido_por` (UID do usuário)

### 5.2 Regras de Notificação Consolidadas
- **Consolidar** endpoints de criação em um único: `POST /api/processos/{id}/notificacoes`
- Parâmetro `tipo_regra`: `'prazo_antecipado'`, `'renovacao_antecipada'`, `'vencimento'`
- Adicionar `DELETE /api/processos/notificacoes/{id}` para remover regras

## 6. Campos de Processo

### 6.1 Notificações de Atribuição
- **Remover** campo `notificar_atribuicao` (não persistir no banco)
- **Manter** apenas:
  - `notificar_atribuicao_sistema`: boolean
  - `notificar_atribuicao_email`: boolean

### 6.2 Campos Obrigatórios
Todos os modelos devem ter:
```python
data_criacao: datetime  # UTC-3
data_atualizacao: datetime  # UTC-3  
idEmpresa: str  # Obtido automaticamente do usuário
```

## 7. Endpoints Removidos/Modificados

### 7.1 Endpoints Removidos (gerenciados pelo Firebase)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`

### 7.2 Endpoints Modificados
- `GET /api/processos/{id}/download` → `GET /api/processos/{id}/download-url`
- `POST /api/processos/upload` → `GET /api/processos/upload-url`
- `GET /api/processos/{id}/exigencias` → Usar `GET /api/exigencias?processo_id={id}`

### 7.3 Endpoints Consolidados
- Notificações: 3 endpoints → 1 endpoint `POST /api/processos/{id}/notificacoes`

## 8. Validações Obrigatórias

### 8.1 Validações de Negócio
- **Processo**: `numero_processo` único por empresa
- **Exigência**: `responsavel` deve ser UID válido
- **Status**: Deve usar IDs válidos (`nao-iniciado`, `em-progresso`, etc.)
- **Multi-tenancy**: Todas as operações filtradas por `idEmpresa`

### 8.2 Tratamento de Erros
- Usar códigos HTTP apropriados (400, 401, 404, 422)
- Retornar mensagens de erro claras
- Validar dados de entrada rigorosamente

## 9. Performance e Índices

### 9.1 Índices Obrigatórios do Firestore
```typescript
// usuarios
idEmpresa + ativo
email (único)

// processos  
idEmpresa + usuario_id + data_validade
idEmpresa + usuario_id + prazo_renovacao

// exigencias
idEmpresa + processo_id + status
idEmpresa + usuario_id + status + prazo

// notificacoes
idEmpresa + usuario_id + lida + data_criacao (desc)
```

### 9.2 Paginação
- **Todas** as listagens devem implementar paginação
- Usar cursor-based pagination do Firestore
- Limite máximo: 100 itens por página
- Retornar metadados: `total`, `page`, `pages`, `has_next`, `has_prev`

## 10. Segurança e Isolamento

### 10.1 Isolamento de Dados
- **NUNCA** permitir especificar `idEmpresa` nas requisições
- **SEMPRE** obter `idEmpresa` do usuário autenticado
- **VALIDAR** que operações só acessem dados da empresa do usuário

### 10.2 URLs Assinadas
- Expiração padrão: 1 hora
- Validar permissões antes de gerar URLs
- Logs de auditoria para downloads

## 11. Estrutura de Resposta Padrão

### 11.1 Listagens
```json
{
  "items": [...],
  "total": 150,
  "page": 1,
  "pages": 15,
  "has_next": true,
  "has_prev": false
}
```

### 11.2 Operações
```json
{
  "message": "Operação realizada com sucesso",
  "success": true,
  "data": {...}  // opcional
}
```

### 11.3 Erros
```json
{
  "message": "Descrição do erro",
  "success": false,
  "errors": [...]  // opcional para erros de validação
}
```

## 12. Integração com Serviços

### 12.1 Firebase Services
- **Auth**: Validação de tokens JWT
- **Firestore**: Banco de dados principal
- **Storage**: Armazenamento de PDFs
- **Cloud Run**: Deploy da aplicação

### 12.2 Google Gemini
- Análise de PDFs sincronamente
- Extração de dados estruturados
- Tratamento de erros da IA

## 13. Variáveis de Ambiente

### 13.1 Configuração Obrigatória
```yaml
# Firebase
FIREBASE_PROJECT_ID: "ecosync-prod"
FIREBASE_STORAGE_BUCKET: "ecosync-prod.appspot.com"

# Google Gemini
GEMINI_API_KEY: "..."

# Aplicação
APP_ENV: "production"
DEBUG: false
```

### 13.2 Carregamento
- **NUNCA** usar valores padrão com `os.getenv("VAR", "default")`
- Aplicação deve falhar se configurações obrigatórias não estiverem presentes
- Usar `app/utils/env_loader.py` para carregar variáveis do YAML

## 14. Estrutura de Diretórios

### 14.1 Organização do Código
```
backend/
├── main.py                    # Entrada da aplicação
├── app/
│   ├── utils/                 # Firebase, env_loader
│   ├── models/                # Modelos Pydantic
│   ├── routers/               # Endpoints por funcionalidade
│   ├── middlewares/           # Autenticação, CORS
│   └── services/              # Lógica de negócio
└── deploy/                    # TODOS os arquivos de deploy
    ├── Dockerfile
    ├── requirements.txt
    ├── cloudbuild.yaml
    └── env-vars-*.yaml
```

### 14.2 Regras de Deploy
- **TUDO** relacionado a deploy deve ficar em `backend/deploy/`
- **NUNCA** colocar arquivos de deploy na raiz do backend
- Usar templates `.example` para configurações

## 15. Total de Endpoints

### 15.1 Resumo Final
- **23 endpoints** identificados (reduzidos de 27)
- **1 endpoint** de autenticação (GET /api/auth/me)
- **6 endpoints** de processos (incluindo upload/download URL)
- **8 endpoints** de exigências (incluindo status)
- **6 endpoints** de notificações
- **1 endpoint** de busca global
- **1 endpoint** de usuários

### 15.2 Priorização
1. **Fase 1**: Autenticação + CRUD básico (16 endpoints)
2. **Fase 2**: Notificações + upload IA (7 endpoints)

---

## ⚠️ REGRAS CRÍTICAS

### ❌ NÃO FAZER
- Implementar login/logout/reset no backend
- Aceitar `idEmpresa` nas requisições
- Usar nomes de status (usar IDs)
- Campo `atribuido_a` (usar `responsavel`)
- Upload de bytes para endpoints
- Valores padrão em `os.getenv()`
- Endpoints separados para cada tipo de notificação
- Controlar acesso apenas por perfil (usar permissões)

### ✅ SEMPRE FAZER
- Filtrar por `idEmpresa` automaticamente
- Usar timestamps UTC-3
- URLs assinadas para upload/download
- Análise IA síncrona na criação
- Paginação em todas as listagens
- Validação rigorosa de multi-tenancy
- Logs de auditoria para operações críticas
- Validar permissões em todas as rotas
- Retornar permissões em `/api/auth/me`

---

**Versão**: 1.0  
**Data**: 14/08/2025  
**Status**: Especificação completa de regras de backend  
**Baseado em**: 23 endpoints + Sistema Multi-tenant + Firebase Auth
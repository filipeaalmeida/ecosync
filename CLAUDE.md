## Regras do Projeto EcoSync

### ⚠️ IMPORTANTE - Estrutura de Pastas
- **NUNCA** altere nada nas pastas `frontend_old` e `backend_old`. Estas são versões antigas mantidas apenas para referência.
- Todo desenvolvimento deve ser feito nas pastas `frontend` e `backend`.

### Frontend
- Tudo que for criado no frontend precisa estar em português. Todos os textos, nome de menus, botões, etc.
- Todo o desenvolvimento do frontend deve ser feito na pasta `frontend`
- **Header**: Usar sempre o componente `Header` existente em `src/components/Header.tsx`. Nunca desenvolva um novo header.
- **Tabelas com dados do backend**: Toda tabela que buscar dados do backend DEVE implementar paginação. Use o componente `Pagination` (a ser criado em `src/components/Pagination.tsx`) para padronizar a paginação em todas as tabelas.
- Tecnologia: React com TypeScript e Tailwind CSS

### Backend
- Todo o desenvolvimento do backend deve ser feito na pasta `backend`
- Tecnologia: Python com FastAPI
- Banco de dados: Firestore (Firebase)
- Autenticação: Firebase Auth
- Storage de arquivos: Firebase Storage (para documentos dos processos)
- Deploy: Google Cloud Run
- Estrutura do backend:
  - `app/models/` - Modelos Pydantic para validação de dados
  - `app/routers/` - Endpoints da API organizados por domínio
  - `app/middlewares/` - Middlewares, incluindo autenticação
  - `app/utils/` - Utilitários, incluindo integração com Firebase
  - `app/services/` - Lógica de negócio (quando necessário)

### Integrações
- Frontend se comunica com Backend via API REST
- Autenticação é feita via Firebase Auth (token JWT)
- Uploads de arquivos vão direto para Firebase Storage
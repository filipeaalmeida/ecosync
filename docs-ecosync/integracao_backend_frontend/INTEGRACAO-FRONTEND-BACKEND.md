# Documentação de Integração Frontend/Backend - EcoSync

*Análise Completa do Frontend para Identificação de Requisitos de Backend*

## 1. Análise das Páginas e Funcionalidades

### 1.1 Página de Login (`/login`)

**FUNCIONALIDADES DE AUTENTICAÇÃO GERENCIADAS PELO FIREBASE**
- Login, logout, recuperação de senha e alteração de senha são gerenciados diretamente pelo Firebase Auth no frontend
- O backend não precisa implementar esses endpoints

### 1.2 Página Processos (`/processos`)

**TELA: Processos**
└── FUNCIONALIDADE: Listagem de processos com paginação e filtros
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos`
        - Method: GET
        - Request: { 
            page: number,
            limit: number,
            search?: string,
            data_emissao_inicio?: string,
            data_emissao_fim?: string,
            data_validade_inicio?: string,
            data_validade_fim?: string,
            data_renovacao_inicio?: string,
            data_renovacao_fim?: string
          }
        - Response: {
            processos: Array<{
              id: string,
              numero_processo: string,
              razao_social: string,
              data_emissao: string,
              data_validade: string,
              prazo_renovacao: string
            }>,
            total: number,
            page: number,
            pages: number,
            has_next: boolean,
            has_prev: boolean
          }
        - Status: NOVO

**TELA: Processos**
└── FUNCIONALIDADE: Obter URL assinada para upload
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/upload-url`
        - Method: GET
        - Request: { filename: string, content_type: string }
        - Response: { 
            upload_url: string,
            file_id: string
          }
        - Status: NOVO

**TELA: Processos**
└── FUNCIONALIDADE: Criar processo com análise IA
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos`
        - Method: POST
        - Request: {
            file_id: string
          }
        - Response: { 
            id: string, 
            processo: {
              numero_processo: string,
              tipo: string,
              razao_social: string,
              municipio: string,
              caracterizacao: string,
              data_emissao: string,
              data_validade: string,
              prazo_renovacao: string
            },
            message: string, 
            success: boolean 
          }
        - Status: NOVO - Processo criado sincronamente com dados extraídos por IA

**TELA: Processos**
└── FUNCIONALIDADE: Remover processo
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}`
        - Method: DELETE
        - Request: Path parameter id
        - Response: { message: string, success: boolean }
        - Status: NOVO

### 1.3 Página Editar Processo (`/processos/editar/{id}`)

**TELA: Editar Processo - Aba Dados**
└── FUNCIONALIDADE: Obter dados do processo
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}`
        - Method: GET
        - Request: Path parameter id
        - Response: {
            id: string,
            numero_processo: string,
            tipo: string,
            razao_social: string,
            municipio: string,
            caracterizacao: string,
            data_emissao: string,
            data_validade: string,
            prazo_renovacao: string,
            observacoes: string,
            notificar_atribuicao_sistema: boolean,
            notificar_atribuicao_email: boolean,
            data_criacao: string,
            data_atualizacao: string,
            usuario_criacao: string
          }
        - Status: NOVO

**TELA: Editar Processo - Aba Dados**
└── FUNCIONALIDADE: Atualizar dados do processo
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}`
        - Method: PUT
        - Request: {
            numero_processo: string,
            tipo: string,
            razao_social: string,
            municipio: string,
            caracterizacao: string,
            data_emissao: string,
            data_validade: string,
            prazo_renovacao: string,
            observacoes: string,
            notificar_atribuicao_sistema: boolean,
            notificar_atribuicao_email: boolean
          }
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Editar Processo - Aba Dados**
└── FUNCIONALIDADE: Obter URL assinada para download
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}/download-url`
        - Method: GET
        - Request: Path parameter id
        - Response: { download_url: string, expires_in: number }
        - Status: NOVO

**TELA: Editar Processo - Aba Exigências**
└── FUNCIONALIDADE: Usar endpoint GET /api/exigencias com filtro por processo
    └── ENDPOINT REUTILIZADO: GET /api/exigencias com parâmetro processo_id

**TELA: Editar Processo - Aba Notificações**
└── FUNCIONALIDADE: Obter lista de usuários do sistema
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/usuarios`
        - Method: GET
        - Request: { search?: string, ativo?: boolean }
        - Response: {
            usuarios: Array<{
              id: string,
              nome: string,
              email: string,
              ativo: boolean
            }>
          }
        - Status: NOVO

**TELA: Editar Processo - Aba Notificações**
└── FUNCIONALIDADE: Salvar regras de notificação (consolidado)
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}/notificacoes`
        - Method: POST
        - Request: {
            tipo_regra: 'prazo_antecipado' | 'renovacao_antecipada' | 'vencimento',
            dias: number,
            configuracoes: {
              criador: { enabled: boolean, sistema: boolean, email: boolean },
              responsavel: { enabled: boolean, sistema: boolean, email: boolean },
              usuarios_adicionais: Array<{
                usuario_id: string,
                sistema: boolean,
                email: boolean
              }>
            }
          }
        - Response: { id: string, message: string, success: boolean }
        - Status: NOVO

**TELA: Editar Processo - Aba Notificações**
└── FUNCIONALIDADE: Obter regras de notificação existentes
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/{id}/notificacoes`
        - Method: GET
        - Request: Path parameter id
        - Response: {
            regras: Array<{
              id: string,
              tipo_regra: 'prazo_antecipado' | 'renovacao_antecipada' | 'vencimento',
              dias: number,
              configuracoes: {
                criador: { enabled: boolean, sistema: boolean, email: boolean },
                responsavel: { enabled: boolean, sistema: boolean, email: boolean },
                usuarios_adicionais: Array<{
                  usuario_id: string,
                  sistema: boolean,
                  email: boolean
                }>
              }
            }>
          }

**TELA: Editar Processo - Aba Notificações**
└── FUNCIONALIDADE: Remover regra de notificação
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/processos/notificacoes/{id}`
        - Method: DELETE
        - Request: Path parameter id
        - Response: { message: string, success: boolean }
        - Status: NOVO

### 1.4 Página Exigências (`/exigencias`)

**TELA: Exigências**
└── FUNCIONALIDADE: Listar exigências com paginação e filtros
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias`
        - Method: GET
        - Request: {
            page: number,
            limit: number,
            search?: string,
            status?: Array<string>,
            processo_id?: string,
            responsavel?: Array<string>,
            prazo_inicio?: string,
            prazo_fim?: string
          }
        - Response: {
            exigencias: Array<{
              id: number,
              descricao_resumida: string,
              descricao: string,
              processo: string,
              prazo: string,
              status: string,
              responsavel: string,
              observacoes: string,
              criado_por: 'ia' | 'usuario',
              data_criacao: string,
              data_atualizacao: string,
              usuario_criacao: string
            }>,
            total: number,
            page: number,
            pages: number
          }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Obter lista de status possíveis
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/status`
        - Method: GET
        - Request: {}
        - Response: {
            status: Array<{
              id: string,
              nome: string,
              cor: string
            }>
          }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Criar nova exigência
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias`
        - Method: POST
        - Request: {
            descricao_resumida: string,
            descricao: string,
            processo: string,
            prazo: string,
            status: string,
            responsavel: string,
            observacoes?: string
          }
        - Response: { id: number, message: string, success: boolean }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Atualizar exigência
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/{id}`
        - Method: PUT
        - Request: {
            descricao_resumida: string,
            descricao: string,
            processo: string,
            prazo: string,
            status: string,
            responsavel: string,
            observacoes?: string
          }
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Alterar status da exigência (inline)
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/{id}/status`
        - Method: PATCH
        - Request: { status: string }
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Alterar responsável da exigência (inline)
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/{id}/responsavel`
        - Method: PATCH
        - Request: { responsavel: string }
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Remover exigência
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/{id}`
        - Method: DELETE
        - Request: Path parameter id
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Exigências**
└── FUNCIONALIDADE: Exportar exigências para XLSX
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/exigencias/export`
        - Method: GET
        - Request: Mesmos filtros da listagem como query params
        - Response: File download (XLSX)
        - Status: NOVO

### 1.5 Página Notificações (`/notificacoes`)

**TELA: Notificações**
└── FUNCIONALIDADE: Listar notificações com filtros
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/notificacoes`
        - Method: GET
        - Request: {
            lidas?: boolean,
            tipos?: Array<'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao'>
          }
        - Response: {
            notificacoes: Array<{
              id: string,
              tipo: 'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao',
              titulo: string,
              prazo?: string,
              dias_info?: string,
              atribuido_por?: string,
              data: string,
              hora: string,
              lida: boolean,
              exigencia_id?: number
            }>
          }
        - Status: NOVO

**TELA: Notificações**
└── FUNCIONALIDADE: Marcar notificação como lida/não lida
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/notificacoes/{id}/marcar-lida`
        - Method: PATCH
        - Request: { lida: boolean }
        - Response: { message: string, success: boolean }
        - Status: NOVO

**TELA: Notificações**
└── FUNCIONALIDADE: Marcar todas notificações como lidas
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/notificacoes/marcar-todas-lidas`
        - Method: PATCH
        - Request: {}
        - Response: { message: string, success: boolean }
        - Status: NOVO

### 1.6 Componente Header

**COMPONENTE: Header**
└── FUNCIONALIDADE: Busca global no header
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/search`
        - Method: GET
        - Request: { query: string }
        - Response: { resultados: Array<{ id: string, tipo: string, titulo: string }> }
        - Status: NOVO

**COMPONENTE: NotificationDropdown**
└── FUNCIONALIDADE: Obter notificações resumidas
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/notificacoes/resumo`
        - Method: GET
        - Request: { limite?: number }
        - Response: {
            notificacoes: Array<{
              id: string,
              tipo: 'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao',
              titulo: string,
              prazo?: string,
              dias_info?: string,
              atribuido_por?: string,
              data: string,
              hora: string,
              lida: boolean,
              exigencia_id?: number
            }>,
            total_nao_lidas: number
          }
        - Status: NOVO

### 1.7 Componente Account Menu

**COMPONENTE: AccountMenu**
└── FUNCIONALIDADE: Obter dados do usuário atual
    └── ENDPOINT NECESSÁRIO:
        - Path: `/api/auth/me`
        - Method: GET
        - Request: Header Authorization com token
        - Response: {
            uid: string,
            nome: string,
            email: string,
            perfil: string,
            permissoes: Array<string>,
            ativo: boolean
          }
        - Status: NOVO - **IMPORTANTE**: Frontend deve usar `permissões` para controlar acesso às funcionalidades

**FUNCIONALIDADES GERENCIADAS PELO FIREBASE**
- Logout e alteração de senha são gerenciados pelo Firebase Auth no frontend

## 2. Sistema de Permissões

### 2.1 Controle de Acesso por Permissões
- **Frontend deve usar permissões, não perfis** para controlar acesso às funcionalidades
- Cada endpoint do backend valida se o usuário tem a permissão necessária
- Usuários recebem permissões baseadas no seu perfil

### 2.2 Mapeamento de Permissões
**Perfis e suas permissões**:
- **Administrador**: `["criar", "editar", "excluir", "visualizar", "gerenciar-usuarios"]`
- **Operador**: `["criar", "editar", "visualizar"]`
- **Visualizador**: `["visualizar"]`

### 2.3 Validação por Endpoint
- **Visualizar dados**: `visualizar`
- **Criar processos/exigências**: `criar`
- **Editar processos/exigências**: `editar`
- **Excluir processos/exigências**: `excluir`
- **Gerenciar usuários**: `gerenciar-usuarios` (apenas admin)

## 3. Modelos de Dados para Backend

### 3.1 Modelos Principais (Expostos via API)

#### 3.1.1 Modelo: Usuario
```python
class Usuario(BaseModel):
    id: str
    nome: str
    email: str
    perfil: str  # 'Administrador', 'Operador', etc.
    ativo: bool
    data_criacao: datetime
    data_atualizacao: datetime
    idEmpresa: str
```

#### 3.1.2 Modelo: Processo
```python
class Processo(BaseModel):
    id: str
    numero_processo: str
    tipo: str
    razao_social: str
    municipio: str
    caracterizacao: str
    data_emissao: date
    data_validade: date
    prazo_renovacao: date
    observacoes: Optional[str]
    arquivo_pdf_path: Optional[str]
    notificar_atribuicao_sistema: bool = False
    notificar_atribuicao_email: bool = False
    data_criacao: datetime
    data_atualizacao: datetime
    usuario_criacao: str
    idEmpresa: str
```

#### 3.1.3 Modelo: Exigencia
```python
class Exigencia(BaseModel):
    id: int
    processo_id: str
    descricao_resumida: str
    descricao: str
    prazo: date
    status: str  # IDs como 'nao-iniciado', 'em-progresso', 'concluido', 'pendente'
    responsavel: str
    observacoes: Optional[str]
    criado_por: Literal['ia', 'usuario']
    data_criacao: datetime
    data_atualizacao: datetime
    usuario_criacao: str
    idEmpresa: str
```

#### 3.1.4 Modelo: Notificacao
```python
class Notificacao(BaseModel):
    id: str
    usuario_id: str
    tipo: Literal['exigencia_prazo', 'exigencia_vencida', 'renovacao_prazo', 'atribuicao']
    titulo: str
    prazo: Optional[date]
    dias_info: Optional[str]
    atribuido_por: Optional[str]
    exigencia_id: Optional[int]
    processo_id: Optional[str]
    lida: bool = False
    data_criacao: datetime
    data_atualizacao: datetime
    idEmpresa: str
```

### 3.2 Modelos de Configuração (Internos)

#### 3.2.1 Modelo: ConfiguracaoNotificacao
```python
class ConfiguracaoNotificacao(BaseModel):
    id: str
    processo_id: str
    tipo_regra: Literal['prazo_antecipado', 'renovacao_antecipada', 'vencimento']
    dias: int
    criador_enabled: bool = False
    criador_sistema: bool = False
    criador_email: bool = False
    responsavel_enabled: bool = False
    responsavel_sistema: bool = False
    responsavel_email: bool = False
    ativa: bool = True
    data_criacao: datetime
    data_atualizacao: datetime
    usuario_criacao: str
    idEmpresa: str
```

#### 3.2.2 Modelo: UsuarioNotificacao (Tabela de ligação)
```python
class UsuarioNotificacao(BaseModel):
    id: str
    configuracao_notificacao_id: str
    usuario_id: str
    notificar_sistema: bool = False
    notificar_email: bool = False
    data_criacao: datetime
    data_atualizacao: datetime
    usuario_criacao: str
    idEmpresa: str
```


### 3.3 Modelos de Análise IA (Temporários/Cache)

#### 3.3.1 Modelo: AnaliseDocumento
```python
class AnaliseDocumento(BaseModel):
    id: str
    usuario_id: str
    arquivo_path: str
    status: Literal['processando', 'concluida', 'erro']
    resultado_analise: Optional[Dict[str, Any]]
    erro_mensagem: Optional[str]
    processado_em: Optional[datetime]
    data_criacao: datetime
    data_atualizacao: datetime
    usuario_criacao: str
    idEmpresa: str
```

## 4. Estrutura de Dados Firestore

### 4.1 Coleção: `usuarios`
```typescript
interface Usuario {
    id: string;
    nome: string;
    email: string;
    perfil: string;
    ativo: boolean;
    data_criacao: Timestamp;
    data_atualizacao: Timestamp;
    usuario_criacao: string;
    idEmpresa: string;
}
```

### 4.2 Coleção: `processos`
```typescript
interface Processo {
    id: string;
    numero_processo: string;
    tipo: string;
    razao_social: string;
    municipio: string;
    caracterizacao: string;
    data_emissao: Timestamp;
    data_validade: Timestamp;
    prazo_renovacao: Timestamp;
    observacoes?: string;
    arquivo_pdf_path?: string;
    notificar_atribuicao_sistema: boolean;
    notificar_atribuicao_email: boolean;
    usuario_id: string;
    data_criacao: Timestamp;
    data_atualizacao: Timestamp;
    usuario_criacao: string;
    idEmpresa: string;
}
```

### 4.3 Coleção: `exigencias`
```typescript
interface Exigencia {
    id: string;
    processo_id: string;
    descricao_resumida: string;
    descricao: string;
    prazo: Timestamp;
    status: string; // IDs como 'nao-iniciado', 'em-progresso', etc.
    responsavel: string;
    observacoes?: string;
    criado_por: 'ia' | 'usuario';
    usuario_id: string;
    data_criacao: Timestamp;
    data_atualizacao: Timestamp;
    usuario_criacao: string;
    idEmpresa: string;
}
```

### 4.4 Coleção: `notificacoes`
```typescript
interface Notificacao {
    id: string;
    usuario_id: string;
    tipo: 'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao';
    titulo: string;
    prazo?: Timestamp;
    dias_info?: string;
    atribuido_por?: string;
    exigencia_id?: string;
    processo_id?: string;
    lida: boolean;
    data_criacao: Timestamp;
    data_atualizacao: Timestamp;
    idEmpresa: string;
}
```

### 4.5 Coleção: `configuracoes_notificacao`
```typescript
interface ConfiguracaoNotificacao {
    id: string;
    processo_id: string;
    tipo_regra: 'prazo_antecipado' | 'renovacao_antecipada' | 'vencimento';
    dias: number;
    criador_enabled: boolean;
    criador_sistema: boolean;
    criador_email: boolean;
    responsavel_enabled: boolean;
    responsavel_sistema: boolean;
    responsavel_email: boolean;
    usuarios_adicionais: Array<{
        usuario_id: string;
        sistema: boolean;
        email: boolean;
    }>;
    ativa: boolean;
    usuario_id: string;
    data_criacao: Timestamp;
    data_atualizacao: Timestamp;
    usuario_criacao: string;
    idEmpresa: string;
}
```


## 5. Resumo de Endpoints por Funcionalidade

### 4.1 Autenticação (1 endpoint)
- GET `/api/auth/me` - Dados usuário atual

*Nota: Login, logout, cadastro, reset e alteração de senha são gerenciados pelo Firebase Auth*

### 4.2 Usuários (1 endpoint)
- GET `/api/usuarios` - Listar usuários

### 4.3 Busca (1 endpoint)
- GET `/api/search` - Busca global

### 4.4 Processos (6 endpoints)
- GET `/api/processos` - Listar com paginação/filtros
- POST `/api/processos` - Criar processo com análise IA
- GET `/api/processos/{id}` - Obter processo específico
- PUT `/api/processos/{id}` - Atualizar processo
- DELETE `/api/processos/{id}` - Remover processo
- GET `/api/processos/upload-url` - Obter URL assinada para upload
- GET `/api/processos/{id}/download-url` - Obter URL assinada para download

### 4.5 Exigências (8 endpoints)
- GET `/api/exigencias` - Listar com paginação/filtros
- GET `/api/exigencias/status` - Listar status possíveis
- POST `/api/exigencias` - Criar exigência
- PUT `/api/exigencias/{id}` - Atualizar exigência
- DELETE `/api/exigencias/{id}` - Remover exigência
- PATCH `/api/exigencias/{id}/status` - Alterar status
- PATCH `/api/exigencias/{id}/responsavel` - Alterar responsável
- GET `/api/exigencias/export` - Exportar XLSX

### 4.6 Notificações (6 endpoints)
- GET `/api/notificacoes` - Listar notificações
- GET `/api/notificacoes/resumo` - Resumo para dropdown
- PATCH `/api/notificacoes/{id}/marcar-lida` - Marcar lida
- PATCH `/api/notificacoes/marcar-todas-lidas` - Marcar todas
- GET `/api/processos/{id}/notificacoes` - Regras do processo
- POST `/api/processos/{id}/notificacoes` - Criar regra de notificação
- DELETE `/api/processos/notificacoes/{id}` - Remover regra de notificação

**TOTAL: 23 endpoints identificados**

## 6. Funcionalidades de Background (Não expostas via API)

### 5.1 Sistema de Notificações Automáticas
- **Job diário**: Verificar prazos próximos e criar notificações
- **Job de limpeza**: Remover notificações antigas lidas
- **Email sender**: Enviar emails baseado nas configurações

### 5.2 Processamento de Documentos
- **Queue de análise IA**: Processar PDFs em background
- **Extração de dados**: OCR + análise inteligente
- **Validação**: Verificar consistência dos dados extraídos

### 5.3 Auditoria e Logs
- **Log de alterações**: Rastrear mudanças em processos/exigências
- **Métricas de uso**: Dashboard analytics
- **Backup automático**: Dados críticos

## 7. Priorização de Implementação

### 6.1 Fase 1 - Essencial (Semana 1-2)
1. **Autenticação básica** (1 endpoint)
2. **CRUD Processos básico** (5 endpoints principais)
3. **CRUD Exigências básico** (4 endpoints principais)
4. **Busca global** (1 endpoint)

### 6.2 Fase 2 - Funcionalidades Avançadas (Semana 3-4)
1. **Sistema de notificações** (6 endpoints)
2. **Upload e análise IA** (2 endpoints)
3. **Filtros e busca avançada**
4. **Exportação de dados**

### 6.3 Fase 3 - Automação (Semana 5-6)
1. **Jobs de background**
2. **Notificações automáticas**
3. **Auditoria e logs**

---

**Versão**: 3.0  
**Data**: 14/08/2025  
**Status**: Atualizado com mudanças de arquitetura - 23 endpoints identificados  
**Próximos Passos**: Atualizar especificação OpenAPI e documentação de modelos
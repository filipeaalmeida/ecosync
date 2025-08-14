# Documentação de Modelos de Backend - EcoSync

*Especificação completa de todos os modelos de dados necessários para o backend (Sistema Multi-tenant)*

## 1. Modelos Principais Expostos via API

### 1.1 Modelo: Usuario

**Descrição**: Representa os usuários do sistema EcoSync.

**Campos**:
- `id`: STRING/UUID - Identificador único do usuário
- `nome`: STRING - Nome completo do usuário
- `email`: STRING - Endereço de email (único)
- `perfil`: STRING - Perfil de acesso ('Administrador', 'Operador', 'Visualizador')
- `ativo`: BOOLEAN - Indica se o usuário está ativo no sistema
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Um usuário pode ter muitos processos (1:N)
- Um usuário pode ter muitas exigências atribuídas (1:N)
- Um usuário pode ter muitas notificações (1:N)
- Um usuário pode participar de muitas conversas de chat (1:N)

**Uso nos Endpoints**:
- `GET /api/usuarios` - Listagem
- `GET /api/auth/me` - Dados do usuário atual

**Implementação no Firestore**:
- Coleção: `usuarios`
- Índices necessários: email, ativo, perfil, idEmpresa

### 1.2 Modelo: Processo

**Descrição**: Representa os processos de licenciamento ambiental gerenciados pelo sistema.

**Campos**:
- `id`: STRING/UUID - Identificador único do processo
- `numero_processo`: STRING - Número do processo (único por empresa)
- `tipo`: STRING - Tipo da licença ('LICENÇA DE OPERAÇÃO', 'LICENÇA PRÉVIA', etc.)
- `razao_social`: STRING - Razão social da empresa
- `municipio`: STRING - Município onde está localizado o empreendimento
- `caracterizacao`: TEXT - Descrição detalhada do empreendimento
- `data_emissao`: DATE - Data de emissão da licença
- `data_validade`: DATE - Data de validade da licença
- `prazo_renovacao`: DATE - Data limite para renovação
- `observacoes`: TEXT - Observações adicionais (opcional)
- `arquivo_pdf_path`: STRING - Caminho do arquivo PDF no Firebase Storage (opcional)
- `notificar_atribuicao_sistema`: BOOLEAN - Notificação via sistema
- `notificar_atribuicao_email`: BOOLEAN - Notificação via email
- `usuario_id`: STRING/UUID - ID do usuário proprietário
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que criou este registro
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Um processo tem muitas exigências (1:N)
- Um processo tem muitas configurações de notificação (1:N)
- Um processo pertence a um usuário (N:1)

**Uso nos Endpoints**:
- `GET /api/processos` - Listagem com filtros
- `POST /api/processos` - Criação com análise IA sincronamente
- `GET /api/processos/{id}` - Obter específico
- `PUT /api/processos/{id}` - Atualização
- `DELETE /api/processos/{id}` - Remoção
- `GET /api/processos/upload-url` - Obter URL assinada para upload
- `GET /api/processos/{id}/download-url` - Obter URL assinada para download

**Implementação no Firestore**:
- Coleção: `processos`
- Índices necessários: numero_processo, usuario_id, data_validade, prazo_renovacao, idEmpresa
- Subcoleções: exigencias, configuracoes_notificacao

### 1.3 Modelo: Exigencia

**Descrição**: Representa as exigências associadas aos processos de licenciamento.

**Campos**:
- `id`: INTEGER - Identificador único da exigência
- `processo_id`: STRING/UUID - ID do processo associado
- `descricao_resumida`: STRING - Descrição curta da exigência
- `descricao`: TEXT - Descrição completa da exigência
- `prazo`: DATE - Data limite para cumprimento
- `status`: STRING - Status atual usando IDs ('nao-iniciado', 'em-progresso', 'pendente', 'concluido')
- `responsavel`: STRING/UUID - UID do usuário responsável pela exigência
- `observacoes`: TEXT - Observações adicionais (opcional)
- `criado_por`: ENUM - Quem criou ('ia', 'usuario')
- `usuario_id`: STRING/UUID - ID do usuário proprietário
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que criou este registro
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Uma exigência pertence a um processo (N:1)
- Uma exigência pode ter muitas notificações (1:N)
- Uma exigência pertence a um usuário (N:1)

**Uso nos Endpoints**:
- `GET /api/exigencias` - Listagem global com filtro por processo_id
- `GET /api/exigencias/status` - Lista de status possíveis
- `POST /api/exigencias` - Criação
- `PUT /api/exigencias/{id}` - Atualização completa
- `PATCH /api/exigencias/{id}/status` - Alteração de status
- `PATCH /api/exigencias/{id}/responsavel` - Alteração de responsável
- `DELETE /api/exigencias/{id}` - Remoção

**Implementação no Firestore**:
- Coleção: `exigencias`
- Índices necessários: processo_id, status, responsavel, prazo, usuario_id, idEmpresa

### 1.4 Modelo: Notificacao

**Descrição**: Representa as notificações enviadas aos usuários sobre prazos e eventos.

**Campos**:
- `id`: STRING/UUID - Identificador único da notificação
- `usuario_id`: STRING/UUID - ID do usuário destinatário
- `tipo`: ENUM - Tipo da notificação ('exigencia_prazo', 'exigencia_vencida', 'renovacao_prazo', 'atribuicao')
- `titulo`: STRING - Título da notificação
- `prazo`: DATE - Data do prazo relacionado (opcional)
- `dias_info`: STRING - Informação sobre dias restantes/vencidos (opcional)
- `atribuido_por`: STRING/UUID - UID do usuário que fez a atribuição (opcional)
- `exigencia_id`: INTEGER - ID da exigência relacionada (opcional)
- `processo_id`: STRING/UUID - ID do processo relacionado (opcional)
- `lida`: BOOLEAN - Indica se foi lida pelo usuário
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Uma notificação pertence a um usuário (N:1)
- Uma notificação pode estar relacionada a uma exigência (N:1)
- Uma notificação pode estar relacionada a um processo (N:1)

**Uso nos Endpoints**:
- `GET /api/notificacoes` - Listagem do usuário
- `GET /api/notificacoes/resumo` - Resumo para dropdown
- `PATCH /api/notificacoes/{id}/marcar-lida` - Marcar como lida
- `PATCH /api/notificacoes/marcar-todas-lidas` - Marcar todas como lidas

**Implementação no Firestore**:
- Coleção: `notificacoes`
- Índices necessários: usuario_id, lida, tipo, data_criacao, idEmpresa

## 2. Modelos de Configuração (Internos)

### 2.1 Modelo: ConfiguracaoNotificacao

**Descrição**: Armazena as regras de notificação configuradas para cada processo.

**Campos**:
- `id`: STRING/UUID - Identificador único da configuração
- `processo_id`: STRING/UUID - ID do processo associado
- `tipo_regra`: ENUM - Tipo da regra ('prazo_antecipado', 'renovacao_antecipada', 'vencimento')
- `dias`: INTEGER - Número de dias para antecipação da notificação
- `criador_enabled`: BOOLEAN - Se deve notificar o criador do processo
- `criador_sistema`: BOOLEAN - Notificação via sistema para criador
- `criador_email`: BOOLEAN - Notificação via email para criador
- `responsavel_enabled`: BOOLEAN - Se deve notificar o responsável
- `responsavel_sistema`: BOOLEAN - Notificação via sistema para responsável
- `responsavel_email`: BOOLEAN - Notificação via email para responsável
- `usuarios_adicionais`: ARRAY - Lista de usuários adicionais com configurações
- `ativa`: BOOLEAN - Se a regra está ativa
- `usuario_id`: STRING/UUID - ID do usuário proprietário
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que criou esta configuração
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Uma configuração pertence a um processo (N:1)
- Uma configuração tem muitos usuários notificação (1:N)

**Uso nos Endpoints**:
- `GET /api/processos/{id}/notificacoes` - Obter regras do processo
- `POST /api/processos/{id}/notificacoes` - Criar regra (consolidado)
- `DELETE /api/processos/notificacoes/{id}` - Remover regra

**Implementação no Firestore**:
- Coleção: `configuracoes_notificacao`
- Índices necessários: processo_id, tipo_regra, ativa, idEmpresa

### 2.2 Modelo: UsuarioNotificacao (Tabela de Ligação)

**Descrição**: Relaciona as configurações de notificação com usuários específicos.

**Campos**:
- `id`: STRING/UUID - Identificador único da ligação
- `configuracao_notificacao_id`: STRING/UUID - ID da configuração
- `usuario_id`: STRING/UUID - ID do usuário
- `notificar_sistema`: BOOLEAN - Se deve notificar via sistema
- `notificar_email`: BOOLEAN - Se deve notificar via email
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que criou esta ligação
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Pertence a uma configuração de notificação (N:1)
- Pertence a um usuário (N:1)

**Implementação no Firestore**:
- Integrado no array `usuarios_adicionais` da `ConfiguracaoNotificacao`


## 3. Modelos de Análise IA (Temporários/Cache)

### 3.1 Modelo: AnaliseDocumento

**Descrição**: Armazena temporariamente os resultados da análise de documentos por IA.

**Campos**:
- `id`: STRING/UUID - Identificador único da análise
- `usuario_id`: STRING/UUID - ID do usuário que enviou o documento
- `arquivo_path`: STRING - Caminho do arquivo no Firebase Storage
- `status`: ENUM - Status da análise ('processando', 'concluida', 'erro')
- `resultado_analise`: JSON - Resultado estruturado da análise IA
- `erro_mensagem`: STRING - Mensagem de erro se houver (opcional)
- `processado_em`: TIMESTAMP - Quando foi processado (opcional)
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que iniciou a análise
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Relacionamentos**:
- Uma análise pertence a um usuário (N:1)
- Pode gerar um processo (1:1)

**Uso nos Endpoints**:
- `POST /api/processos` - Criação sincronamente com análise IA

**Implementação no Firestore**:
- Coleção: `analises_documento`
- TTL: 7 dias (limpeza automática)

## 4. Modelos de Dados Fixos/Seed

### 4.1 Perfis de Usuário

**Descrição**: Lista de perfis disponíveis no sistema.

**Dados Fixos**:
```json
[
  {
    "codigo": "administrador",
    "nome": "Administrador",
    "descricao": "Acesso total ao sistema",
    "permissoes": ["criar", "editar", "excluir", "visualizar", "gerenciar-usuarios"]
  },
  {
    "codigo": "operador",
    "nome": "Operador",
    "descricao": "Operação normal do sistema",
    "permissoes": ["criar", "editar", "visualizar"]
  },
  {
    "codigo": "visualizador",
    "nome": "Visualizador",
    "descricao": "Apenas visualização",
    "permissoes": ["visualizar"]
  }
]
```

### 4.2 Status de Exigências

**Descrição**: Estados possíveis das exigências (retornados pelo endpoint `/api/exigencias/status`).

**Dados Fixos**:
```json
[
  {
    "id": "nao-iniciado",
    "nome": "Não Iniciado",
    "cor": "#6b7280"
  },
  {
    "id": "em-progresso",
    "nome": "Em Progresso",
    "cor": "#3b82f6"
  },
  {
    "id": "pendente",
    "nome": "Pendente",
    "cor": "#f59e0b"
  },
  {
    "id": "concluido",
    "nome": "Concluído",
    "cor": "#10b981"
  }
]
```

### 4.3 Tipos de Licença

**Descrição**: Tipos de licenças ambientais.

**Dados Fixos**:
```json
[
  {
    "codigo": "LO",
    "nome": "Licença de Operação",
    "descricao": "Autoriza a operação da atividade ou empreendimento"
  },
  {
    "codigo": "LP",
    "nome": "Licença Prévia",
    "descricao": "Concedida na fase preliminar do planejamento"
  },
  {
    "codigo": "LI",
    "nome": "Licença de Instalação",
    "descricao": "Autoriza a instalação do empreendimento"
  },
  {
    "codigo": "LU",
    "nome": "Licença Única",
    "descricao": "Licença simplificada para atividades de menor impacto"
  }
]
```

### 4.4 Tipos de Notificação

**Descrição**: Tipos de notificações do sistema.

**Dados Fixos**:
```json
[
  {
    "codigo": "exigencia_prazo",
    "nome": "Exigência Próxima do Prazo",
    "icone": "clock",
    "cor": "#f59e0b"
  },
  {
    "codigo": "exigencia_vencida",
    "nome": "Exigência Vencida",
    "icone": "alert-circle",
    "cor": "#ef4444"
  },
  {
    "codigo": "renovacao_prazo",
    "nome": "Renovação Próxima",
    "icone": "refresh-cw",
    "cor": "#3b82f6"
  },
  {
    "codigo": "atribuicao",
    "nome": "Nova Atribuição",
    "icone": "bell",
    "cor": "#8b5cf6"
  }
]
```

## 5. Modelos de Suporte (Background/Sistema)

### 5.1 Modelo: LogAuditoria

**Descrição**: Registra todas as alterações importantes no sistema para auditoria.

**Campos**:
- `id`: STRING/UUID - Identificador único do log
- `usuario_id`: STRING/UUID - ID do usuário que fez a ação
- `entidade_tipo`: STRING - Tipo da entidade alterada ('processo', 'exigencia', etc.)
- `entidade_id`: STRING - ID da entidade alterada
- `acao`: ENUM - Tipo da ação ('criacao', 'atualizacao', 'remocao')
- `dados_anteriores`: JSON - Estado anterior (para atualizações)
- `dados_novos`: JSON - Estado posterior
- `ip_origem`: STRING - IP de origem da requisição
- `user_agent`: STRING - User agent do navegador
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING/UUID - ID do usuário que criou este log
- `idEmpresa`: STRING/UUID - Identificador da empresa (sistema multi-tenant)

**Implementação no Firestore**:
- Coleção: `logs_auditoria`
- Particionamento por data para performance
- Retenção: 1 ano

### 5.2 Modelo: JobExecucao

**Descrição**: Controla a execução de jobs em background.

**Campos**:
- `id`: STRING/UUID - Identificador único da execução
- `nome_job`: STRING - Nome do job executado
- `status`: ENUM - Status ('executando', 'concluido', 'erro')
- `inicio`: TIMESTAMP - Início da execução
- `fim`: TIMESTAMP - Fim da execução (opcional)
- `resultado`: JSON - Resultado da execução
- `erro_detalhes`: TEXT - Detalhes do erro se houver
- `registros_processados`: INTEGER - Número de registros processados
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING - Sistema que executou ('SYSTEM')

**Jobs Principais**:
- `verificar_prazos_vencimento` - Diário às 06:00
- `limpar_notificacoes_antigas` - Semanal domingo 02:00
- `backup_dados_criticos` - Diário às 23:00
- `processar_analises_ia_pendentes` - A cada 15 minutos

### 5.3 Modelo: ConfiguracaoSistema

**Descrição**: Armazena configurações gerais do sistema.

**Campos**:
- `chave`: STRING - Chave única da configuração
- `valor`: STRING - Valor da configuração
- `tipo`: ENUM - Tipo do valor ('string', 'integer', 'boolean', 'json')
- `descricao`: STRING - Descrição da configuração
- `editavel`: BOOLEAN - Se pode ser editada via interface
- `data_criacao`: TIMESTAMP - Data e hora de criação do registro (UTC-3)
- `data_atualizacao`: TIMESTAMP - Data e hora da última atualização (UTC-3)
- `usuario_criacao`: STRING - Quem criou a configuração

**Configurações Iniciais**:
```json
[
  {
    "chave": "dias_antecipacao_padrao",
    "valor": "30",
    "tipo": "integer",
    "descricao": "Dias padrão para antecipação de notificações"
  },
  {
    "chave": "email_remetente",
    "valor": "noreply@ecosync.com",
    "tipo": "string",
    "descricao": "Email remetente das notificações"
  },
  {
    "chave": "limite_upload_mb",
    "valor": "10",
    "tipo": "integer",
    "descricao": "Limite em MB para upload de arquivos"
  }
]
```

## 6. Índices e Performance

### 6.1 Índices Obrigatórios

**Coleção usuarios**:
- Índice simples: email
- Índice composto: ativo + perfil
- Índice composto: idEmpresa + ativo

**Coleção processos**:
- Índice simples: numero_processo, usuario_id
- Índice composto: idEmpresa + usuario_id + data_validade
- Índice composto: idEmpresa + usuario_id + prazo_renovacao

**Coleção exigencias**:
- Índice simples: processo_id, status, usuario_id
- Índice composto: idEmpresa + usuario_id + status + prazo
- Índice composto: idEmpresa + processo_id + status

**Coleção notificacoes**:
- Índice composto: idEmpresa + usuario_id + lida + data_criacao (desc)
- Índice composto: idEmpresa + usuario_id + tipo

### 6.2 Considerações de Performance

**Paginação**:
- Todas as listagens devem usar cursor-based pagination do Firestore
- Limite máximo de 100 itens por página
- Usar `startAfter` para navegação eficiente

**Cache**:
- Estatísticas do dashboard em cache por 1 hora
- Lista de usuários em cache por 30 minutos
- Configurações do sistema em cache por 4 horas

**Limpeza Automática**:
- Notificações lidas há mais de 30 dias
- Logs de auditoria mais antigos que 1 ano
- Análises de documento mais antigas que 7 dias

## 7. Validações de Negócio

### 7.1 Regras de Validação

**Usuário**:
- Email deve ser único por empresa
- Nome deve ter pelo menos 2 caracteres
- Perfil deve existir na lista de perfis válidos

**Processo**:
- Número do processo deve ser único por empresa
- Data de validade deve ser posterior à data de emissão
- Prazo de renovação deve ser anterior à data de validade

**Exigência**:
- Prazo não pode ser anterior à data atual (para novas exigências)
- Status deve usar IDs válidos (nao-iniciado, em-progresso, pendente, concluido)
- Processo deve existir e pertencer à mesma empresa
- Responsável deve ser UID válido do usuário

**Configuração Notificação**:
- Dias deve estar entre 1 e 365
- Pelo menos uma opção de notificação deve estar habilitada
- Processo deve existir e pertencer à mesma empresa

### 7.2 Triggers e Eventos

**Ao criar processo**:
- Gerar log de auditoria
- Análise IA sincronamente com dados extraídos do PDF
- Criar configurações de notificação padrão se não fornecidas

**Ao alterar status de exigência**:
- Gerar log de auditoria
- Verificar se cria notificação de conclusão
- Usar ID do status (ex: 'em-progresso', não 'Em Progresso')

**Ao criar/atualizar configuração de notificação**:
- Recalcular próximas notificações para o processo
- Gerar log de auditoria

**Ao fazer login**:
- Atualizar timestamp de último acesso
- Verificar notificações não lidas

## 8. Multi-tenancy e Isolamento de Dados

### 8.1 Regras de Isolamento

**Acesso a Dados**:
- O backend deve automaticamente filtrar todos os dados pelo `idEmpresa` do usuário
- Usuários só podem ver/modificar dados da sua própria empresa
- Validação obrigatória do `idEmpresa` em todas as operações

**Identificação da Empresa**:
- O `idEmpresa` é obtido automaticamente a partir do usuário autenticado
- Não deve ser possível especificar `idEmpresa` manualmente nas requisições
- O backend deve buscar o `idEmpresa` do usuário no token JWT/Firebase Auth

**Validações Multi-tenant**:
- Todas as consultas devem incluir `idEmpresa` no filtro
- Todas as inserções devem incluir `idEmpresa` automaticamente
- Relacionamentos entre entidades devem validar que ambas pertencem à mesma empresa

### 8.2 Gerenciamento de Upload/Download

**Upload de Arquivos**:
- Frontend obtém URL assinada via `GET /api/processos/upload-url`
- Upload é feito diretamente para Firebase Storage usando a URL assinada
- `file_id` é enviado para criação do processo via `POST /api/processos`

**Download de Arquivos**:
- Frontend obtém URL assinada via `GET /api/processos/{id}/download-url`
- Download é feito diretamente do Firebase Storage usando a URL assinada
- URLs têm expiração configurável (padrão: 1 hora)

---

**Versão**: 2.0  
**Data**: 14/08/2025  
**Status**: Atualizado com mudanças de arquitetura - Sistema Multi-tenant  
**Total de Modelos**: 15 modelos principais + 4 modelos de dados fixos
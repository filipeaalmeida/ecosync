# Product Requirement Document (PRD) - EcoSync

## 1. Visão Geral do Produto

### 1.1 Nome do Produto
**EcoSync** (Sistema de Gestão de Licenças e Conformidade Regulatória)

### 1.2 Descrição
O EcoSync é uma plataforma baseada em nuvem para gestão inteligente de licenças, autorizações e exigências de órgãos reguladores governamentais. O sistema utiliza inteligência artificial para automatizar a extração de dados de documentos PDF e gerenciar prazos e requisitos de conformidade.

### 1.3 Objetivo
Eliminar o esforço manual na gestão de licenças e autorizações, permitindo que as equipes se concentrem no atendimento técnico de cada exigência, garantindo conformidade regulatória e evitando penalidades.

### 1.4 Público-Alvo
- Empresas que necessitam gerenciar múltiplas licenças ambientais
- Departamentos de compliance e conformidade regulatória
- Consultores ambientais
- Gestores de projetos com requisitos regulatórios

## 2. Arquitetura do Sistema

### 2.1 Estrutura Técnica
- **Frontend**: HTML5, CSS3, JavaScript (jQuery), Bootstrap 5
- **Backend**: Python/Flask com Gunicorn
- **Banco de Dados**: PostgreSQL
- **Processamento de PDF**: PyPDF2
- **IA/ML**: OpenAI API para processamento inteligente
- **CORS**: Habilitado para comunicação entre frontend e backend

### 2.2 Estrutura de Pastas
```
ecosync/
├── backend/
│   ├── api.py           # API REST principal
│   ├── db.py            # Conexão com banco de dados
│   ├── util.py          # Funções utilitárias
│   ├── constants.py     # Constantes do sistema
│   ├── licenca_gpt.py   # Processamento IA de licenças
│   └── requirements.txt # Dependências Python
├── frontend/
│   ├── index.html       # Redirecionamento
│   ├── exigencias.html  # Página principal de exigências
│   ├── licenca.html     # Gestão de licenças
│   ├── login.html       # Tela de login
│   ├── menu.html        # Menu lateral
│   ├── *.js             # Scripts JavaScript
│   └── licenca.css      # Estilos customizados
└── docs-ecosync/
    └── PRD-EcoSync.md   # Este documento
```

## 3. Modelo de Dados

### 3.1 Tabela: licenca
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único |
| processo | VARCHAR(255) | Número do processo (único) |
| titulo | VARCHAR(255) | Título da licença |
| caracterizacao | TEXT | Caracterização do empreendimento |
| razao_social | VARCHAR(255) | Razão social da empresa |
| municipio | VARCHAR(255) | Município |
| data_emissao | DATE | Data de emissão |
| data_validade | DATE | Data de validade |
| prazo_renovacao | DATE | Prazo para solicitar renovação |
| exigencias | TEXT | Texto original das exigências |
| status | VARCHAR(255) | Status da licença |
| data_criacao | TIMESTAMP | Data de criação no sistema |
| data_remocao | TIMESTAMP | Data de remoção lógica |
| data_alteracao | TIMESTAMP | Data da última alteração |
| data_processamento | TIMESTAMP | Data do processamento IA |

### 3.2 Tabela: exigencia
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | Identificador único |
| agrupada | BOOLEAN | Se foi agrupada |
| licenca_id | INTEGER | FK para licenca |
| descricao | TEXT | Descrição da exigência |
| prazo | DATE | Prazo para cumprimento |
| status | VARCHAR(255) | PENDENTE ou CUMPRIDA |
| data_criacao | TIMESTAMP | Data de criação |
| data_remocao | TIMESTAMP | Data de remoção lógica |
| data_alteracao | TIMESTAMP | Data da última alteração |

## 4. APIs do Sistema

### 4.1 Endpoints Disponíveis

#### GET /api/exigencias
**Descrição**: Lista exigências com filtros opcionais
**Parâmetros Query**:
- `processo`: Filtrar por número do processo
- `status`: Filtrar por status (pendente/cumprida)
- `prazoInicial`: Data inicial do prazo
- `prazoFinal`: Data final do prazo

**Resposta**: Array de exigências com:
- `id`: ID da exigência
- `exigencia-descricao`: Descrição
- `exigencia-prazo`: Data do prazo
- `exigencia-processo`: Número do processo
- `exigencia-acoes`: Ações disponíveis
- `cor`: VERDE (cumprida), VERMELHO (atrasada)

#### POST /api/licencas
**Descrição**: Cadastra nova licença via upload de PDF
**Body**: FormData com:
- `arquivo`: Arquivo PDF da licença
- `codigoProcesso`: Número do processo

**Processo**:
1. Extrai dados do PDF usando PyPDF2
2. Insere registro na tabela licenca
3. Define prazo_renovacao = data_validade - 120 dias
4. Retorna status 201 com mensagem de sucesso

#### GET /api/licencas/{processo}
**Descrição**: Busca licença por número do processo
**Resposta**: Objeto com todos os dados da licença e suas exigências

#### PUT /api/licencas/{id}
**Descrição**: Atualiza dados da licença e suas exigências
**Body**: JSON com dados da licença e array de exigências
**Funcionalidades**:
- Atualiza dados principais da licença
- Adiciona novas exigências
- Remove exigências excluídas
- Atualiza exigências existentes

#### PUT /api/exigencias/{id}/cumprir
**Descrição**: Marca exigência como cumprida
**Resposta**: Lista atualizada de exigências

#### PUT /api/exigencias/{id}/cancelar-cumprir
**Descrição**: Cancela o cumprimento de uma exigência
**Resposta**: Lista atualizada de exigências

## 5. Funcionalidades do Frontend

### 5.1 Página de Exigências (exigencias.html)
**Funcionalidades principais**:
- **Filtros de pesquisa**:
  - Por processo
  - Por status (pendente/cumprida)
  - Por período de prazo
- **Tabela de exigências** com:
  - Descrição da exigência
  - Processo associado
  - Prazo de cumprimento
  - Ações (cumprir/cancelar cumprimento)
- **Indicadores visuais**:
  - Verde: Exigência cumprida
  - Vermelho: Exigência atrasada
- **Botão de exportação para Excel** (interface presente, funcionalidade não implementada)
- **Botão de minuta** (mostra alerta "Gerando minuta para a exigência")

### 5.2 Página de Licença (licenca.html)
**Funcionalidades principais**:
- **Pesquisa de licença** por número de processo
- **Visualização completa** dos dados:
  - Informações básicas (título, processo, status)
  - Dados da empresa (razão social, município)
  - Caracterização do empreendimento
  - Datas importantes (emissão, validade, renovação)
  - Lista de exigências associadas
- **Modo de edição**:
  - Editar todos os campos da licença
  - Adicionar/remover exigências
  - Salvar alterações
- **Upload de nova licença** quando processo não existe
- **Botões de exportação**: PDF e Excel (interface presente, funcionalidade não implementada)

### 5.3 Menu Lateral (menu.html)
- Visualizar Licença
- Consultar Exigências
- Link de Logout (sem funcionalidade implementada)

### 5.4 Tela de Login (login.html)
- Interface de login criada (campos usuário e senha)
- **Sem backend de autenticação implementado**
- Layout responsivo com Bootstrap

## 6. Processamento Inteligente de PDFs

### 6.1 Extração Automatizada
O sistema extrai automaticamente dos PDFs:
- **Título** da licença
- **Data de validade**
- **Razão social** da empresa
- **Município**
- **Caracterização do empreendimento**
- **Lista de exigências**
- **Data de emissão**

### 6.2 Algoritmo de Extração
1. Lê o PDF usando PyPDF2
2. Processa linha por linha identificando seções
3. Usa marcadores específicos (ex: "2 - Razão Social", "4 - Município")
4. Ignora rodapés e assinaturas digitais
5. Agrupa textos de seções multi-linha

## 7. Regras de Negócio

### 7.1 Status de Licenças
- **AGUARDANDO_PROCESSAMENTO**: Recém cadastrada
- **PROCESSADA**: Dados extraídos com sucesso
- **ATIVA**: Em vigência
- **VENCIDA**: Passou da data de validade

### 7.2 Status de Exigências
- **PENDENTE**: Ainda não cumprida
- **CUMPRIDA**: Marcada como atendida
- **ATRASADA**: Pendente com prazo vencido (visual)

### 7.3 Prazo de Renovação
- Calculado automaticamente: data_validade - 120 dias
- Sistema deve alertar quando próximo do prazo

### 7.4 Remoção Lógica
- Registros nunca são deletados fisicamente
- Campo `data_remocao` marca exclusão lógica
- Queries filtram registros com data_remocao IS NULL

## 8. Características Técnicas

### 8.1 Segurança
- CORS configurado para permitir requisições do frontend
- **Sem sistema de autenticação implementado**
- Validação de entrada em todos os endpoints
- Tratamento de erros com try/catch

### 8.2 Performance
- Conexão única com banco (singleton pattern)
- **Sem paginação implementada nas listagens**

### 8.3 Usabilidade
- Interface responsiva (Bootstrap)
- Feedback visual de ações (loading, sucesso, erro)
- Redimensionamento automático de textareas
- Modais para confirmações importantes

## 9. Benefícios do Sistema

1. **Cadastro Automatizado**: Upload de PDF com extração automática
2. **Gestão Centralizada**: Todas as licenças em um só lugar
3. **Controle de Prazos**: Visualização clara de vencimentos
4. **Rastreabilidade**: Histórico de alterações
5. **Conformidade**: Evita multas por descumprimento
6. **Produtividade**: Elimina trabalho manual
7. **Inteligência**: IA para processar documentos
8. **Acessibilidade**: Baseado em nuvem, acesso remoto

## 10. Roadmap Futuro

### 10.1 Funcionalidades Não Implementadas
- [ ] **Sistema de autenticação/login**
- [ ] **Exportação real para Excel**
- [ ] **Exportação real para PDF**
- [ ] **Geração de minutas** (apenas mostra alerta)
- [ ] **Paginação nas listagens**
- [ ] Sistema de notificações por email
- [ ] Dashboard com métricas e KPIs
- [ ] Integração com calendário
- [ ] API pública para integrações
- [ ] App mobile
- [ ] Relatórios personalizados
- [ ] Workflow de aprovações
- [ ] Anexar documentos às exigências
- [ ] Multi-tenant para múltiplas empresas

### 10.2 Melhorias Técnicas
- [ ] Migração para React/Vue.js
- [ ] Implementar testes automatizados
- [ ] CI/CD pipeline
- [ ] Cache Redis
- [ ] Fila de processamento assíncrono
- [ ] Backup automatizado
- [ ] Logs estruturados
- [ ] Monitoramento e alertas

## 11. Considerações de Implantação

### 11.1 Requisitos Mínimos
- Python 3.11+
- PostgreSQL 16+
- 2GB RAM
- 10GB disco
- Conexão internet estável

### 11.2 Ambientes
- **Desenvolvimento**: localhost
- **Staging**: A definir
- **Produção**: Cloud (Google Cloud Platform recomendado)

### 11.3 Configurações
- Variáveis de ambiente em `env.py`
- Porta backend: 8080
- Porta frontend: 8000
- Banco de dados: localhost/licencagpt

## 12. Conclusão

O EcoSync representa uma solução completa para gestão de conformidade regulatória, combinando tecnologia de ponta com interface intuitiva. O sistema já possui as funcionalidades essenciais implementadas e está pronto para uso, com amplo potencial de expansão conforme as necessidades dos usuários evoluam.

---

**Documento criado em**: 13/08/2025  
**Versão**: 1.0  
**Autor**: Sistema de Documentação Automatizada
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X, Filter, Download, Bell } from 'lucide-react';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import TabelaExigencias, { Exigencia } from '../components/TabelaExigencias';
import RequirementModal from '../components/RequirementModal';

interface NotificationConfig {
  criador: {
    enabled: boolean;
    sistema: boolean;
    email: boolean;
  };
  responsavel: {
    enabled: boolean;
    sistema: boolean;
    email: boolean;
  };
  usuarios_adicionais: Array<{
    email: string;
    sistema: boolean;
    email_notif: boolean;
  }>;
}

interface NotificationRule {
  id: string;
  tipo: 'vencimento' | 'prazo_antecipado' | 'renovacao_antecipada';
  dias?: number;
  configuracoes: NotificationConfig;
}


const EditProcess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('Process ID:', id); // Usar as variáveis para evitar warning
  const [activeTab, setActiveTab] = useState<'dados' | 'exigencias' | 'notificacoes'>('dados');
  const [formData, setFormData] = useState({
    processo: 'LO_CIRANDA_02',
    tipo: 'LICENÇA DE OPERAÇÃO',
    razaoSocial: 'CIRANDA 4 ENERGIAS RENOVÁVEIS S.A.',
    municipio: 'São José do Belmonte - PE',
    caracterizacao: `O empreendimento enquadra-se na Tipologia de Energia e Telecomunicações, Subtipologia Geração de Energia Solar, Código 12.5.1 (J) do Anexo I, da Lei Estadual nº 14.249/2010 e suas alterações, referente à Licença de Operação - LO, para a operação da USV Ciranda II referente ao Complexo Solar Xaxado, composto pelas usinas Central Geradora Xaxado I (32,0 MW), Central Geradora Xaxado II (32,0 MW) e Central Geradora Xaxado III (32,0 MW), com potência total de 96,0 MW, localizado nas terras da Fazenda Boqueirão, zona rural do Município de São José do Belmonte/PE. Coordenadas geográficas: 24M 537540 / 9114856.
Fazenda Boa Vista - Zona Rural do Distrito Bom Nome, sn, Zona Rural, 50000000, São José do Belmonte - PE`,
    dataEmissao: '2022-12-27',
    dataValidade: '2023-12-27',
    prazoRenovacao: '2023-08-29',
    observacoes: '',
    notificarAtribuicao: false,
    notificarAtribuicaoSistema: false,
    notificarAtribuicaoEmail: false
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para renderizar as abas (evita duplicação de código)
  const renderTabs = () => (
    <div className="flex items-center justify-between mt-6 mb-6 bg-white rounded-lg border border-gray-200 p-1">
      <div className="flex">
        <button
          onClick={() => setActiveTab('dados')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'dados' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium">Dados do Processo</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('exigencias')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'exigencias' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="font-medium">Exigências</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('notificacoes')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'notificacoes' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <span className="font-medium">Notificações</span>
          </div>
        </button>
      </div>
      
      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="font-medium">Download PDF</span>
      </button>
    </div>
  );

  // Estados para exigências (mesma estrutura da página Exigencias)
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [processoSearch, setProcessoSearch] = useState('');
  const [atribuidoSearch, setAtribuidoSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    status: [] as string[],
    processo: [] as string[],
    atribuidoA: [] as string[],
    prazoFrom: '',
    prazoTo: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioSearchRenovacao, setUsuarioSearchRenovacao] = useState('');

  // Estados para notificações
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([]);
  const [newEmail, setNewEmail] = useState('');
  
  // Estados para configurações de vencimento
  const [vencimentoConfig, setVencimentoConfig] = useState({
    criador: { enabled: false, sistema: false, email: false },
    responsavel: { enabled: false, sistema: false, email: false },
    usuarios_adicionais: [] as Array<{ email: string, sistema: boolean, email_notif: boolean }>
  });

  // Estados para regras de notificação antecipada
  const [prazoAntecipadoRules, setPrazoAntecipadoRules] = useState<Array<{
    id: string;
    dias: number;
    criador: { enabled: boolean, sistema: boolean, email: boolean };
    responsavel: { enabled: boolean, sistema: boolean, email: boolean };
    usuarios_selecionados: Array<{ id: string, name: string, email: string, sistema: boolean, email_notif: boolean }>;
  }>>([]);

  // Estados para regras de renovação antecipada
  const [renovacaoAntecipadaRules, setRenovacaoAntecipadaRules] = useState<Array<{
    id: string;
    dias: number;
    criador: { enabled: boolean, sistema: boolean, email: boolean };
    responsavel: { enabled: boolean, sistema: boolean, email: boolean };
    usuarios_selecionados: Array<{ id: string, name: string, email: string, sistema: boolean, email_notif: boolean }>;
  }>>([]);

  // Lista de usuários do sistema (mock)
  const sistemaUsuarios = [
    { id: '1', name: 'Ana Silva', email: 'ana.silva@ecosync.com' },
    { id: '2', name: 'Carlos Santos', email: 'carlos.santos@ecosync.com' },
    { id: '3', name: 'Diana Costa', email: 'diana.costa@ecosync.com' },
    { id: '4', name: 'Eduardo Lima', email: 'eduardo.lima@ecosync.com' },
    { id: '5', name: 'Fernanda Oliveira', email: 'fernanda.oliveira@ecosync.com' },
    { id: '6', name: 'Gabriel Souza', email: 'gabriel.souza@ecosync.com' },
    { id: '7', name: 'Helena Martins', email: 'helena.martins@ecosync.com' },
    { id: '8', name: 'Igor Pereira', email: 'igor.pereira@ecosync.com' },
    { id: '9', name: 'Juliana Rodrigues', email: 'juliana.rodrigues@ecosync.com' },
    { id: '10', name: 'Leonardo Alves', email: 'leonardo.alves@ecosync.com' },
    { id: '11', name: 'Mariana Ferreira', email: 'mariana.ferreira@ecosync.com' },
    { id: '12', name: 'Nicolas Barbosa', email: 'nicolas.barbosa@ecosync.com' },
    { id: '13', name: 'Patrícia Gomes', email: 'patricia.gomes@ecosync.com' },
    { id: '14', name: 'Rafael Torres', email: 'rafael.torres@ecosync.com' },
    { id: '15', name: 'Sandra Melo', email: 'sandra.melo@ecosync.com' },
    { id: '16', name: 'Thiago Ribeiro', email: 'thiago.ribeiro@ecosync.com' },
    { id: '17', name: 'Vanessa Carvalho', email: 'vanessa.carvalho@ecosync.com' },
    { id: '18', name: 'Willian Nascimento', email: 'willian.nascimento@ecosync.com' },
    { id: '19', name: 'Ximena Prado', email: 'ximena.prado@ecosync.com' },
    { id: '20', name: 'Yuri Campos', email: 'yuri.campos@ecosync.com' }
  ];

  // Estados para formulários temporários
  const [tempPrazoForm, setTempPrazoForm] = useState({
    dias: '',
    criador: false,
    responsavel: false,
    sistema: false,
    email: false,
    usuariosSelecionados: [] as Array<{ id: string, name: string, email: string }>,
    usuarioSearch: '',
    showUsuarioDropdown: false
  });

  const [tempRenovacaoForm, setTempRenovacaoForm] = useState({
    dias: '',
    criador: false,
    responsavel: false,
    sistema: false,
    email: false,
    usuariosSelecionados: [] as Array<{ id: string, name: string, email: string }>,
    usuarioSearch: '',
    showUsuarioDropdown: false
  });

  // Estados para regras de vencimento
  const [vencimentoRules, setVencimentoRules] = useState<Array<{
    id: string;
    dias: number;
    criador: { enabled: boolean, sistema: boolean, email: boolean };
    responsavel: { enabled: boolean, sistema: boolean, email: boolean };
    usuarios_selecionados: Array<{ id: string, name: string, email: string, sistema: boolean, email_notif: boolean }>;
  }>>([]);

  const [tempVencimentoForm, setTempVencimentoForm] = useState({
    dias: '',
    criador: false,
    responsavel: false,
    sistema: false,
    email: false,
    usuariosSelecionados: [] as Array<{ id: string, name: string, email: string }>,
    usuarioSearch: '',
    showUsuarioDropdown: false
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExigencia, setSelectedExigencia] = useState<Exigencia | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Estado do acordeão
  const [accordionOpen, setAccordionOpen] = useState({
    prazoAntecipado: false,
    renovacao: false,
    vencimento: false,
    atribuicao: false
  });
  
  const [exigencias, setExigencias] = useState<Exigencia[]>([
    {
      id: 1,
      descricao: 'Apresentar relatório anual completo com demonstrações financeiras auditadas, incluindo balanço patrimonial, demonstração de resultados, fluxo de caixa e notas explicativas. O relatório deve estar em conformidade com as normas contábeis vigentes e incluir parecer de auditoria independente.',
      processo: 'Aplicação Inicial',
      prazo: '15/08/2024',
      status: 'Em Progresso' as 'Em Progresso',
      atribuidoA: 'Maria Silva'
    },
    {
      id: 2,
      descricao: 'Renovar a licença de operação junto ao órgão competente, incluindo toda a documentação necessária como alvará de funcionamento, certificados de regularidade fiscal e trabalhista.',
      processo: 'Renovação',
      prazo: '30/07/2024',
      status: 'Concluído' as 'Concluído',
      atribuidoA: 'João Santos'
    },
    {
      id: 3,
      descricao: 'Completar o treinamento obrigatório de compliance e ética empresarial para todos os funcionários da empresa. O treinamento deve abordar políticas anticorrupção, código de conduta, proteção de dados e práticas de segurança da informação. Certificados individuais devem ser emitidos e arquivados.',
      processo: 'Aplicação Inicial',
      prazo: '01/09/2024',
      status: 'Não Iniciado' as 'Não Iniciado',
      atribuidoA: 'Ana Costa'
    },
    {
      id: 4,
      descricao: 'Realizar o pagamento das taxas de licenciamento e emolumentos referentes ao exercício atual. Incluir comprovantes de pagamento e guias quitadas.',
      processo: 'Pagamento',
      prazo: '20/08/2024',
      status: 'Em Progresso' as 'Em Progresso',
      atribuidoA: 'Pedro Oliveira'
    },
    {
      id: 5,
      descricao: 'Atualizar a apólice de seguro empresarial com cobertura mínima exigida pela legislação, incluindo seguro de responsabilidade civil, seguro patrimonial e seguro de acidentes de trabalho. Apresentar cópia autenticada da apólice e comprovante de pagamento do prêmio.',
      processo: 'Atualização',
      prazo: '25/07/2024',
      status: 'Concluído' as 'Concluído',
      atribuidoA: 'Carla Mendes'
    },
    {
      id: 6,
      descricao: 'Submeter o plano de gestão ambiental atualizado, incluindo medidas de controle de poluição, gestão de resíduos, uso eficiente de recursos naturais e programa de educação ambiental para colaboradores.',
      processo: 'Aplicação Inicial',
      prazo: '10/09/2024',
      status: 'Pendente' as 'Pendente',
      atribuidoA: 'Roberto Lima'
    }
  ]);

  const statusOptions = ['Em Progresso', 'Concluído', 'Não Iniciado', 'Pendente'];
  const processos = Array.from(new Set(exigencias.map(e => e.processo)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditarExigencia = (id: number) => {
    console.log('handleEditarExigencia chamado com id:', id);
    const exigencia = exigencias.find(e => e.id === id);
    if (exigencia) {
      console.log('Exigencia encontrada:', exigencia);
      setSelectedExigencia(exigencia);
      setModalMode('edit');
      setIsModalOpen(true);
      console.log('Modal deve estar aberto agora');
    }
  };

  const handleAdicionarExigencia = () => {
    console.log('handleAdicionarExigencia chamado');
    setSelectedExigencia(null);
    setModalMode('create');
    setIsModalOpen(true);
    console.log('Modal deve estar aberto agora em modo create');
  };

  const handleSaveExigencia = (exigenciaData: Exigencia) => {
    if (modalMode === 'create') {
      const newExigencia = {
        ...exigenciaData,
        id: Math.max(...exigencias.map(e => e.id || 0)) + 1
      };
      setExigencias([...exigencias, newExigencia]);
    } else if (modalMode === 'edit' && selectedExigencia) {
      setExigencias(exigencias.map(e => 
        e.id === selectedExigencia.id ? { ...exigenciaData, id: e.id } : e
      ));
    }
    setIsModalOpen(false);
    setSelectedExigencia(null);
  };

  const handleDownloadXLSX = () => {
    const csvContent = [
      ['Descrição', 'Processo', 'Prazo', 'Status', 'Responsável'],
      ...exigencias.map(e => [
        e.descricao,
        e.processo,
        e.prazo,
        e.status,
        e.atribuidoA
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exigencias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilterDropdown = (filter: string) => {
    setOpenFilterDropdown(openFilterDropdown === filter ? null : filter);
    if (filter === 'processo') setProcessoSearch('');
    if (filter === 'atribuido') setAtribuidoSearch('');
  };

  const handleStatusToggle = (status: string) => {
    if (status === 'all') {
      setFilters(prev => ({ ...prev, status: [] }));
    } else {
      setFilters(prev => ({
        ...prev,
        status: prev.status.includes(status)
          ? prev.status.filter(s => s !== status)
          : [...prev.status, status]
      }));
    }
  };

  const handleProcessoToggle = (processo: string) => {
    if (processo === 'all') {
      setFilters(prev => ({ ...prev, processo: [] }));
    } else {
      setFilters(prev => ({
        ...prev,
        processo: prev.processo.includes(processo)
          ? prev.processo.filter(p => p !== processo)
          : [...prev.processo, processo]
      }));
    }
  };

  const handleAtribuidoToggle = (pessoa: string) => {
    if (pessoa === 'all') {
      setFilters(prev => ({ ...prev, atribuidoA: [] }));
    } else {
      setFilters(prev => ({
        ...prev,
        atribuidoA: prev.atribuidoA.includes(pessoa)
          ? prev.atribuidoA.filter(a => a !== pessoa)
          : [...prev.atribuidoA, pessoa]
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      processo: [],
      atribuidoA: [],
      prazoFrom: '',
      prazoTo: ''
    });
    setSearchTerm('');
  };

  const getDateFilterCount = () => {
    let count = 0;
    if (filters.prazoFrom) count++;
    if (filters.prazoTo) count++;
    return count;
  };

  const filteredProcessos = processos.filter(p => 
    p.toLowerCase().includes(processoSearch.toLowerCase())
  );
  
  const pessoas = Array.from(new Set(exigencias.map(e => e.atribuidoA)));
  const filteredPessoas = pessoas.filter(p => 
    p.toLowerCase().includes(atribuidoSearch.toLowerCase())
  );

  const hasActiveFilters = filters.status.length > 0 || filters.processo.length > 0 || 
    filters.atribuidoA.length > 0 || filters.prazoFrom || filters.prazoTo || searchTerm;

  // Pagination logic
  const totalPages = Math.ceil(exigencias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExigencias = exigencias.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Funções para gerenciar configurações de notificação
  const handleVencimentoChange = (tipo: 'criador' | 'responsavel', campo: 'enabled' | 'sistema' | 'email', valor: boolean) => {
    setVencimentoConfig(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], [campo]: valor }
    }));
  };

  const addEmailToVencimento = () => {
    if (newEmail && newEmail.includes('@')) {
      const emailExists = vencimentoConfig.usuarios_adicionais.some(user => user.email === newEmail);
      if (!emailExists) {
        setVencimentoConfig(prev => ({
          ...prev,
          usuarios_adicionais: [...prev.usuarios_adicionais, { email: newEmail, sistema: false, email_notif: false }]
        }));
        setNewEmail('');
      }
    }
  };

  const removeEmailFromVencimento = (email: string) => {
    setVencimentoConfig(prev => ({
      ...prev,
      usuarios_adicionais: prev.usuarios_adicionais.filter(user => user.email !== email)
    }));
  };

  const updateEmailNotificationSettings = (email: string, campo: 'sistema' | 'email_notif', valor: boolean) => {
    setVencimentoConfig(prev => ({
      ...prev,
      usuarios_adicionais: prev.usuarios_adicionais.map(user => 
        user.email === email ? { ...user, [campo]: valor } : user
      )
    }));
  };

  // Funções para gerenciar regras de prazo antecipado
  const addPrazoAntecipadoRule = () => {
    if (!tempPrazoForm.dias || (!tempPrazoForm.criador && !tempPrazoForm.responsavel && tempPrazoForm.usuariosSelecionados.length === 0)) return;
    
    const newRule = {
      id: Date.now().toString(),
      dias: parseInt(tempPrazoForm.dias),
      criador: { 
        enabled: tempPrazoForm.criador, 
        sistema: tempPrazoForm.criador ? tempPrazoForm.sistema : false, 
        email: tempPrazoForm.criador ? tempPrazoForm.email : false 
      },
      responsavel: { 
        enabled: tempPrazoForm.responsavel, 
        sistema: tempPrazoForm.responsavel ? tempPrazoForm.sistema : false, 
        email: tempPrazoForm.responsavel ? tempPrazoForm.email : false 
      },
      usuarios_selecionados: tempPrazoForm.usuariosSelecionados.map(usuario => ({
        ...usuario,
        sistema: tempPrazoForm.sistema,
        email_notif: tempPrazoForm.email
      }))
    };

    setPrazoAntecipadoRules(prev => [...prev, newRule]);
    setTempPrazoForm({
      dias: '',
      criador: false,
      responsavel: false,
      sistema: false,
      email: false,
      usuariosSelecionados: [],
      usuarioSearch: '',
      showUsuarioDropdown: false
    });
  };

  const removePrazoAntecipadoRule = (id: string) => {
    setPrazoAntecipadoRules(prev => prev.filter(rule => rule.id !== id));
  };

  // Funções para gerenciar regras de renovação antecipada
  const addRenovacaoAntecipadaRule = () => {
    if (!tempRenovacaoForm.dias || (!tempRenovacaoForm.criador && !tempRenovacaoForm.responsavel && tempRenovacaoForm.usuariosSelecionados.length === 0)) return;
    
    const newRule = {
      id: Date.now().toString(),
      dias: parseInt(tempRenovacaoForm.dias),
      criador: { 
        enabled: tempRenovacaoForm.criador, 
        sistema: tempRenovacaoForm.criador ? tempRenovacaoForm.sistema : false, 
        email: tempRenovacaoForm.criador ? tempRenovacaoForm.email : false 
      },
      responsavel: { 
        enabled: tempRenovacaoForm.responsavel, 
        sistema: tempRenovacaoForm.responsavel ? tempRenovacaoForm.sistema : false, 
        email: tempRenovacaoForm.responsavel ? tempRenovacaoForm.email : false 
      },
      usuarios_selecionados: tempRenovacaoForm.usuariosSelecionados.map(usuario => ({
        ...usuario,
        sistema: tempRenovacaoForm.sistema,
        email_notif: tempRenovacaoForm.email
      }))
    };

    setRenovacaoAntecipadaRules(prev => [...prev, newRule]);
    setTempRenovacaoForm({
      dias: '',
      criador: false,
      responsavel: false,
      sistema: false,
      email: false,
      usuariosSelecionados: [],
      usuarioSearch: '',
      showUsuarioDropdown: false
    });
  };

  const removeRenovacaoAntecipadaRule = (id: string) => {
    setRenovacaoAntecipadaRules(prev => prev.filter(rule => rule.id !== id));
  };

  // Funções para gerenciar regras de vencimento
  const addVencimentoRule = () => {
    if (!tempVencimentoForm.dias || (!tempVencimentoForm.criador && !tempVencimentoForm.responsavel && tempVencimentoForm.usuariosSelecionados.length === 0)) return;
    
    const newRule = {
      id: Date.now().toString(),
      dias: parseInt(tempVencimentoForm.dias),
      criador: { 
        enabled: tempVencimentoForm.criador, 
        sistema: tempVencimentoForm.criador ? tempVencimentoForm.sistema : false, 
        email: tempVencimentoForm.criador ? tempVencimentoForm.email : false 
      },
      responsavel: { 
        enabled: tempVencimentoForm.responsavel, 
        sistema: tempVencimentoForm.responsavel ? tempVencimentoForm.sistema : false, 
        email: tempVencimentoForm.responsavel ? tempVencimentoForm.email : false 
      },
      usuarios_selecionados: tempVencimentoForm.usuariosSelecionados.map(usuario => ({
        ...usuario,
        sistema: tempVencimentoForm.sistema,
        email_notif: tempVencimentoForm.email
      }))
    };

    setVencimentoRules(prev => [...prev, newRule]);
    setTempVencimentoForm({
      dias: '',
      criador: false,
      responsavel: false,
      sistema: false,
      email: false,
      usuariosSelecionados: [],
      usuarioSearch: '',
      showUsuarioDropdown: false
    });
  };

  const removeVencimentoRule = (id: string) => {
    setVencimentoRules(prev => prev.filter(rule => rule.id !== id));
  };

  // Funções para gerenciar seleção de usuários - Prazo Antecipado
  const addUsuarioPrazo = (usuario: { id: string, name: string, email: string }) => {
    if (!tempPrazoForm.usuariosSelecionados.some(u => u.id === usuario.id)) {
      setTempPrazoForm(prev => ({
        ...prev,
        usuariosSelecionados: [...prev.usuariosSelecionados, usuario],
        usuarioSearch: '',
        showUsuarioDropdown: false
      }));
    }
  };

  const removeUsuarioPrazo = (usuarioId: string) => {
    setTempPrazoForm(prev => ({
      ...prev,
      usuariosSelecionados: prev.usuariosSelecionados.filter(u => u.id !== usuarioId)
    }));
  };

  // Funções para gerenciar seleção de usuários - Vencimento
  const addUsuarioVencimento = (usuario: { id: string, name: string, email: string }) => {
    if (!tempVencimentoForm.usuariosSelecionados.some(u => u.id === usuario.id)) {
      setTempVencimentoForm(prev => ({
        ...prev,
        usuariosSelecionados: [...prev.usuariosSelecionados, usuario],
        usuarioSearch: ''
      }));
    }
  };

  const removeUsuarioVencimento = (usuarioId: string) => {
    setTempVencimentoForm(prev => ({
      ...prev,
      usuariosSelecionados: prev.usuariosSelecionados.filter(u => u.id !== usuarioId)
    }));
  };

  const getFilteredUsuarios = (searchTerm: string) => {
    return sistemaUsuarios.filter(usuario => 
      usuario.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Funções para gerenciar seleção de usuários - Renovação
  const addUsuarioRenovacao = (usuario: { id: string, name: string, email: string }) => {
    if (!tempRenovacaoForm.usuariosSelecionados.some(u => u.id === usuario.id)) {
      setTempRenovacaoForm(prev => ({
        ...prev,
        usuariosSelecionados: [...prev.usuariosSelecionados, usuario],
        usuarioSearch: '',
        showUsuarioDropdown: false
      }));
    }
  };

  const removeUsuarioRenovacao = (usuarioId: string) => {
    setTempRenovacaoForm(prev => ({
      ...prev,
      usuariosSelecionados: prev.usuariosSelecionados.filter(u => u.id !== usuarioId)
    }));
  };


  if (activeTab === 'notificacoes') {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="flex-1 px-8 py-5">
            <div className="max-w-[1200px] mx-auto">
              {/* Breadcrumb */}
              <div className="flex flex-wrap gap-2 mb-4">
                <a className="text-blue-600 text-base font-medium leading-normal" href="#">
                  Processos
                </a>
                <span className="text-blue-600 text-base font-medium leading-normal">/</span>
                <span className="text-gray-900 text-base font-medium leading-normal">
                  Editar Processo
                </span>
              </div>

              {/* Navigation Tabs */}
              {renderTabs()}

              {/* Título e descrição */}
              <div className="mb-6">
                <h1 className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight mb-2">
                  Configurações de Notificações
                </h1>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  Processo: {formData.processo}
                </p>
              </div>

              {/* Acordeão de Notificações */}
              <div className="space-y-4">
                
                {/* Seção 1: Notificação dias antes do prazo */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAccordionOpen(prev => ({ ...prev, prazoAntecipado: !prev.prazoAntecipado }))}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b"
                  >
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Notificar exigência antes do prazo de vencimento
                      </h2>
                      <p className="text-sm text-gray-600 text-left">
                        Configure notificações antecipadas
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${accordionOpen.prazoAntecipado ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {accordionOpen.prazoAntecipado && (
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Você pode cadastrar várias regras com dias diferentes.
                      </p>
                      
                      {/* Formulário para nova regra */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Nova Regra</h3>
                  <div className="space-y-4">
                    {/* Primeira linha: Configurações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dias de antecedência
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={tempPrazoForm.dias}
                          onChange={(e) => setTempPrazoForm(prev => ({ ...prev, dias: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 15"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usuários padrão
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempPrazoForm.criador}
                              onChange={(e) => setTempPrazoForm(prev => ({ ...prev, criador: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Criador da exigência</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempPrazoForm.responsavel}
                              onChange={(e) => setTempPrazoForm(prev => ({ ...prev, responsavel: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Responsável pela exigência</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de notificação
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempPrazoForm.sistema}
                              onChange={(e) => setTempPrazoForm(prev => ({ ...prev, sistema: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Sistema</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempPrazoForm.email}
                              onChange={(e) => setTempPrazoForm(prev => ({ ...prev, email: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Email</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Usuários do sistema */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Usuários adicionais do sistema
                      </label>
                      
                      <div className="space-y-3">
                        {/* Busca */}
                        <div className="relative">
                          <input
                            type="text"
                            value={tempPrazoForm.usuarioSearch}
                            onChange={(e) => setTempPrazoForm(prev => ({...prev, usuarioSearch: e.target.value}))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite o nome do usuário..."
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          
                          {tempPrazoForm.usuarioSearch && getFilteredUsuarios(tempPrazoForm.usuarioSearch).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {getFilteredUsuarios(tempPrazoForm.usuarioSearch).map((usuario) => (
                                <button
                                  key={usuario.id}
                                  type="button"
                                  onClick={() => {
                                    addUsuarioPrazo(usuario);
                                    setTempPrazoForm(prev => ({...prev, usuarioSearch: ''}));
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="font-medium text-gray-900 text-sm">{usuario.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Tags de usuários selecionados */}
                        {tempPrazoForm.usuariosSelecionados.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              {tempPrazoForm.usuariosSelecionados.length} usuário{tempPrazoForm.usuariosSelecionados.length > 1 ? 's' : ''} selecionado{tempPrazoForm.usuariosSelecionados.length > 1 ? 's' : ''}:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tempPrazoForm.usuariosSelecionados.map((usuario) => (
                                <span
                                  key={usuario.id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {usuario.name}
                                  <button
                                    type="button"
                                    onClick={() => removeUsuarioPrazo(usuario.id)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    title="Remover usuário"
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <button
                        type="button"
                        onClick={addPrazoAntecipadoRule}
                        disabled={!tempPrazoForm.dias || (!tempPrazoForm.criador && !tempPrazoForm.responsavel && tempPrazoForm.usuariosSelecionados.length === 0) || (!tempPrazoForm.sistema && !tempPrazoForm.email)}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Adicionar Regra
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de regras criadas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Regras Configuradas</h3>
                  {prazoAntecipadoRules.length > 0 ? (
                    <div className="space-y-3">
                      {prazoAntecipadoRules.map((rule) => (
                        <div key={rule.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Notificar {rule.dias} {rule.dias <= 1 ? 'dia' : 'dias'} antes do prazo
                              </h4>
                              <p className="text-xs text-blue-600 mt-1">
                                {(() => {
                                  const types = [];
                                  if ((rule.criador.enabled && rule.criador.sistema) || (rule.responsavel.enabled && rule.responsavel.sistema) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.sistema))) {
                                    types.push('Sistema');
                                  }
                                  if ((rule.criador.enabled && rule.criador.email) || (rule.responsavel.enabled && rule.responsavel.email) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.email_notif))) {
                                    types.push('Email');
                                  }
                                  return types.join(' + ');
                                })()}
                              </p>
                            </div>
                            <button
                              onClick={() => removePrazoAntecipadoRule(rule.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Excluir
                            </button>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p><strong>Usuários:</strong></p>
                            <div className="mt-2 space-y-1">
                              {rule.criador.enabled && (
                                <span className="inline-block">• Criador da exigência</span>
                              )}
                              {rule.responsavel.enabled && (
                                <span className="inline-block">• Responsável pela exigência</span>
                              )}
                              {rule.usuarios_selecionados && rule.usuarios_selecionados.map((usuario, index) => (
                                <span key={index} className="inline-block">• {usuario.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Nenhuma regra configurada para notificação antecipada.
                    </div>
                  )}
                </div>
                    </div>
                  )}
                </div>

                {/* Seção 2: Renovação antes do prazo */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAccordionOpen(prev => ({ ...prev, renovacao: !prev.renovacao }))}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b"
                  >
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Notificar sobre prazo de solicitação de renovação
                      </h2>
                      <p className="text-sm text-gray-600 text-left">
                        Configure lembretes antecipados para renovação
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${accordionOpen.renovacao ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {accordionOpen.renovacao && (
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Você pode cadastrar várias regras com dias diferentes.
                      </p>
                      
                      {/* Formulário para nova regra */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Nova Regra</h3>
                  <div className="space-y-4">
                    {/* Primeira linha: Configurações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dias de antecedência
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={tempRenovacaoForm.dias}
                          onChange={(e) => setTempRenovacaoForm(prev => ({ ...prev, dias: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 30"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usuários padrão
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempRenovacaoForm.criador}
                              onChange={(e) => setTempRenovacaoForm(prev => ({ ...prev, criador: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Criador da exigência</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempRenovacaoForm.responsavel}
                              onChange={(e) => setTempRenovacaoForm(prev => ({ ...prev, responsavel: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Responsável pela exigência</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de notificação
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempRenovacaoForm.sistema}
                              onChange={(e) => setTempRenovacaoForm(prev => ({ ...prev, sistema: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Sistema</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempRenovacaoForm.email}
                              onChange={(e) => setTempRenovacaoForm(prev => ({ ...prev, email: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Email</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Usuários do sistema */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Usuários adicionais do sistema
                      </label>
                      
                      <div className="space-y-3">
                        {/* Busca */}
                        <div className="relative">
                          <input
                            type="text"
                            value={usuarioSearchRenovacao}
                            onChange={(e) => setUsuarioSearchRenovacao(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite o nome do usuário..."
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          
                          {usuarioSearchRenovacao && getFilteredUsuarios(usuarioSearchRenovacao).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {getFilteredUsuarios(usuarioSearchRenovacao).map((usuario) => (
                                <button
                                  key={usuario.id}
                                  type="button"
                                  onClick={() => {
                                    addUsuarioRenovacao(usuario);
                                    setUsuarioSearchRenovacao('');
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="font-medium text-gray-900 text-sm">{usuario.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Tags de usuários selecionados */}
                        {tempRenovacaoForm.usuariosSelecionados.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              {tempRenovacaoForm.usuariosSelecionados.length} usuário{tempRenovacaoForm.usuariosSelecionados.length > 1 ? 's' : ''} selecionado{tempRenovacaoForm.usuariosSelecionados.length > 1 ? 's' : ''}:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tempRenovacaoForm.usuariosSelecionados.map((usuario) => (
                                <span
                                  key={usuario.id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {usuario.name}
                                  <button
                                    type="button"
                                    onClick={() => removeUsuarioRenovacao(usuario.id)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    title="Remover usuário"
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <button
                        type="button"
                        onClick={addRenovacaoAntecipadaRule}
                        disabled={!tempRenovacaoForm.dias || (!tempRenovacaoForm.criador && !tempRenovacaoForm.responsavel && tempRenovacaoForm.usuariosSelecionados.length === 0) || (!tempRenovacaoForm.sistema && !tempRenovacaoForm.email)}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Adicionar Regra
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de regras criadas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Regras Configuradas</h3>
                  {renovacaoAntecipadaRules.length > 0 ? (
                    <div className="space-y-3">
                      {renovacaoAntecipadaRules.map((rule) => (
                        <div key={rule.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Lembrete de renovação {rule.dias} {rule.dias <= 1 ? 'dia' : 'dias'} antes do prazo
                              </h4>
                              <p className="text-xs text-blue-600 mt-1">
                                {(() => {
                                  const types = [];
                                  if ((rule.criador.enabled && rule.criador.sistema) || (rule.responsavel.enabled && rule.responsavel.sistema) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.sistema))) {
                                    types.push('Sistema');
                                  }
                                  if ((rule.criador.enabled && rule.criador.email) || (rule.responsavel.enabled && rule.responsavel.email) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.email_notif))) {
                                    types.push('Email');
                                  }
                                  return types.join(' + ');
                                })()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeRenovacaoAntecipadaRule(rule.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Excluir
                            </button>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p><strong>Usuários:</strong></p>
                            <div className="mt-2 space-y-1">
                              {rule.criador.enabled && (
                                <span className="inline-block">• Criador da exigência</span>
                              )}
                              {rule.responsavel.enabled && (
                                <span className="inline-block">• Responsável pela exigência</span>
                              )}
                              {rule.usuarios_selecionados && rule.usuarios_selecionados.map((usuario, index) => (
                                <span key={index} className="inline-block">• {usuario.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Nenhuma regra configurada para renovação antecipada.
                    </div>
                  )}
                </div>
                    </div>
                  )}
                </div>

                {/* Seção 3: Vencimento do prazo */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAccordionOpen(prev => ({ ...prev, vencimento: !prev.vencimento }))}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b"
                  >
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Notificar quando venceu o prazo da exigência
                      </h2>
                      <p className="text-sm text-gray-600 text-left">
                        Configure notificações após o vencimento
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${accordionOpen.vencimento ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {accordionOpen.vencimento && (
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Você pode cadastrar várias regras com dias diferentes.
                      </p>
                      
                      {/* Formulário para nova regra */}
                <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Adicionar Nova Regra</h3>
                  <div className="space-y-4">
                    {/* Primeira linha: Configurações básicas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dias após vencimento
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={tempVencimentoForm.dias}
                          onChange={(e) => setTempVencimentoForm(prev => ({ ...prev, dias: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 7"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usuários padrão
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempVencimentoForm.criador}
                              onChange={(e) => setTempVencimentoForm(prev => ({ ...prev, criador: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Criador da exigência</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempVencimentoForm.responsavel}
                              onChange={(e) => setTempVencimentoForm(prev => ({ ...prev, responsavel: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Responsável pela exigência</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de notificação
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempVencimentoForm.sistema}
                              onChange={(e) => setTempVencimentoForm(prev => ({ ...prev, sistema: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Sistema</span>
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={tempVencimentoForm.email}
                              onChange={(e) => setTempVencimentoForm(prev => ({ ...prev, email: e.target.checked }))}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <span className="text-sm text-gray-600">Email</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Usuários do sistema */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Usuários adicionais do sistema
                      </label>
                      
                      <div className="space-y-3">
                        {/* Busca */}
                        <div className="relative">
                          <input
                            type="text"
                            value={tempVencimentoForm.usuarioSearch}
                            onChange={(e) => setTempVencimentoForm(prev => ({...prev, usuarioSearch: e.target.value}))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite o nome do usuário..."
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          
                          {tempVencimentoForm.usuarioSearch && getFilteredUsuarios(tempVencimentoForm.usuarioSearch).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {getFilteredUsuarios(tempVencimentoForm.usuarioSearch).map((usuario) => (
                                <button
                                  key={usuario.id}
                                  type="button"
                                  onClick={() => {
                                    addUsuarioVencimento(usuario);
                                    setTempVencimentoForm(prev => ({...prev, usuarioSearch: ''}));
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  <div className="font-medium text-gray-900 text-sm">{usuario.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Tags de usuários selecionados */}
                        {tempVencimentoForm.usuariosSelecionados.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-2">
                              {tempVencimentoForm.usuariosSelecionados.length} usuário{tempVencimentoForm.usuariosSelecionados.length > 1 ? 's' : ''} selecionado{tempVencimentoForm.usuariosSelecionados.length > 1 ? 's' : ''}:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tempVencimentoForm.usuariosSelecionados.map((usuario) => (
                                <span
                                  key={usuario.id}
                                  className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {usuario.name}
                                  <button
                                    type="button"
                                    onClick={() => removeUsuarioVencimento(usuario.id)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    title="Remover usuário"
                                  >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end border-t pt-4">
                      <button
                        type="button"
                        onClick={addVencimentoRule}
                        disabled={!tempVencimentoForm.dias || (!tempVencimentoForm.criador && !tempVencimentoForm.responsavel && tempVencimentoForm.usuariosSelecionados.length === 0) || (!tempVencimentoForm.sistema && !tempVencimentoForm.email)}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        ✓ Adicionar Regra
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lista de regras criadas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Regras Configuradas</h3>
                  {vencimentoRules.length > 0 ? (
                    <div className="space-y-3">
                      {vencimentoRules.map((rule) => (
                        <div key={rule.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                Notificar {rule.dias} {rule.dias <= 1 ? 'dia' : 'dias'} após vencimento
                              </h4>
                              <p className="text-xs text-blue-600 mt-1">
                                {(() => {
                                  const types = [];
                                  if ((rule.criador.enabled && rule.criador.sistema) || (rule.responsavel.enabled && rule.responsavel.sistema) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.sistema))) {
                                    types.push('Sistema');
                                  }
                                  if ((rule.criador.enabled && rule.criador.email) || (rule.responsavel.enabled && rule.responsavel.email) || (rule.usuarios_selecionados && rule.usuarios_selecionados.some(u => u.email_notif))) {
                                    types.push('Email');
                                  }
                                  return types.join(' + ');
                                })()}
                              </p>
                            </div>
                            <button
                              onClick={() => removeVencimentoRule(rule.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Excluir
                            </button>
                          </div>
                          <div className="text-xs text-gray-600">
                            <p><strong>Usuários:</strong></p>
                            <div className="mt-2 space-y-1">
                              {rule.criador.enabled && (
                                <span className="inline-block">• Criador da exigência</span>
                              )}
                              {rule.responsavel.enabled && (
                                <span className="inline-block">• Responsável pela exigência</span>
                              )}
                              {rule.usuarios_selecionados && rule.usuarios_selecionados.map((usuario, index) => (
                                <span key={index} className="inline-block">• {usuario.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Nenhuma regra configurada para notificação de vencimento.
                    </div>
                  )}
                </div>
                    </div>
                  )}
                </div>

                {/* Seção 4: Notificação de Atribuição */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAccordionOpen(prev => ({ ...prev, atribuicao: !prev.atribuicao }))}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b"
                  >
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Notificar quando uma exigência for atribuída
                      </h2>
                      <p className="text-sm text-gray-600 text-left">
                        Alerta automático ao atribuir responsável
                      </p>
                    </div>
                    <svg 
                      className={`w-5 h-5 transition-transform ${accordionOpen.atribuicao ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {accordionOpen.atribuicao && (
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-4">
                        Quando uma exigência for atribuída a um responsável, notificar automaticamente.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="notificarAtribuicao"
                            checked={formData.notificarAtribuicao || false}
                            onChange={(e) => setFormData(prev => ({ ...prev, notificarAtribuicao: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                          />
                          <label htmlFor="notificarAtribuicao" className="ml-2 text-sm text-gray-900">
                            Ativar notificação de atribuição de responsável
                          </label>
                        </div>

                        {formData.notificarAtribuicao && (
                          <div className="ml-6 space-y-3 border-l-2 border-blue-200 pl-4">
                            <p className="text-xs text-gray-600 mb-3">
                              Escolha como o responsável será notificado:
                            </p>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id="notificarAtribuicaoSistema"
                                  checked={formData.notificarAtribuicaoSistema || false}
                                  onChange={(e) => setFormData(prev => ({ ...prev, notificarAtribuicaoSistema: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2" 
                                />
                                <span className="text-sm text-gray-700">Notificação no sistema</span>
                              </label>
                              <label className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id="notificarAtribuicaoEmail"
                                  checked={formData.notificarAtribuicaoEmail || false}
                                  onChange={(e) => setFormData(prev => ({ ...prev, notificarAtribuicaoEmail: e.target.checked }))}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2" 
                                />
                                <span className="text-sm text-gray-700">Email de notificação</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'exigencias') {
    return (
      <>
      <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="flex-1 px-8 py-5">
            <div className="max-w-[1200px] mx-auto">
              {/* Breadcrumb */}
              <div className="flex flex-wrap gap-2 mb-4">
                <a className="text-blue-600 text-base font-medium leading-normal" href="#">
                  Processos
                </a>
                <span className="text-blue-600 text-base font-medium leading-normal">/</span>
                <span className="text-gray-900 text-base font-medium leading-normal">
                  Editar Processo
                </span>
              </div>

              {/* Navigation Tabs */}
              {renderTabs()}

              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">Exigências</p>
                  <p className="text-gray-600 text-sm font-normal leading-normal">Processo: {formData.processo}</p>
                </div>
                <button 
                  onClick={handleAdicionarExigencia}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal">
                  <span className="truncate">Adicionar Exigência</span>
                </button>
              </div>

              {/* Filtros - agora na parte superior */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
                
                {/* Busca */}
                <div className="mb-4">
                  <div className="flex items-stretch rounded-lg bg-gray-100 h-10">
                    <div className="flex items-center justify-center pl-4 text-gray-500">
                      <Search size={20} />
                    </div>
                    <input
                      placeholder="Buscar exigências"
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent px-2 text-base font-normal leading-normal outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4" ref={filterRef}>
                  {/* Filtro Prazo */}
                <div className="relative">
                  <button 
                    onClick={() => toggleFilterDropdown('prazo')}
                    className="flex h-8 w-full items-center justify-between gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                  >
                    <p className="text-[#0d141c] text-sm font-medium leading-normal">
                      Prazo {getDateFilterCount() > 0 && `(${getDateFilterCount()})`}
                    </p>
                    <ChevronDown size={20} />
                  </button>
                  {openFilterDropdown === 'prazo' && (
                    <div className="absolute top-10 left-0 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-3">
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">De:</label>
                          <input
                            type="date"
                            value={filters.prazoFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, prazoFrom: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Até:</label>
                          <input
                            type="date"
                            value={filters.prazoTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, prazoTo: e.target.value }))}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => setOpenFilterDropdown(null)}
                          className="w-full px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro Status */}
                <div className="relative">
                  <button 
                    onClick={() => toggleFilterDropdown('status')}
                    className="flex h-8 w-full items-center justify-between gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                  >
                    <p className="text-[#0d141c] text-sm font-medium leading-normal">
                      Status {filters.status.length > 0 && `(${filters.status.length})`}
                    </p>
                    <ChevronDown size={20} />
                  </button>
                  {openFilterDropdown === 'status' && (
                    <div className="absolute top-10 left-0 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.status.length === 0}
                            onChange={() => handleStatusToggle('all')}
                            className="mr-2"
                          />
                          Todos
                        </label>
                        <div className="border-t border-gray-200"></div>
                        {statusOptions.map(status => (
                          <label key={status} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={() => handleStatusToggle(status)}
                              className="mr-2"
                            />
                            {status}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Filtro Responsável */}
                <div className="relative">
                  <button 
                    onClick={() => toggleFilterDropdown('atribuido')}
                    className="flex h-8 w-full items-center justify-between gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                  >
                    <p className="text-[#0d141c] text-sm font-medium leading-normal">
                      Responsável {filters.atribuidoA.length > 0 && `(${filters.atribuidoA.length})`}
                    </p>
                    <ChevronDown size={20} />
                  </button>
                  {openFilterDropdown === 'atribuido' && (
                    <div className="absolute top-10 left-0 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Buscar pessoa..."
                          value={atribuidoSearch}
                          onChange={(e) => setAtribuidoSearch(e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="py-1 max-h-60 overflow-y-auto">
                        <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.atribuidoA.length === 0}
                            onChange={() => handleAtribuidoToggle('all')}
                            className="mr-2"
                          />
                          Todos
                        </label>
                        <div className="border-t border-gray-200"></div>
                        {filteredPessoas.map(pessoa => (
                          <label key={pessoa} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.atribuidoA.includes(pessoa)}
                              onChange={() => handleAtribuidoToggle(pessoa)}
                              className="mr-2"
                            />
                            {pessoa}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-6">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-x-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2"
                    >
                      <X size={16} />
                      <span className="text-sm font-medium">Limpar Filtros</span>
                    </button>
                  )}
                  <button
                    className="flex items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 px-4 py-2"
                  >
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filtrar</span>
                  </button>
                  <button
                    onClick={handleDownloadXLSX}
                    className="flex items-center justify-center gap-x-2 rounded-lg bg-green-600 text-white hover:bg-green-700 px-4 py-2"
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">Download XLSX</span>
                  </button>
                </div>
              </div>
              
              {/* Tabela de Exigências */}
              <div className="bg-white rounded-lg shadow">
                <TabelaExigencias 
                  exigencias={currentExigencias}
                  onEditarExigencia={handleEditarExigencia}
                  onRemoverExigencia={(id) => console.log(`Remover exigência ${id}`)}
                  showProcessoLink={false}
                />
              </div>
              
              {/* Pagination */}
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={exigencias.length}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <RequirementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExigencia(null);
        }}
        onSave={handleSaveExigencia}
        exigencia={selectedExigencia}
        mode={modalMode}
      />
      </>
    );
  }

  // Aba dados
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />

        {/* Content */}
        <div className="flex-1 px-8 py-5">
          <div className="max-w-[1200px] mx-auto">
            {/* Breadcrumb - sempre visível */}
            <div className="flex flex-wrap gap-2 mb-4">
              <a className="text-blue-600 text-base font-medium leading-normal" href="#">
                Processos
              </a>
              <span className="text-blue-600 text-base font-medium leading-normal">/</span>
              <span className="text-gray-900 text-base font-medium leading-normal">
                Editar Processo
              </span>
            </div>

            {/* Navigation Tabs */}
            {renderTabs()}
            
            {/* License Details - Row 1 */}
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-4">
                <p className="text-gray-600 text-sm font-normal leading-normal">Número do Processo</p>
                <p className="text-gray-900 text-sm font-normal leading-normal bg-gray-100 p-2 rounded">
                  {formData.processo}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Tipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LICENÇA DE INSTALAÇÃO">LICENÇA DE INSTALAÇÃO</option>
                  <option value="AUTORIZAÇÃO">AUTORIZAÇÃO</option>
                  <option value="LICENÇA DE OPERAÇÃO">LICENÇA DE OPERAÇÃO</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>
            </div>

            {/* License Details - Row 2 */}
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Razão Social</label>
                <input
                  type="text"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Município</label>
                <input
                  type="text"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Caracterização do Empreendimento */}
            <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4">
              <label className="text-gray-600 text-sm font-normal leading-normal mb-2">
                Caracterização do Empreendimento
              </label>
              <textarea
                name="caracterizacao"
                value={formData.caracterizacao}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
              />
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-3">
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Data Emissão</label>
                <input
                  type="date"
                  name="dataEmissao"
                  value={formData.dataEmissao}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 px-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Data Validade</label>
                <input
                  type="date"
                  name="dataValidade"
                  value={formData.dataValidade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-4">
                <label className="text-gray-600 text-sm font-normal leading-normal">Prazo Solicitação Renovação</label>
                <input
                  type="date"
                  name="prazoRenovacao"
                  value={formData.prazoRenovacao}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Observações */}
            <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4">
              <label className="text-gray-600 text-sm font-normal leading-normal mb-2">Observações</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Digite aqui observações adicionais sobre a licença..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Salvar Alterações
              </button>
              <button className="flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <RequirementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExigencia(null);
        }}
        onSave={handleSaveExigencia}
        exigencia={selectedExigencia}
        mode={modalMode}
      />
    </div>
  );
};

export default EditProcess;
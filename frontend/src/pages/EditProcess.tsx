import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, X, Filter, Download } from 'lucide-react';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import TabelaExigencias, { Exigencia } from '../components/TabelaExigencias';


const EditProcess: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('Process ID:', id); // Usar as variáveis para evitar warning
  const [activeTab, setActiveTab] = useState<'dados' | 'exigencias'>('dados');
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
    observacoes: ''
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const [exigencias] = useState<Exigencia[]>([
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
    console.log(`Editar exigência ${id}`);
  };

  const handleDownloadXLSX = () => {
    const csvContent = [
      ['Descrição', 'Processo', 'Prazo', 'Status', 'Atribuído a'],
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


  if (activeTab === 'exigencias') {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <div className="gap-1 px-6 flex flex-1 justify-center py-5">
            {/* Sidebar de Filtros */}
            <div className="layout-content-container flex flex-col w-80">
              <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-5">Filtros</h2>
              <div className="px-4 py-3">
                <div className="flex items-stretch rounded-lg bg-gray-100 h-12">
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
              <div className="flex flex-col gap-3 p-3 pr-4" ref={filterRef}>
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

                {/* Filtro Atribuído a */}
                <div className="relative">
                  <button 
                    onClick={() => toggleFilterDropdown('atribuido')}
                    className="flex h-8 w-full items-center justify-between gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                  >
                    <p className="text-[#0d141c] text-sm font-medium leading-normal">
                      Atribuído a {filters.atribuidoA.length > 0 && `(${filters.atribuidoA.length})`}
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

                {/* Botão Limpar Filtros */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex h-8 w-full items-center justify-center gap-x-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">Limpar Filtros</span>
                  </button>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex h-8 flex-1 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filtrar</span>
                  </button>
                  <button
                    onClick={handleDownloadXLSX}
                    className="flex h-8 flex-1 items-center justify-center gap-x-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">Download XLSX</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Área de Conteúdo Principal */}
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              {/* Breadcrumb para exigencias */}
              <div className="flex flex-wrap gap-2 mb-4">
                <a className="text-blue-600 text-base font-medium leading-normal" href="#">
                  Processos
                </a>
                <span className="text-blue-600 text-base font-medium leading-normal">/</span>
                <span className="text-gray-900 text-base font-medium leading-normal">
                  Editar Processo
                </span>
              </div>

              {/* Navigation Tabs - dentro do container das exigências */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 p-1">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('dados')}
                    className="px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
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
                    className="px-4 py-2 rounded-md transition-colors bg-blue-600 text-white shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <span className="font-medium">Exigências</span>
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
              
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">Exigências</p>
                  <p className="text-gray-600 text-sm font-normal leading-normal">Processo: {formData.processo}</p>
                </div>
              </div>
              
              <div className="px-4 py-3">
                <TabelaExigencias 
                  exigencias={currentExigencias}
                  onEditarExigencia={handleEditarExigencia}
                  showProcessoLink={false}
                />
              </div>
              
              {/* Pagination */}
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

            {/* Navigation Tabs - sempre visível logo abaixo do breadcrumb */}
            <div className="flex items-center justify-between mt-6 mb-6 bg-white rounded-lg border border-gray-200 p-1">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('dados')}
                  className="px-4 py-2 rounded-md transition-colors bg-blue-600 text-white shadow-sm"
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
                  className="px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <span className="font-medium">Exigências</span>
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
    </div>
  );
};

export default EditProcess;
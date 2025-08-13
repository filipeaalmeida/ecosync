import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MoreVertical, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Pagination from '../components/Pagination';

interface Exigencia {
  id: number;
  descricao: string;
  processo: string;
  prazo: string;
  status: 'Em Progresso' | 'Concluído' | 'Não Iniciado' | 'Pendente';
  atribuidoA: string;
}

interface FilterState {
  status: string[];
  processo: string[];
  atribuidoA: string[];
  prazoFrom: string;
  prazoTo: string;
}

const Exigencias: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [processoSearch, setProcessoSearch] = useState('');
  const [atribuidoSearch, setAtribuidoSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    processo: [],
    atribuidoA: [],
    prazoFrom: '',
    prazoTo: ''
  });

  const [exigencias] = useState<Exigencia[]>([
    {
      id: 1,
      descricao: 'Apresentar relatório anual completo com demonstrações financeiras auditadas, incluindo balanço patrimonial, demonstração de resultados, fluxo de caixa e notas explicativas. O relatório deve estar em conformidade com as normas contábeis vigentes e incluir parecer de auditoria independente.',
      processo: 'Aplicação Inicial',
      prazo: '15/08/2024',
      status: 'Em Progresso',
      atribuidoA: 'Maria Silva'
    },
    {
      id: 2,
      descricao: 'Renovar a licença de operação junto ao órgão competente, incluindo toda a documentação necessária como alvará de funcionamento, certificados de regularidade fiscal e trabalhista.',
      processo: 'Renovação',
      prazo: '30/07/2024',
      status: 'Concluído',
      atribuidoA: 'João Santos'
    },
    {
      id: 3,
      descricao: 'Completar o treinamento obrigatório de compliance e ética empresarial para todos os funcionários da empresa. O treinamento deve abordar políticas anticorrupção, código de conduta, proteção de dados e práticas de segurança da informação. Certificados individuais devem ser emitidos e arquivados.',
      processo: 'Aplicação Inicial',
      prazo: '01/09/2024',
      status: 'Não Iniciado',
      atribuidoA: 'Ana Costa'
    },
    {
      id: 4,
      descricao: 'Realizar o pagamento das taxas de licenciamento e emolumentos referentes ao exercício atual. Incluir comprovantes de pagamento e guias quitadas.',
      processo: 'Pagamento',
      prazo: '20/08/2024',
      status: 'Em Progresso',
      atribuidoA: 'Pedro Oliveira'
    },
    {
      id: 5,
      descricao: 'Atualizar a apólice de seguro empresarial com cobertura mínima exigida pela legislação, incluindo seguro de responsabilidade civil, seguro patrimonial e seguro de acidentes de trabalho. Apresentar cópia autenticada da apólice e comprovante de pagamento do prêmio.',
      processo: 'Atualização',
      prazo: '25/07/2024',
      status: 'Concluído',
      atribuidoA: 'Carla Mendes'
    },
    {
      id: 6,
      descricao: 'Submeter o plano de gestão ambiental atualizado, incluindo medidas de controle de poluição, gestão de resíduos, uso eficiente de recursos naturais e programa de educação ambiental para colaboradores.',
      processo: 'Aplicação Inicial',
      prazo: '10/09/2024',
      status: 'Pendente',
      atribuidoA: 'Roberto Lima'
    }
  ]);

  const statusOptions = ['Em Progresso', 'Concluído', 'Não Iniciado', 'Pendente'];
  const processos = Array.from(new Set(exigencias.map(e => e.processo)));
  const pessoas = Array.from(new Set(exigencias.map(e => e.atribuidoA)));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Em Progresso':
        return 'bg-blue-100 text-blue-800';
      case 'Não Iniciado':
        return 'bg-gray-100 text-gray-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMenuClick = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  const handleAcao = (acao: string, id: number) => {
    console.log(`Ação: ${acao} para exigência ${id}`);
    setMenuAberto(null);
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

  const checkDateStatus = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'expired';
    } else if (diffDays <= 30) {
      return 'warning';
    }
    return 'normal';
  };

  const DateIndicator: React.FC<{ date: string }> = ({ date }) => {
    const status = checkDateStatus(date);
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-[#49739c] text-sm">{date}</span>
        {status === 'expired' && (
          <div className="group relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ef4444" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Prazo vencido
            </div>
          </div>
        )}
        {status === 'warning' && (
          <div className="group relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#eab308" viewBox="0 0 256 256">
              <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Vence em 30 dias ou menos
            </div>
          </div>
        )}
      </div>
    );
  };

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
            <div className="flex gap-3 p-3 flex-wrap pr-4" ref={filterRef}>
              {/* Filtro Status */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('status')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Status {filters.status.length > 0 && `(${filters.status.length})`}
                  </p>
                  <ChevronDown size={20} />
                </button>
                {openFilterDropdown === 'status' && (
                  <div className="absolute top-10 left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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

              {/* Filtro Processo */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('processo')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Processo {filters.processo.length > 0 && `(${filters.processo.length})`}
                  </p>
                  <ChevronDown size={20} />
                </button>
                {openFilterDropdown === 'processo' && (
                  <div className="absolute top-10 left-0 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="p-2 border-b border-gray-200">
                      <input
                        type="text"
                        placeholder="Buscar processo..."
                        value={processoSearch}
                        onChange={(e) => setProcessoSearch(e.target.value)}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.processo.length === 0}
                          onChange={() => handleProcessoToggle('all')}
                          className="mr-2"
                        />
                        Todos
                      </label>
                      <div className="border-t border-gray-200"></div>
                      {filteredProcessos.map(processo => (
                        <label key={processo} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.processo.includes(processo)}
                            onChange={() => handleProcessoToggle(processo)}
                            className="mr-2"
                          />
                          {processo}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filtro Prazo */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('prazo')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Prazo {getDateFilterCount() > 0 && `(${getDateFilterCount()})`}
                  </p>
                  <ChevronDown size={20} />
                </button>
                {openFilterDropdown === 'prazo' && (
                  <div className="absolute top-10 left-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-3">
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

              {/* Filtro Atribuído a */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('atribuido')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Atribuído a {filters.atribuidoA.length > 0 && `(${filters.atribuidoA.length})`}
                  </p>
                  <ChevronDown size={20} />
                </button>
                {openFilterDropdown === 'atribuido' && (
                  <div className="absolute top-10 left-0 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
                  className="flex h-8 items-center justify-center gap-x-2 rounded-lg bg-red-50 text-red-600 px-3 hover:bg-red-100"
                >
                  <X size={16} />
                  <span className="text-sm font-medium">Limpar Filtros</span>
                </button>
              )}
            </div>
          </div>

          {/* Área de Conteúdo Principal */}
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">Exigências</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">Gerencie todas as suas exigências em um só lugar.</p>
              </div>
            </div>
            
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto w-full">
                  <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[300px]">Descrição</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[150px]">Processo</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[120px]">Prazo</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[130px]">Status</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[150px]">Atribuído a</th>
                      <th className="px-4 py-3 text-center text-[#0d141c] text-sm font-medium leading-normal w-[60px]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExigencias.map((exigencia, index) => {
                      const isLastRows = index >= currentExigencias.length - 2;
                      return (
                      <tr key={exigencia.id} className="border-t border-t-[#cedbe8]">
                        <td className="h-[72px] px-4 py-2 text-[#0d141c] text-sm font-normal leading-normal">
                          <div className="max-w-[400px]">
                            {exigencia.descricao}
                          </div>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                          <div className="flex items-center gap-2">
                            {exigencia.processo}
                            <button
                              onClick={() => navigate(`/processos/editar/${exigencia.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Editar processo"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                          <DateIndicator date={exigencia.prazo} />
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exigencia.status)}`}>
                            {exigencia.status}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                          {exigencia.atribuidoA}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-center relative">
                          <div ref={menuAberto === exigencia.id ? menuRef : null}>
                            <button
                              onClick={() => handleMenuClick(exigencia.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
                            >
                              <MoreVertical size={20} className="text-gray-600" />
                            </button>
                            {menuAberto === exigencia.id && (
                              <div className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${
                                isLastRows ? 'bottom-8' : 'top-full mt-1'
                              }`}>
                                <div className="py-1" role="menu">
                                  <button
                                    onClick={() => handleAcao('alterar-status', exigencia.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Alterar Status
                                  </button>
                                  <button
                                    onClick={() => handleAcao('atribuir', exigencia.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Atribuir
                                  </button>
                                  <button
                                    onClick={() => handleAcao('editar', exigencia.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Editar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
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
};

export default Exigencias;
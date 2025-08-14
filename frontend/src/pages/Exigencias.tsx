import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, Filter, Download } from 'lucide-react';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import TabelaExigencias, { Exigencia } from '../components/TabelaExigencias';
import RequirementModal from '../components/RequirementModal';

interface FilterState {
  status: string[];
  processo: string[];
  atribuidoA: string[];
  prazoFrom: string;
  prazoTo: string;
}

const Exigencias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [processoSearch, setProcessoSearch] = useState('');
  const [atribuidoSearch, setAtribuidoSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exigenciaToDelete, setExigenciaToDelete] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // Estados para o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExigencia, setSelectedExigencia] = useState<Exigencia | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    processo: [],
    atribuidoA: [],
    prazoFrom: '',
    prazoTo: ''
  });

  const [exigencias, setExigencias] = useState<Exigencia[]>([
    {
      id: 1,
      descricaoResumida: 'Relatório anual com demonstrações financeiras',
      descricao: 'Apresentar relatório anual completo com demonstrações financeiras auditadas, incluindo balanço patrimonial, demonstração de resultados, fluxo de caixa e notas explicativas. O relatório deve estar em conformidade com as normas contábeis vigentes e incluir parecer de auditoria independente.',
      processo: 'Aplicação Inicial',
      prazo: '15/08/2024',
      status: 'Em Progresso',
      atribuidoA: 'Maria Silva',
      observacoes: 'Aguardando retorno da auditoria externa. Previsão de conclusão em 10 dias.',
      criadoPor: 'ia'
    },
    {
      id: 2,
      descricaoResumida: 'Renovação de licença de operação',
      descricao: 'Renovar a licença de operação junto ao órgão competente, incluindo toda a documentação necessária como alvará de funcionamento, certificados de regularidade fiscal e trabalhista.',
      processo: 'Renovação',
      prazo: '30/07/2024',
      status: 'Concluído',
      atribuidoA: 'João Santos',
      observacoes: '',
      criadoPor: 'usuario'
    },
    {
      id: 3,
      descricaoResumida: 'Treinamento de compliance obrigatório',
      descricao: 'Completar o treinamento obrigatório de compliance e ética empresarial para todos os funcionários da empresa. O treinamento deve abordar políticas anticorrupção, código de conduta, proteção de dados e práticas de segurança da informação. Certificados individuais devem ser emitidos e arquivados.',
      processo: 'Aplicação Inicial',
      prazo: '01/09/2024',
      status: 'Não Iniciado',
      atribuidoA: 'Ana Costa',
      observacoes: 'Contatar RH para agendar as sessões de treinamento.',
      criadoPor: 'ia'
    },
    {
      id: 4,
      descricaoResumida: 'Pagamento de taxas de licenciamento',
      descricao: 'Realizar o pagamento das taxas de licenciamento e emolumentos referentes ao exercício atual. Incluir comprovantes de pagamento e guias quitadas.',
      processo: 'Pagamento',
      prazo: '20/08/2024',
      status: 'Em Progresso',
      atribuidoA: 'Pedro Oliveira',
      observacoes: '',
      criadoPor: 'usuario'
    },
    {
      id: 5,
      descricaoResumida: 'Atualização de apólice de seguro',
      descricao: 'Atualizar a apólice de seguro empresarial com cobertura mínima exigida pela legislação, incluindo seguro de responsabilidade civil, seguro patrimonial e seguro de acidentes de trabalho. Apresentar cópia autenticada da apólice e comprovante de pagamento do prêmio.',
      processo: 'Atualização',
      prazo: '25/07/2024',
      status: 'Concluído',
      atribuidoA: 'Carla Mendes',
      observacoes: 'Apólice renovada com a seguradora Porto Seguro.',
      criadoPor: 'usuario'
    },
    {
      id: 6,
      descricaoResumida: 'Plano de gestão ambiental',
      descricao: 'Submeter o plano de gestão ambiental atualizado, incluindo medidas de controle de poluição, gestão de resíduos, uso eficiente de recursos naturais e programa de educação ambiental para colaboradores.',
      processo: 'Aplicação Inicial',
      prazo: '10/09/2024',
      status: 'Pendente',
      atribuidoA: 'Roberto Lima',
      observacoes: 'Aguardando parecer do consultor ambiental.',
      criadoPor: 'ia'
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

  const handleSaveExigencia = (exigenciaData: Exigencia) => {
    console.log('Salvando exigência:', exigenciaData);
    if (modalMode === 'create') {
      console.log('Criando nova exigência');
      // Adicionar nova exigência com ID único
      const newExigencia = {
        ...exigenciaData,
        id: Math.max(...exigencias.map(e => e.id)) + 1,
        criadoPor: 'usuario' as const
      };
      setExigencias(prev => [...prev, newExigencia]);
    } else if (modalMode === 'edit') {
      console.log('Atualizando exigência existente');
      // Atualizar exigência existente
      setExigencias(prev => prev.map(e => 
        e.id === exigenciaData.id ? exigenciaData : e
      ));
    }
    setIsModalOpen(false);
    setSelectedExigencia(null);
  };

  const handleRemoverExigencia = (id: number) => {
    setExigenciaToDelete(id);
    setShowDeleteModal(true);
  };

  const handleStatusChange = (id: number, novoStatus: string) => {
    setExigencias(prev => prev.map(exigencia => 
      exigencia.id === id 
        ? { ...exigencia, status: novoStatus as Exigencia['status'] }
        : exigencia
    ));
  };

  const handleResponsavelChange = (id: number, novoResponsavel: string) => {
    setExigencias(prev => prev.map(exigencia => 
      exigencia.id === id 
        ? { ...exigencia, atribuidoA: novoResponsavel }
        : exigencia
    ));
  };

  const confirmDelete = () => {
    if (exigenciaToDelete) {
      console.log(`Removendo exigência ${exigenciaToDelete}`);
      // Aqui será feita a chamada ao backend para remover a exigência
      setShowDeleteModal(false);
      setExigenciaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setExigenciaToDelete(null);
  };

  const handleDownloadXLSX = () => {
    // Converter para CSV (formato simplificado)
    const csvContent = [
      ['Descrição Resumida', 'Descrição Completa', 'Processo', 'Prazo', 'Status', 'Responsável', 'Observações', 'Criado Por'],
      ...exigencias.map(e => [
        e.descricaoResumida,
        e.descricao,
        e.processo,
        e.prazo,
        e.status,
        e.atribuidoA,
        e.observacoes || '',
        e.criadoPor === 'ia' ? 'IA' : 'Usuário'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Criar blob e download
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
              {/* Filtro Processo */}
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('processo')}
                  className="flex h-8 w-full items-center justify-between gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Processo {filters.processo.length > 0 && `(${filters.processo.length})`}
                  </p>
                  <ChevronDown size={20} />
                </button>
                {openFilterDropdown === 'processo' && (
                  <div className="absolute top-10 left-0 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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

              {/* Botão Limpar Filtros - logo abaixo dos filtros */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex h-8 w-full items-center justify-center gap-x-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <X size={16} />
                  <span className="text-sm font-medium">Limpar Filtros</span>
                </button>
              )}

              {/* Botões de Ação - separados com margem */}
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
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">Exigências</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">Gerencie todas as suas exigências em um só lugar.</p>
              </div>
            </div>
            
            <div className="px-4 py-3">
              <TabelaExigencias 
                exigencias={currentExigencias}
                onEditarExigencia={handleEditarExigencia}
                onRemoverExigencia={handleRemoverExigencia}
                onStatusChange={handleStatusChange}
                onResponsavelChange={handleResponsavelChange}
                showProcessoLink={true}
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

      {/* Modal de Edição/Criação de Exigência */}
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

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-[512px] w-full mx-4">
            {/* Header do Modal */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-[#0d141c] text-xl font-bold">Remover Exigência</h2>
              <button
                onClick={cancelDelete}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ef4444" viewBox="0 0 256 256">
                    <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tem certeza que deseja remover esta exigência?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <strong>Atenção:</strong> Esta exigência será permanentemente removida do processo. 
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Sim, remover exigência
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exigencias;
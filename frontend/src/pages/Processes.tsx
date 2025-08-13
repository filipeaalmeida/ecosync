import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';

interface Process {
  id: string;
  processNumber: string;
  companyName: string;
  issueDate: string;
  expiryDate: string;
  renewalDeadline: string;
  status: 'Ativo' | 'Expirado' | 'Pendente';
}

interface FilterState {
  status: string[];
  company: string[];
  dateFrom: string;
  dateTo: string;
}

const Processes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddProcessModal, setShowAddProcessModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    company: [],
    dateFrom: '',
    dateTo: ''
  });

  const [processes] = useState<Process[]>([
    {
      id: '1',
      processNumber: 'LC-2023-001',
      companyName: 'Acme Corp',
      issueDate: '01/01/2023',
      expiryDate: '15/01/2024',
      renewalDeadline: '15/12/2023',
      status: 'Ativo',
    },
    {
      id: '2',
      processNumber: 'LC-2022-005',
      companyName: 'Beta Industries',
      issueDate: '01/01/2022',
      expiryDate: '31/12/2023',
      renewalDeadline: '30/11/2023',
      status: 'Expirado',
    },
    {
      id: '3',
      processNumber: 'LC-2023-008',
      companyName: 'Gamma Solutions',
      issueDate: '01/07/2023',
      expiryDate: '30/06/2024',
      renewalDeadline: '30/05/2024',
      status: 'Ativo',
    },
    {
      id: '4',
      processNumber: 'LC-2023-012',
      companyName: 'Delta Enterprises',
      issueDate: '15/03/2023',
      expiryDate: '15/03/2024',
      renewalDeadline: '15/02/2024',
      status: 'Ativo',
    },
    {
      id: '5',
      processNumber: 'LC-2022-015',
      companyName: 'Epsilon Trading',
      issueDate: '01/12/2022',
      expiryDate: '30/11/2023',
      renewalDeadline: '30/10/2023',
      status: 'Expirado',
    },
  ]);

  const companies = Array.from(new Set(processes.map(p => p.companyName)));
  const statusOptions = ['Ativo', 'Expirado', 'Pendente'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
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

  useEffect(() => {
    console.log('Fetching data with params:', {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      filters
    });
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  const handleEdit = (id: string) => {
    console.log('Edit process:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete process:', id);
    setOpenMenuId(null);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const toggleFilterDropdown = (filter: string) => {
    setOpenFilterDropdown(openFilterDropdown === filter ? null : filter);
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

  const handleCompanyToggle = (company: string) => {
    if (company === 'all') {
      setFilters(prev => ({ ...prev, company: [] }));
    } else {
      setFilters(prev => ({
        ...prev,
        company: prev.company.includes(company)
          ? prev.company.filter(c => c !== company)
          : [...prev.company, company]
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      company: [],
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        alert('Por favor, envie apenas arquivos PDF');
      }
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        handleFileUpload(file);
      } else {
        alert('Por favor, envie apenas arquivos PDF');
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const closeModal = () => {
    setShowAddProcessModal(false);
    setUploadedFile(null);
    setIsProcessing(false);
    setDragActive(false);
  };

  const getDateFilterCount = () => {
    let count = 0;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Expirado':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              Data vencida
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
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Sidebar de Filtros */}
          <div className="layout-content-container flex flex-col w-80">
            <h2 className="text-gray-900 text-[22px] font-bold leading-tight tracking-tight px-4 pb-3 pt-5">Filtros</h2>
            <div className="px-4 py-3">
              <div className="flex items-stretch rounded-lg bg-gray-100 h-12">
                <div className="flex items-center justify-center pl-4 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Buscar processos"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent px-2 text-base font-normal leading-normal outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4" ref={filterRef}>
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('status')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Status {filters.status.length > 0 && `(${filters.status.length})`}
                  </p>
                  <div className="text-[#0d141c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
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
              
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('date')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Data de Validade {getDateFilterCount() > 0 && `(${getDateFilterCount()})`}
                  </p>
                  <div className="text-[#0d141c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </button>
                {openFilterDropdown === 'date' && (
                  <div className="absolute top-10 left-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 p-3">
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">De:</label>
                        <input
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Até:</label>
                        <input
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
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
              
              <div className="relative">
                <button 
                  onClick={() => toggleFilterDropdown('company')}
                  className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7edf4] pl-4 pr-2"
                >
                  <p className="text-[#0d141c] text-sm font-medium leading-normal">
                    Empresa {filters.company.length > 0 && `(${filters.company.length})`}
                  </p>
                  <div className="text-[#0d141c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                    </svg>
                  </div>
                </button>
                {openFilterDropdown === 'company' && (
                  <div className="absolute top-10 left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.company.length === 0}
                          onChange={() => handleCompanyToggle('all')}
                          className="mr-2"
                        />
                        Todas
                      </label>
                      <div className="border-t border-gray-200"></div>
                      {companies.map(company => (
                        <label key={company} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.company.includes(company)}
                            onChange={() => handleCompanyToggle(company)}
                            className="mr-2"
                          />
                          {company}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {(filters.status.length > 0 || filters.company.length > 0 || filters.dateFrom || filters.dateTo || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex h-8 items-center justify-center gap-x-2 rounded-lg bg-red-50 text-red-600 px-3 hover:bg-red-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                  </svg>
                  <span className="text-sm font-medium">Limpar Filtros</span>
                </button>
              )}
            </div>
          </div>

          {/* Área de Conteúdo Principal */}
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Processos</p>
              </div>
              <button 
                onClick={() => setShowAddProcessModal(true)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal">
                <span className="truncate">Adicionar Processo</span>
              </button>
            </div>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#cedbe8] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Número do Processo
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Razão Social
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Data Emissão
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Data Validade
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Prazo Renovação
                      </th>
                      <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-[#0d141c] text-sm font-medium leading-normal">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, index) => {
                      const isLastRows = index >= processes.length - 2;
                      return (
                        <tr key={process.id} className="border-t border-t-[#cedbe8]">
                          <td className="h-[72px] px-4 py-2 text-[#0d141c] text-sm font-normal leading-normal">
                            {process.processNumber}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                            {process.companyName}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            {process.issueDate}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            <DateIndicator date={process.expiryDate} />
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            <DateIndicator date={process.renewalDeadline} />
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(process.status)}`}>
                              {process.status}
                            </span>
                          </td>
                          <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal relative">
                            <div className="flex justify-center gap-2" ref={openMenuId === process.id ? menuRef : null}>
                              <button
                                onClick={() => handleEdit(process.id)}
                                className="text-[#49739c] text-sm font-bold leading-normal tracking-[0.015em] hover:text-[#0d141c] cursor-pointer"
                              >
                                Editar
                              </button>
                              <div className="relative">
                                <button
                                  onClick={() => toggleMenu(process.id)}
                                  className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M128,80a12,12,0,1,1-12-12A12,12,0,0,1,128,80Zm-12,52a12,12,0,1,0,12,12A12,12,0,0,0,116,132Zm0,56a12,12,0,1,0,12,12A12,12,0,0,0,116,188Z"></path>
                                  </svg>
                                </button>
                                {openMenuId === process.id && (
                                  <div className={`absolute right-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${
                                    isLastRows ? 'bottom-8' : 'top-8'
                                  }`}>
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleDelete(process.id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        Remover este processo
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Mostrar</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">itens por página</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Primeira
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = currentPage - 2 + idx;
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-500 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Última
                </button>
              </div>
              
              <div className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Processo */}
      {showAddProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-[512px] w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-[#0d141c] text-xl font-bold">Adicionar Novo Processo</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                </svg>
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6">
              <div 
                className={`flex flex-col items-center gap-6 rounded-lg border-2 border-dashed px-6 py-14 transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : uploadedFile 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-[#cedbe8] bg-white'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                
                {!uploadedFile ? (
                  <>
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#49739c" viewBox="0 0 256 256">
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z"></path>
                      </svg>
                      <p className="text-[#0d141c] text-lg font-bold leading-tight text-center">
                        Enviar Documento do Processo
                      </p>
                      <p className="text-[#49739c] text-sm font-normal leading-normal text-center max-w-[400px]">
                        Arraste e solte um arquivo PDF aqui, ou clique para navegar. Nossa IA irá analisar e extrair as informações necessárias.
                      </p>
                    </div>
                    <button
                      onClick={openFileDialog}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Enviar PDF</span>
                    </button>
                  </>
                ) : (
                  <>
                    {isProcessing ? (
                      <>
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                          <p className="text-[#49739c] text-sm font-normal leading-normal text-center">
                            Processando documento com IA...
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#22c55e" viewBox="0 0 256 256">
                            <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-26.34-82.34-48,48a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69l42.34-42.35a8,8,0,0,1,11.32,11.32Z"></path>
                          </svg>
                          <p className="text-[#0d141c] text-lg font-bold leading-tight text-center">
                            Documento enviado com sucesso!
                          </p>
                          <p className="text-[#49739c] text-sm font-normal leading-normal text-center">
                            {uploadedFile.name}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setUploadedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 hover:bg-gray-300 text-[#0d141c] text-sm font-bold leading-normal"
                          >
                            Trocar arquivo
                          </button>
                          <button
                            onClick={() => {
                              console.log('Salvando processo...');
                              closeModal();
                            }}
                            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-green-500 hover:bg-green-600 text-white text-sm font-bold leading-normal"
                          >
                            Salvar Processo
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              
              {!uploadedFile && (
                <p className="text-[#49739c] text-xs font-normal leading-normal pt-3 text-center">
                  Ao enviar, você concorda com nossos termos e condições.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Processes;
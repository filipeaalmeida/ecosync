import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

interface Exigencia {
  id: string;
  descricao: string;
  prazo: string;
  tipo: string;
  responsavel: string;
  status: string;
  anexos: number;
}

interface ExigenciasTableProps {
  processName?: string;
}

const ExigenciasTable: React.FC<ExigenciasTableProps> = ({ processName }) => {
  const [exigencias, setExigencias] = useState<Exigencia[]>([]);
  const [filteredExigencias, setFilteredExigencias] = useState<Exigencia[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedTipo, setSelectedTipo] = useState('todos');

  // Dados mockados de exigências
  useEffect(() => {
    const mockExigencias: Exigencia[] = [
      {
        id: '1',
        descricao: 'Apresentar relatório de monitoramento ambiental',
        prazo: '2024-01-15',
        tipo: 'Documental',
        responsavel: 'Ana Silva',
        status: 'Pendente',
        anexos: 0
      },
      {
        id: '2',
        descricao: 'Realizar análise de qualidade do ar',
        prazo: '2024-02-20',
        tipo: 'Técnica',
        responsavel: 'Carlos Santos',
        status: 'Em andamento',
        anexos: 2
      },
      {
        id: '3',
        descricao: 'Atualizar licença de operação',
        prazo: '2023-12-30',
        tipo: 'Legal',
        responsavel: 'Maria Oliveira',
        status: 'Concluída',
        anexos: 5
      },
      {
        id: '4',
        descricao: 'Implementar sistema de gestão ambiental',
        prazo: '2024-03-10',
        tipo: 'Técnica',
        responsavel: 'João Pedro',
        status: 'Pendente',
        anexos: 1
      },
      {
        id: '5',
        descricao: 'Renovar certificado ISO 14001',
        prazo: '2024-04-05',
        tipo: 'Documental',
        responsavel: 'Ana Silva',
        status: 'Em andamento',
        anexos: 3
      },
      {
        id: '6',
        descricao: 'Apresentar plano de emergência ambiental',
        prazo: '2024-01-25',
        tipo: 'Legal',
        responsavel: 'Carlos Santos',
        status: 'Pendente',
        anexos: 0
      },
      {
        id: '7',
        descricao: 'Realizar auditoria interna',
        prazo: '2024-02-15',
        tipo: 'Técnica',
        responsavel: 'Maria Oliveira',
        status: 'Pendente',
        anexos: 0
      },
      {
        id: '8',
        descricao: 'Atualizar cadastro técnico federal',
        prazo: '2023-12-20',
        tipo: 'Documental',
        responsavel: 'João Pedro',
        status: 'Concluída',
        anexos: 4
      },
      {
        id: '9',
        descricao: 'Monitorar emissões atmosféricas',
        prazo: '2024-01-30',
        tipo: 'Técnica',
        responsavel: 'Ana Silva',
        status: 'Em andamento',
        anexos: 2
      },
      {
        id: '10',
        descricao: 'Elaborar relatório de sustentabilidade',
        prazo: '2024-03-01',
        tipo: 'Documental',
        responsavel: 'Carlos Santos',
        status: 'Pendente',
        anexos: 0
      },
      {
        id: '11',
        descricao: 'Treinar equipe em procedimentos ambientais',
        prazo: '2024-02-10',
        tipo: 'Técnica',
        responsavel: 'Maria Oliveira',
        status: 'Em andamento',
        anexos: 1
      },
      {
        id: '12',
        descricao: 'Renovar alvará de funcionamento',
        prazo: '2024-01-20',
        tipo: 'Legal',
        responsavel: 'João Pedro',
        status: 'Pendente',
        anexos: 0
      }
    ];
    setExigencias(mockExigencias);
    setFilteredExigencias(mockExigencias);
    setTotalPages(Math.ceil(mockExigencias.length / itemsPerPage));
  }, [itemsPerPage]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...exigencias];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }

    // Filtro por tipo
    if (selectedTipo !== 'todos') {
      filtered = filtered.filter(e => e.tipo === selectedTipo);
    }

    setFilteredExigencias(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedTipo, exigencias, itemsPerPage]);

  // Paginação
  const paginatedExigencias = filteredExigencias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exigências da Licença</h1>
        {processName && <p className="text-gray-600 mt-2">Processo: {processName}</p>}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por descrição ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="Documental">Documental</option>
              <option value="Técnica">Técnica</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Exigências */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anexos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedExigencias.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma exigência encontrada
                  </td>
                </tr>
              ) : (
                paginatedExigencias.map((exigencia) => (
                  <tr key={exigencia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {exigencia.descricao}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(exigencia.prazo).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exigencia.tipo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exigencia.responsavel}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exigencia.status)}`}>
                        {exigencia.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {exigencia.anexos}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Visualizar
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredExigencias.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setTotalPages(Math.ceil(filteredExigencias.length / newItemsPerPage));
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ExigenciasTable;
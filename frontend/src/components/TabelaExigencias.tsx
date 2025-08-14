import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateIndicator from './DateIndicator';
import SearchableDropdown, { DropdownOption } from './SearchableDropdown';

export interface Exigencia {
  id: number;
  descricao: string;
  processo: string;
  prazo: string;
  status: 'Em Progresso' | 'Concluído' | 'Não Iniciado' | 'Pendente';
  atribuidoA: string;
}

interface TabelaExigenciasProps {
  exigencias: Exigencia[];
  onEditarExigencia?: (id: number) => void;
  onRemoverExigencia?: (id: number) => void;
  onStatusChange?: (id: number, novoStatus: string) => void;
  onResponsavelChange?: (id: number, novoResponsavel: string) => void;
  showProcessoLink?: boolean;
}

const TabelaExigencias: React.FC<TabelaExigenciasProps> = ({ 
  exigencias, 
  onEditarExigencia,
  onRemoverExigencia,
  onStatusChange,
  onResponsavelChange,
  showProcessoLink = true
}) => {
  const navigate = useNavigate();
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editingAtribuidoId, setEditingAtribuidoId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Opções para os dropdowns - mesmas do modal
  const statusOptions: DropdownOption[] = [
    { value: 'Não Iniciado', label: 'Não Iniciado', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'Em Progresso', label: 'Em Progresso', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'Concluído', label: 'Concluído', color: 'bg-green-100 text-green-800 border-green-200' }
  ];
  
  // Lista de usuários - em produção virá do backend
  const usuariosOptions: DropdownOption[] = [
    { value: 'Maria Silva', label: 'Maria Silva' },
    { value: 'João Santos', label: 'João Santos' },
    { value: 'Ana Costa', label: 'Ana Costa' },
    { value: 'Pedro Oliveira', label: 'Pedro Oliveira' },
    { value: 'Carla Mendes', label: 'Carla Mendes' },
    { value: 'Roberto Lima', label: 'Roberto Lima' },
    { value: 'Fernanda Souza', label: 'Fernanda Souza' },
    { value: 'Lucas Pereira', label: 'Lucas Pereira' },
    { value: 'Juliana Alves', label: 'Juliana Alves' },
    { value: 'Marcos Rodrigues', label: 'Marcos Rodrigues' }
  ];

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

  const handleAcao = (acao: string, id: number) => {
    if (acao === 'editar' && onEditarExigencia) {
      onEditarExigencia(id);
    } else if (acao === 'remover' && onRemoverExigencia) {
      onRemoverExigencia(id);
      setOpenMenuId(null);
    } else {
      console.log(`Ação: ${acao} para exigência ${id}`);
    }
  };

  // Funções para edição inline
  const handleStatusClick = (id: number) => {
    setEditingStatusId(id);
    setEditingAtribuidoId(null); // Fechar edição de responsável se estiver aberta
    setOpenMenuId(null);
  };

  const handleResponsavelClick = (id: number) => {
    setEditingAtribuidoId(id);
    setEditingStatusId(null); // Fechar edição de status se estiver aberta
    setOpenMenuId(null);
  };

  const handleStatusChange = (id: number, novoStatus: DropdownOption | null) => {
    if (novoStatus && novoStatus.value) {
      console.log(`Alterando status da exigência ${id} para: ${novoStatus.value}`);
      if (onStatusChange) {
        onStatusChange(id, novoStatus.value);
      }
    }
    setEditingStatusId(null);
  };

  const handleResponsavelChange = (id: number, novoResponsavel: DropdownOption | null) => {
    if (novoResponsavel) {
      console.log(`Alterando responsável da exigência ${id} para: ${novoResponsavel.value}`);
      if (onResponsavelChange) {
        onResponsavelChange(id, novoResponsavel.value);
      }
    }
    setEditingAtribuidoId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      
      // Fechar dropdowns de edição se clicar fora
      const target = event.target as Element;
      if (!target.closest('[data-editing-cell]')) {
        setEditingStatusId(null);
        setEditingAtribuidoId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[300px]">Descrição</th>
              <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[150px]">Processo</th>
              <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[120px]">Prazo</th>
              <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[130px]">Status</th>
              <th className="px-4 py-3 text-left text-[#0d141c] text-sm font-medium leading-normal min-w-[150px]">Responsável</th>
              <th className="px-4 py-3 text-center text-[#0d141c] text-sm font-medium leading-normal w-[60px]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {exigencias.map((exigencia) => (
              <tr key={exigencia.id} className="border-t border-t-[#cedbe8]">
                <td className="h-[72px] px-4 py-2 text-[#0d141c] text-sm font-normal leading-normal">
                  <div className="max-w-[400px]">
                    {exigencia.descricao}
                  </div>
                </td>
                <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                  <div className="flex items-center gap-2">
                    {exigencia.processo}
                    {showProcessoLink && (
                      <button
                        onClick={() => navigate(`/processos/editar/${exigencia.id}`)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar processo"
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                  <DateIndicator date={exigencia.prazo} />
                </td>
                <td className="h-[72px] px-4 py-2 whitespace-nowrap">
                  {editingStatusId === exigencia.id ? (
                    <div style={{ width: '150px' }} data-editing-cell>
                      <SearchableDropdown
                        options={statusOptions}
                        value={statusOptions.find(opt => opt.value === exigencia.status) || null}
                        onChange={(option) => handleStatusChange(exigencia.id, option)}
                        placeholder="Status..."
                        allowEmpty={false}
                        className="text-xs"
                        autoFocus={true}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStatusClick(exigencia.id)}
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap ${getStatusColor(exigencia.status)}`}
                      title="Clique para editar status"
                    >
                      {exigencia.status}
                    </button>
                  )}
                </td>
                <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                  {editingAtribuidoId === exigencia.id ? (
                    <div style={{ width: '180px' }} data-editing-cell>
                      <SearchableDropdown
                        options={usuariosOptions}
                        value={usuariosOptions.find(opt => opt.value === exigencia.atribuidoA) || null}
                        onChange={(option) => handleResponsavelChange(exigencia.id, option)}
                        placeholder="Buscar responsável..."
                        allowEmpty={true}
                        emptyText="Nenhum responsável"
                        className="text-sm"
                        autoFocus={true}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleResponsavelClick(exigencia.id)}
                      className="text-[#49739c] text-sm font-normal leading-normal hover:text-[#0d141c] hover:bg-gray-100 px-2 py-1 rounded transition-colors cursor-pointer"
                      title="Clique para editar responsável"
                    >
                      {exigencia.atribuidoA || 'Sem responsável'}
                    </button>
                  )}
                </td>
                <td className="h-[72px] px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleAcao('editar', exigencia.id)}
                      className="text-[#49739c] text-sm font-bold leading-normal tracking-[0.015em] hover:text-[#0d141c] cursor-pointer"
                    >
                      Editar
                    </button>
                    <div className="relative" ref={openMenuId === exigencia.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === exigencia.id ? null : exigencia.id)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === exigencia.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                          <button
                            onClick={() => handleAcao('remover', exigencia.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default TabelaExigencias;
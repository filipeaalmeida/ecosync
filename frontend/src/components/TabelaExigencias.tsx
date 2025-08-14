import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateIndicator from './DateIndicator';

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
  showProcessoLink?: boolean;
}

const TabelaExigencias: React.FC<TabelaExigenciasProps> = ({ 
  exigencias, 
  onEditarExigencia,
  onRemoverExigencia,
  showProcessoLink = true
}) => {
  const navigate = useNavigate();
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editingAtribuidoId, setEditingAtribuidoId] = useState<number | null>(null);
  const [searchAtribuidoEdit, setSearchAtribuidoEdit] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const pessoas = Array.from(new Set(exigencias.map(e => e.atribuidoA)));

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
    } else if (acao === 'editar-status') {
      setEditingStatusId(id);
      setOpenMenuId(null);
    } else if (acao === 'editar-atribuido') {
      const exigencia = exigencias.find(e => e.id === id);
      if (exigencia) {
        setSearchAtribuidoEdit(exigencia.atribuidoA);
      }
      setEditingAtribuidoId(id);
      setOpenMenuId(null);
    } else if (acao === 'remover' && onRemoverExigencia) {
      onRemoverExigencia(id);
      setOpenMenuId(null);
    } else {
      console.log(`Ação: ${acao} para exigência ${id}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
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
                <td className="h-[72px] px-4 py-2">
                  {editingStatusId === exigencia.id ? (
                    <select
                      className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={exigencia.status}
                      onChange={(e) => {
                        console.log('Novo status:', e.target.value);
                        setEditingStatusId(null);
                      }}
                      onBlur={() => setEditingStatusId(null)}
                      autoFocus
                    >
                      <option value="Em Progresso">Em Progresso</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Não Iniciado">Não Iniciado</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exigencia.status)}`}>
                      {exigencia.status}
                    </span>
                  )}
                </td>
                <td className="h-[72px] px-4 py-2 text-[#49739c] text-sm font-normal leading-normal">
                  {editingAtribuidoId === exigencia.id ? (
                    <div className="relative">
                      <input
                        type="text"
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={searchAtribuidoEdit}
                        onChange={(e) => setSearchAtribuidoEdit(e.target.value)}
                        onBlur={() => {
                          setEditingAtribuidoId(null);
                          setSearchAtribuidoEdit('');
                        }}
                        placeholder="Buscar pessoa..."
                        autoFocus
                      />
                      {searchAtribuidoEdit && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                          {pessoas
                            .filter(p => p.toLowerCase().includes(searchAtribuidoEdit.toLowerCase()))
                            .map(pessoa => (
                              <button
                                key={pessoa}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  console.log('Atribuir para:', pessoa);
                                  setEditingAtribuidoId(null);
                                  setSearchAtribuidoEdit('');
                                }}
                              >
                                {pessoa}
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  ) : (
                    <span>{exigencia.atribuidoA}</span>
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
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                          <button
                            onClick={() => handleAcao('editar-status', exigencia.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Editar Status
                          </button>
                          <button
                            onClick={() => handleAcao('editar-atribuido', exigencia.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Editar Responsável
                          </button>
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
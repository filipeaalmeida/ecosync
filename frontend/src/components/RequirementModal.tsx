import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Exigencia } from './TabelaExigencias';

interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exigencia: Exigencia) => void;
  exigencia?: Exigencia | null;
  mode: 'create' | 'edit';
}

const RequirementModal: React.FC<RequirementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  exigencia,
  mode
}) => {
  const [formData, setFormData] = useState<Omit<Exigencia, 'id'> & { id?: number }>({
    descricao: '',
    processo: '',
    prazo: '',
    status: 'Não Iniciado',
    atribuidoA: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Exigencia, string>>>({});
  const [showResponsavelDropdown, setShowResponsavelDropdown] = useState(false);
  const [responsavelSearch, setResponsavelSearch] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [statusSearch, setStatusSearch] = useState('');
  
  // Lista de usuários mockada - em produção virá do backend
  const usuarios = [
    'Maria Silva',
    'João Santos',
    'Ana Costa',
    'Pedro Oliveira',
    'Carla Mendes',
    'Roberto Lima',
    'Fernanda Souza',
    'Lucas Pereira',
    'Juliana Alves',
    'Marcos Rodrigues'
  ];
  
  const statusOptions = [
    'Não Iniciado',
    'Em Progresso',
    'Pendente',
    'Concluído'
  ];
  
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.toLowerCase().includes(responsavelSearch.toLowerCase())
  );
  
  const filteredStatus = statusOptions.filter(status =>
    status.toLowerCase().includes(statusSearch.toLowerCase())
  );

  useEffect(() => {
    if (exigencia && mode === 'edit') {
      setFormData({
        ...exigencia,
        prazo: convertDateFormat(exigencia.prazo, 'toInput')
      });
      setResponsavelSearch(exigencia.atribuidoA || '');
    } else {
      setFormData({
        descricao: '',
        processo: 'LO_CIRANDA_02', // Processo fixo do contexto atual
        prazo: '',
        status: 'Não Iniciado',
        atribuidoA: ''
      });
      setResponsavelSearch('');
    }
    setErrors({});
    setShowResponsavelDropdown(false);
  }, [exigencia, mode, isOpen]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.responsavel-dropdown-container')) {
        setShowResponsavelDropdown(false);
      }
    };

    if (showResponsavelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showResponsavelDropdown]);

  const convertDateFormat = (date: string, direction: 'toInput' | 'toDisplay'): string => {
    if (!date) return '';
    
    if (direction === 'toInput') {
      const parts = date.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return date;
    } else {
      const parts = date.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return date;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Exigencia, string>> = {};
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!formData.prazo) {
      newErrors.prazo = 'Prazo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSave: Exigencia = {
        id: formData.id || 0,
        descricao: formData.descricao,
        processo: formData.processo,
        prazo: convertDateFormat(formData.prazo, 'toDisplay'),
        status: formData.status,
        atribuidoA: formData.atribuidoA
      };
      onSave(dataToSave);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof Exigencia]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Adicionar Nova Exigência' : 'Editar Exigência'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição da Exigência *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.descricao ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descreva detalhadamente a exigência..."
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Processo
                </label>
                <input
                  type="text"
                  name="processo"
                  value={formData.processo}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo *
                </label>
                <input
                  type="date"
                  name="prazo"
                  value={formData.prazo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.prazo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.prazo && (
                  <p className="mt-1 text-sm text-red-600">{errors.prazo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Não Iniciado">Não Iniciado</option>
                  <option value="Em Progresso">Em Progresso</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Concluído">Concluído</option>
                </select>
              </div>

              <div className="relative responsavel-dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={responsavelSearch}
                    onChange={(e) => {
                      setResponsavelSearch(e.target.value);
                      setFormData(prev => ({ ...prev, atribuidoA: e.target.value }));
                      setShowResponsavelDropdown(true);
                    }}
                    onFocus={() => setShowResponsavelDropdown(true)}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Buscar responsável..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowResponsavelDropdown(!showResponsavelDropdown)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
                
                {showResponsavelDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setResponsavelSearch('');
                        setFormData(prev => ({ ...prev, atribuidoA: '' }));
                        setShowResponsavelDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                    >
                      Nenhum responsável
                    </button>
                    {filteredUsuarios.map((usuario) => (
                      <button
                        key={usuario}
                        type="button"
                        onClick={() => {
                          setResponsavelSearch(usuario);
                          setFormData(prev => ({ ...prev, atribuidoA: usuario }));
                          setShowResponsavelDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {usuario}
                      </button>
                    ))}
                    {filteredUsuarios.length === 0 && responsavelSearch && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Nenhum usuário encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mode === 'create' ? 'Adicionar Exigência' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequirementModal;
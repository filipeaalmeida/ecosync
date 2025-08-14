import React, { useState, useEffect } from 'react';
import { X, Bot, User } from 'lucide-react';
import { Exigencia } from './TabelaExigencias';
import SearchableDropdown, { DropdownOption } from './SearchableDropdown';

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
    descricaoResumida: '',
    descricao: '',
    processo: '',
    prazo: '',
    status: 'Não Iniciado',
    atribuidoA: '',
    observacoes: '',
    criadoPor: 'usuario'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Exigencia, string>>>({});
  
  // Opções para os dropdowns
  const statusOptions: DropdownOption[] = [
    { value: 'Não Iniciado', label: 'Não Iniciado', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'Em Progresso', label: 'Em Progresso', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Pendente', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'Concluído', label: 'Concluído', color: 'bg-green-100 text-green-800 border-green-200' }
  ];
  
  // Lista de usuários mockada - em produção virá do backend
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
  
  // Estados para os valores selecionados nos dropdowns
  const [selectedStatus, setSelectedStatus] = useState<DropdownOption | null>(null);
  const [selectedResponsavel, setSelectedResponsavel] = useState<DropdownOption | null>(null);

  useEffect(() => {
    if (exigencia && mode === 'edit') {
      setFormData({
        ...exigencia,
        prazo: convertDateFormat(exigencia.prazo, 'toInput')
      });
      // Configurar status selecionado
      const status = statusOptions.find(s => s.value === exigencia.status);
      setSelectedStatus(status || statusOptions[0]);
      // Configurar responsável selecionado
      const responsavel = usuariosOptions.find(u => u.value === exigencia.atribuidoA);
      setSelectedResponsavel(responsavel || null);
    } else {
      setFormData({
        descricaoResumida: '',
        descricao: '',
        processo: 'LO_CIRANDA_02', // Processo fixo do contexto atual
        prazo: '',
        status: 'Não Iniciado',
        atribuidoA: '',
        observacoes: '',
        criadoPor: 'usuario'
      });
      setSelectedStatus(statusOptions[0]); // Não Iniciado como padrão
      setSelectedResponsavel(null);
    }
    setErrors({});
  }, [exigencia, mode, isOpen]);


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
    
    if (!formData.descricaoResumida.trim()) {
      newErrors.descricaoResumida = 'Descrição resumida é obrigatória';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }
    
    if (!formData.prazo) {
      newErrors.prazo = 'Prazo é obrigatório';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSave: Exigencia = {
        id: formData.id || 0,
        descricaoResumida: formData.descricaoResumida,
        descricao: formData.descricao,
        processo: formData.processo,
        prazo: convertDateFormat(formData.prazo, 'toDisplay'),
        status: formData.status,
        atribuidoA: formData.atribuidoA,
        observacoes: formData.observacoes,
        criadoPor: formData.criadoPor
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
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Adicionar Nova Exigência' : 'Editar Exigência'}
              </h2>
              {mode === 'edit' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">
                  {formData.criadoPor === 'ia' ? (
                    <>
                      <Bot size={16} className="text-purple-600" />
                      <span className="text-xs text-gray-600">Gerada por IA</span>
                    </>
                  ) : (
                    <>
                      <User size={16} className="text-blue-600" />
                      <span className="text-xs text-gray-600">Criada pelo usuário</span>
                    </>
                  )}
                </div>
              )}
            </div>
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
                Descrição Resumida *
              </label>
              <input
                type="text"
                name="descricaoResumida"
                value={formData.descricaoResumida}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.descricaoResumida ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Resumo breve da exigência..."
                maxLength={100}
              />
              {errors.descricaoResumida && (
                <p className="mt-1 text-sm text-red-600">{errors.descricaoResumida}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição Completa *
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
              <SearchableDropdown
                label="Status"
                required={true}
                options={statusOptions}
                value={selectedStatus}
                onChange={(option) => {
                  setSelectedStatus(option);
                  setFormData(prev => ({ 
                    ...prev, 
                    status: (option?.value || 'Não Iniciado') as Exigencia['status'] 
                  }));
                  if (errors.status && option) {
                    setErrors(prev => ({ ...prev, status: '' }));
                  }
                }}
                error={errors.status}
                placeholder="Selecione o status..."
                allowEmpty={false}
              />

              <SearchableDropdown
                label="Responsável"
                options={usuariosOptions}
                value={selectedResponsavel}
                onChange={(option) => {
                  setSelectedResponsavel(option);
                  setFormData(prev => ({ 
                    ...prev, 
                    atribuidoA: option?.value || '' 
                  }));
                }}
                placeholder="Buscar responsável..."
                allowEmpty={true}
                emptyText="Nenhum responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais (opcional)..."
              />
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
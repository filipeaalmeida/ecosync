import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

const EditProcess: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    processo: '',
    status: 'Em Análise',
    razaoSocial: '',
    municipio: '',
    caracterizacao: '',
    dataEmissao: '',
    dataValidade: '',
    prazoSolicitacaoRenovacao: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando processo:', formData);
    navigate('/processos');
  };

  const handleCancel = () => {
    navigate('/processos');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#f8fafb] group/design-root overflow-x-hidden">
      <Header />
      
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Page Title */}
            <div className="flex items-center justify-between pb-5">
              <h1 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em]">
                Editar Processo
              </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Fields Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-[#0d141c] text-lg font-semibold mb-5">Informações do Processo</h2>
                
                <div className="grid grid-cols-2 gap-5">
                  {/* Processo */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Processo</p>
                      <input
                        type="text"
                        name="processo"
                        value={formData.processo}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] placeholder:text-[#49739c] h-full px-[15px] text-sm font-normal leading-normal"
                        placeholder="Número do processo"
                      />
                    </label>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Status</p>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] h-full px-[15px] text-sm font-normal leading-normal"
                      >
                        <option value="Em Análise">Em Análise</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Rejeitado">Rejeitado</option>
                        <option value="Pendente">Pendente</option>
                      </select>
                    </label>
                  </div>

                  {/* Razão Social */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Razão Social</p>
                      <input
                        type="text"
                        name="razaoSocial"
                        value={formData.razaoSocial}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] placeholder:text-[#49739c] h-full px-[15px] text-sm font-normal leading-normal"
                        placeholder="Nome da empresa"
                      />
                    </label>
                  </div>

                  {/* Município */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Município</p>
                      <input
                        type="text"
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] placeholder:text-[#49739c] h-full px-[15px] text-sm font-normal leading-normal"
                        placeholder="Cidade"
                      />
                    </label>
                  </div>
                </div>

                {/* Caracterização do Empreendimento */}
                <div className="mt-5">
                  <label className="flex flex-col w-full">
                    <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Caracterização do Empreendimento</p>
                    <textarea
                      name="caracterizacao"
                      value={formData.caracterizacao}
                      onChange={handleInputChange}
                      className="form-textarea flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] placeholder:text-[#49739c] p-[15px] text-sm font-normal leading-normal min-h-[100px]"
                      placeholder="Descrição do empreendimento"
                    />
                  </label>
                </div>
              </div>

              {/* Dates Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-[#0d141c] text-lg font-semibold mb-5">Datas e Prazos</h2>
                
                <div className="grid grid-cols-3 gap-5">
                  {/* Data Emissão */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Data Emissão</p>
                      <input
                        type="date"
                        name="dataEmissao"
                        value={formData.dataEmissao}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] h-full px-[15px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </div>

                  {/* Data Validade */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Data Validade</p>
                      <input
                        type="date"
                        name="dataValidade"
                        value={formData.dataValidade}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] h-full px-[15px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </div>

                  {/* Prazo Solicitação Renovação */}
                  <div>
                    <label className="flex flex-col min-w-40 h-12 w-full">
                      <p className="text-[#49739c] text-sm font-normal leading-normal pb-2">Prazo Solicitação Renovação</p>
                      <input
                        type="date"
                        name="prazoSolicitacaoRenovacao"
                        value={formData.prazoSolicitacaoRenovacao}
                        onChange={handleInputChange}
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d141c] focus:outline-0 focus:ring-0 border border-[#cedbe8] bg-white focus:border-[#cedbe8] h-full px-[15px] text-sm font-normal leading-normal"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#cedbe8] transition-colors"
                >
                  <span className="truncate">Cancelar</span>
                </button>
                <button
                  type="submit"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#3b82f6] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#2563eb] transition-colors"
                >
                  <span className="truncate">Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProcess;
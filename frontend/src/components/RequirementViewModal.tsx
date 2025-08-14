import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import DateIndicator from './DateIndicator';

interface Exigencia {
  id: number;
  descricao: string;
  processo: string;
  prazo: string;
  status: 'Em Progresso' | 'Concluído' | 'Não Iniciado' | 'Pendente';
  atribuidoA: string;
}

interface RequirementViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exigenciaId: number;
}

const RequirementViewModal: React.FC<RequirementViewModalProps> = ({
  isOpen,
  onClose,
  exigenciaId
}) => {
  const [exigencia, setExigencia] = useState<Exigencia | null>(null);

  useEffect(() => {
    // Dados mocados - em produção virá do backend
    const exigenciasMockadas: Exigencia[] = [
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
      },
      {
        id: 7,
        descricao: 'Apresentar documentação fiscal completa do último exercício.',
        processo: 'Renovação',
        prazo: '15/08/2024',
        status: 'Em Progresso',
        atribuidoA: 'Fernanda Souza'
      }
    ];

    const found = exigenciasMockadas.find(e => e.id === exigenciaId);
    setExigencia(found || null);
  }, [exigenciaId]);

  if (!isOpen || !exigencia) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Progresso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Não Iniciado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Detalhes da Exigência
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(exigencia.status)}`}>
                  {exigencia.status}
                </span>
              </div>

              {/* Descrição */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText size={18} />
                  Descrição da Exigência
                </label>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                  {exigencia.descricao}
                </div>
              </div>

              {/* Processo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle size={18} />
                  Processo
                </label>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                  {exigencia.processo}
                </div>
              </div>

              {/* Prazo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={18} />
                  Prazo
                </label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <DateIndicator date={exigencia.prazo} />
                </div>
              </div>

              {/* Responsável */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={18} />
                  Responsável
                </label>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                  {exigencia.atribuidoA || 'Nenhum responsável atribuído'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementViewModal;
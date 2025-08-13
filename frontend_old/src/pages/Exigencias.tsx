import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Exigencia {
  id: number;
  descricao: string;
  processo: string;
  prazo: string;
  status: 'Em Progresso' | 'Concluído' | 'Não Iniciado' | 'Pendente';
  atribuidoA: string;
}

const Exigencias: React.FC = () => {
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
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

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-gray-900">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-tight">Compliance Hub</h2>
            </div>
            <div className="flex items-center gap-9">
              <Link to="/dashboard" className="text-gray-900 text-sm font-medium leading-normal">Dashboard</Link>
              <Link to="/processos" className="text-gray-900 text-sm font-medium leading-normal">Processos</Link>
              <Link to="/exigencias" className="text-gray-900 text-sm font-medium leading-normal">Exigências</Link>
              <Link to="/relatorios" className="text-gray-900 text-sm font-medium leading-normal">Relatórios</Link>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-stretch rounded-lg bg-gray-100 min-w-40 max-w-64">
              <div className="flex items-center justify-center pl-4 text-gray-500">
                <Search size={20} />
              </div>
              <input
                placeholder="Buscar"
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent px-2 py-2 text-base font-normal leading-normal outline-none"
              />
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{backgroundImage: 'url("https://via.placeholder.com/40")'}}
            />
          </div>
        </header>

        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
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
                />
              </div>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 pl-4 pr-2">
                <p className="text-gray-900 text-sm font-medium leading-normal">Status</p>
                <ChevronDown size={20} />
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 pl-4 pr-2">
                <p className="text-gray-900 text-sm font-medium leading-normal">Prazo</p>
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="flex px-4 py-3">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-blue-600 text-white text-sm font-bold leading-normal tracking-wide">
                <span className="truncate">Nova Exigência</span>
              </button>
            </div>
          </div>

          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">Exigências</p>
                <p className="text-gray-600 text-sm font-normal leading-normal">Gerencie todas as suas exigências de compliance em um só lugar.</p>
              </div>
            </div>
            
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="overflow-x-auto w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal min-w-[300px]">Descrição</th>
                        <th className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal min-w-[150px]">Processo</th>
                        <th className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal min-w-[120px]">Prazo</th>
                        <th className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal min-w-[130px]">Status</th>
                        <th className="px-4 py-3 text-left text-gray-900 text-sm font-medium leading-normal min-w-[150px]">Atribuído a</th>
                        <th className="px-4 py-3 text-center text-gray-900 text-sm font-medium leading-normal w-[60px]">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exigencias.map((exigencia) => (
                        <tr key={exigencia.id} className="border-t border-gray-200">
                          <td className="px-4 py-3 text-gray-900 text-sm font-normal leading-normal">
                            <div className="max-w-[400px]">
                              {exigencia.descricao}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-900 text-sm font-normal leading-normal">
                            {exigencia.processo}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-sm font-normal leading-normal">
                            {exigencia.prazo}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exigencia.status)}`}>
                              {exigencia.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-sm font-normal leading-normal">
                            {exigencia.atribuidoA}
                          </td>
                          <td className="px-4 py-3 text-center relative">
                            <button
                              onClick={() => handleMenuClick(exigencia.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                            >
                              <MoreVertical size={20} className="text-gray-600" />
                            </button>
                            {menuAberto === exigencia.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exigencias;
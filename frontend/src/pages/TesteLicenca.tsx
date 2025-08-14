import React from 'react';

const TesteLicenca: React.FC = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-10 py-3">
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
            <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-tight">
              Central de Conformidade
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-gray-900 text-sm font-medium leading-normal" href="#">
                Painel
              </a>
              <a className="text-gray-900 text-sm font-medium leading-normal" href="#">
                Licenças
              </a>
              <a className="text-gray-900 text-sm font-medium leading-normal" href="#">
                Exigências
              </a>
              <a className="text-gray-900 text-sm font-medium leading-normal" href="#">
                Relatórios
              </a>
            </div>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 text-gray-900 gap-2 text-sm font-bold leading-normal tracking-wide min-w-0 px-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
              </svg>
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("https://api.dicebear.com/7.x/avataaars/svg?seed=user")`,
              }}
            />
          </div>
        </header>

        {/* Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 p-4">
              <a className="text-blue-600 text-base font-medium leading-normal" href="#">
                Licenças
              </a>
              <span className="text-blue-600 text-base font-medium leading-normal">/</span>
              <span className="text-gray-900 text-base font-medium leading-normal">
                Detalhes da Licença
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 tracking-tight text-[32px] font-bold leading-tight">
                  Licença de Operação
                </p>
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  Número da Licença: 2023-LO-001
                </p>
              </div>
            </div>

            {/* Basic Details */}
            <h3 className="text-gray-900 text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
              Detalhes Básicos
            </h3>
            <div className="p-4 grid grid-cols-2">
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Título da Licença</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">Licença de Operação</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Status</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">Ativa</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Data de Emissão</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">15 de Janeiro de 2023</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Data de Vencimento</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">14 de Janeiro de 2024</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Data de Renovação</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">15 de Dezembro de 2023</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Jurisdição</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">Estado de São Paulo</p>
              </div>
            </div>

            {/* Company Information */}
            <h3 className="text-gray-900 text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
              Informações da Empresa
            </h3>
            <div className="p-4 grid grid-cols-2">
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Nome da Empresa</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">Soluções Tecnológicas Ltda.</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Endereço</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">
                  Rua da Inovação, 123, São Paulo, SP 01234-567
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">Pessoa de Contato</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">Ana Silva</p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pl-2">
                <p className="text-gray-600 text-sm font-normal leading-normal">E-mail</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">
                  ana.silva@solucoestec.com.br
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-solid border-gray-300 py-4 pr-2 col-span-2 pr-[50%]">
                <p className="text-gray-600 text-sm font-normal leading-normal">Telefone</p>
                <p className="text-gray-900 text-sm font-normal leading-normal">(11) 5555-1234</p>
              </div>
            </div>

            {/* Associated Requirements */}
            <h3 className="text-gray-900 text-lg font-bold leading-tight tracking-tight px-4 pb-2 pt-4">
              Exigências Associadas
            </h3>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-gray-900 w-[400px] text-sm font-medium leading-normal">
                        Exigência
                      </th>
                      <th className="px-4 py-3 text-left text-gray-900 w-60 text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-900 w-[400px] text-sm font-medium leading-normal">
                        Data de Vencimento
                      </th>
                      <th className="px-4 py-3 text-left text-gray-600 w-60 text-sm font-medium leading-normal">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-300">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-900 text-sm font-normal leading-normal">
                        Relatório Anual de Conformidade
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-green-100 text-green-800 text-sm font-medium leading-normal w-full">
                          <span className="truncate">Concluído</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-600 text-sm font-normal leading-normal">
                        31 de Dezembro de 2023
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-blue-600 text-sm font-bold leading-normal tracking-wide cursor-pointer hover:underline">
                        Visualizar
                      </td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-900 text-sm font-normal leading-normal">
                        Treinamento de Conformidade
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-yellow-100 text-yellow-800 text-sm font-medium leading-normal w-full">
                          <span className="truncate">Em Progresso</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-600 text-sm font-normal leading-normal">
                        15 de Novembro de 2023
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-blue-600 text-sm font-bold leading-normal tracking-wide cursor-pointer hover:underline">
                        Visualizar
                      </td>
                    </tr>
                    <tr className="border-t border-gray-300">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-900 text-sm font-normal leading-normal">
                        Verificação de Antecedentes
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-gray-200 text-gray-700 text-sm font-medium leading-normal w-full">
                          <span className="truncate">Pendente</span>
                        </button>
                      </td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-gray-600 text-sm font-normal leading-normal">
                        31 de Outubro de 2023
                      </td>
                      <td className="h-[72px] px-4 py-2 w-60 text-blue-600 text-sm font-bold leading-normal tracking-wide cursor-pointer hover:underline">
                        Visualizar
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a className="text-gray-600 text-base font-normal leading-normal min-w-40" href="#">
                  Política de Privacidade
                </a>
                <a className="text-gray-600 text-base font-normal leading-normal min-w-40" href="#">
                  Termos de Serviço
                </a>
                <a className="text-gray-600 text-base font-normal leading-normal min-w-40" href="#">
                  Fale Conosco
                </a>
              </div>
              <p className="text-gray-600 text-base font-normal leading-normal">
                @2023 Central de Conformidade. Todos os direitos reservados.
              </p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TesteLicenca;
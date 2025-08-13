import React, { useState } from 'react';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Painel de Controle</p>
                <p className="text-[#49739c] text-sm font-normal leading-normal">Visão geral das suas licenças e status de conformidade</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#49739c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Buscar licenças, regulamentos ou documentos"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49739c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 p-4">
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7edf4]">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Total de Licenças</p>
                <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">125</p>
                <p className="text-[#078838] text-base font-medium leading-normal">+10%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7edf4]">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Prazos Próximos</p>
                <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">15</p>
                <p className="text-[#e73908] text-base font-medium leading-normal">-5%</p>
              </div>
              <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-[#e7edf4]">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Itens Vencidos</p>
                <p className="text-[#0d141c] tracking-light text-2xl font-bold leading-tight">3</p>
                <p className="text-[#078838] text-base font-medium leading-normal">+2%</p>
              </div>
            </div>
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Visão Geral das Licenças</h2>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cedbe8] p-6">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Licenças por Tipo</p>
                <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight truncate">125</p>
                <div className="flex gap-1">
                  <p className="text-[#49739c] text-base font-normal leading-normal">Total</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+10%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#49739c] bg-[#e7edf4] border-t-2 w-full" style={{ height: '30%' }}></div>
                  <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo A</p>
                  <div className="border-[#49739c] bg-[#e7edf4] border-t-2 w-full" style={{ height: '70%' }}></div>
                  <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo B</p>
                  <div className="border-[#49739c] bg-[#e7edf4] border-t-2 w-full" style={{ height: '20%' }}></div>
                  <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo C</p>
                  <div className="border-[#49739c] bg-[#e7edf4] border-t-2 w-full" style={{ height: '20%' }}></div>
                  <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Tipo D</p>
                </div>
              </div>
              <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#cedbe8] p-6">
                <p className="text-[#0d141c] text-base font-medium leading-normal">Cronograma de Expiração de Licenças</p>
                <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight truncate">125</p>
                <div className="flex gap-1">
                  <p className="text-[#49739c] text-base font-normal leading-normal">Ano Atual</p>
                  <p className="text-[#078838] text-base font-medium leading-normal">+5%</p>
                </div>
                <div className="flex min-h-[180px] flex-1 flex-col gap-8 py-4">
                  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z"
                      fill="url(#paint0_linear_1131_5935)"
                    ></path>
                    <path
                      d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                      stroke="#49739c"
                      strokeWidth="3"
                      strokeLinecap="round"
                    ></path>
                    <defs>
                      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e7edf4"></stop>
                        <stop offset="1" stopColor="#e7edf4" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-around">
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan</p>
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Fev</p>
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Mar</p>
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Abr</p>
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Mai</p>
                    <p className="text-[#49739c] text-[13px] font-bold leading-normal tracking-[0.015em]">Jun</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-[#0d141c] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Próximos Prazos</h2>
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-lg border border-[#cedbe8] bg-slate-50">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Licença</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] w-[400px] text-sm font-medium leading-normal">Prazo</th>
                      <th className="px-4 py-3 text-left text-[#0d141c] w-60 text-sm font-medium leading-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">Licença A</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">15/08/2024</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Ativa</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">Licença B</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">20/09/2024</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Renovação Pendente</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">Licença C</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">05/10/2024</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Ativa</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">Licença D</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">12/11/2024</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Ativa</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-t border-t-[#cedbe8]">
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#0d141c] text-sm font-normal leading-normal">Licença E</td>
                      <td className="h-[72px] px-4 py-2 w-[400px] text-[#49739c] text-sm font-normal leading-normal">01/12/2024</td>
                      <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e7edf4] text-[#0d141c] text-sm font-medium leading-normal w-full">
                          <span className="truncate">Ativa</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
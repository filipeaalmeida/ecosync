import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccountMenu from './AccountMenu';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#0d141c]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2 className="text-[#0d141c] text-lg font-bold leading-tight tracking-[-0.015em]">EcoSync</h2>
        </div>
        <nav className="flex items-center gap-9">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium leading-normal ${isActive('/dashboard') ? 'text-blue-600' : 'text-[#0d141c] hover:text-blue-600'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/processos" 
            className={`text-sm font-medium leading-normal ${isActive('/processos') ? 'text-blue-600' : 'text-[#0d141c] hover:text-blue-600'}`}
          >
            Processos
          </Link>
          <Link 
            to="/exigencias" 
            className={`text-sm font-medium leading-normal ${isActive('/exigencias') ? 'text-blue-600' : 'text-[#0d141c] hover:text-blue-600'}`}
          >
            Exigências
          </Link>
          <Link 
            to="/relatorios" 
            className={`text-sm font-medium leading-normal ${isActive('/relatorios') ? 'text-blue-600' : 'text-[#0d141c] hover:text-blue-600'}`}
          >
            Relatórios
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-8 items-center">
        <label className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#49739c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Buscar"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49739c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </label>
        <AccountMenu userName="João Silva" />
      </div>
    </header>
  );
};

export default Header;
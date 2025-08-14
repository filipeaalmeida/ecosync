import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';

interface AccountMenuProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ 
  userName = 'Usuário',
  userEmail = 'usuario@ecosync.com',
  userRole = 'Administrador'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
    setIsOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout');
    navigate('/login');
    setIsOpen(false);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
        aria-label="Menu da conta"
      >
        {getInitial(userName)}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur text-white font-bold text-lg">
                {getInitial(userName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{userName}</p>
                <p className="text-blue-100 text-sm truncate">{userEmail}</p>
                <p className="text-blue-200 text-xs mt-1">{userRole}</p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-gray-500">
                <path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H40V64H216V192ZM48,168a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H56A8,8,0,0,1,48,168Zm96,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H152A8,8,0,0,1,144,168Zm-48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H104A8,8,0,0,1,96,168Z"></path>
              </svg>
              <span>Alterar Senha</span>
            </button>
            
            <div className="my-2 border-t border-gray-100"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-red-500">
                <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default AccountMenu;
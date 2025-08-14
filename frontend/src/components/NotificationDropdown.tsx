import React, { useState, useRef, useEffect } from 'react';
import { Bell, ExternalLink, Clock, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequirementViewModal from './RequirementViewModal';

interface Notification {
  id: string;
  type: 'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao';
  title: string;
  prazo?: string;
  diasInfo?: string;
  responsavel?: string;
  date: string;
  time: string;
  read: boolean;
  exigenciaId?: number;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'atribuicao',
      title: 'Nova exigência atribuída a você',
      responsavel: 'João Silva',
      date: '2024-08-15',
      time: '10:30',
      read: false,
      exigenciaId: 7
    },
    {
      id: '2',
      type: 'exigencia_vencida',
      title: 'Exigência com prazo vencido',
      prazo: '13/08/2024',
      diasInfo: 'Venceu há 2 dias',
      date: '2024-08-13',
      time: '09:00',
      read: false,
      exigenciaId: 1
    },
    {
      id: '3',
      type: 'exigencia_prazo',
      title: 'Exigência próxima do prazo',
      prazo: '17/08/2024',
      diasInfo: 'Vence em 3 dias',
      date: '2024-08-14',
      time: '14:30',
      read: false,
      exigenciaId: 4
    },
    {
      id: '4',
      type: 'atribuicao',
      title: 'Exigência foi atribuída a você',
      responsavel: 'Maria Santos',
      date: '2024-08-14',
      time: '15:45',
      read: true,
      exigenciaId: 8
    },
    {
      id: '5',
      type: 'renovacao_prazo',
      title: 'Solicitação de renovação de prazo',
      prazo: '20/09/2024',
      diasInfo: 'Vence em 37 dias',
      date: '2024-08-14',
      time: '11:15',
      read: true,
      exigenciaId: 6
    },
    {
      id: '6',
      type: 'exigencia_prazo',
      title: 'Exigência próxima do prazo',
      prazo: '21/08/2024',
      diasInfo: 'Vence em 7 dias',
      date: '2024-08-13',
      time: '16:00',
      read: true,
      exigenciaId: 3
    },
    {
      id: '7',
      type: 'renovacao_prazo',
      title: 'Solicitação de renovação de prazo',
      prazo: '05/09/2024',
      diasInfo: 'Vence em 22 dias',
      date: '2024-08-12',
      time: '10:00',
      read: true,
      exigenciaId: 5
    }
  ]);

  const [showExigenciaModal, setShowExigenciaModal] = useState(false);
  const [selectedExigenciaId, setSelectedExigenciaId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    if (notification.exigenciaId) {
      setSelectedExigenciaId(notification.exigenciaId);
      setShowExigenciaModal(true);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exigencia_vencida':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'exigencia_prazo':
        return <Clock className="text-yellow-500" size={20} />;
      case 'renovacao_prazo':
        return <RefreshCw className="text-blue-500" size={20} />;
      case 'atribuicao':
        return <Bell className="text-purple-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-lg transition-colors ${
            isOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Notificações"
        >
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {/* Ícone */}
                    <div className="flex-shrink-0 pt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      {/* Título e ícone de link */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 break-words">
                          {notification.title}
                        </h4>
                        {notification.exigenciaId && (
                          <ExternalLink size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                      
                      {/* Informações de prazo ou responsável */}
                      <div className="space-y-1">
                        {notification.prazo && (
                          <p className="text-sm text-gray-600">
                            Prazo: {notification.prazo}
                          </p>
                        )}
                        {notification.responsavel && (
                          <p className="text-sm text-gray-600">
                            Atribuído por: {notification.responsavel}
                          </p>
                        )}
                        {notification.diasInfo && (
                          <p className={`text-sm font-medium ${
                            notification.type === 'exigencia_vencida' ? 'text-red-600' : 
                            notification.type === 'exigencia_prazo' ? 'text-yellow-600' :
                            notification.type === 'renovacao_prazo' ? 'text-blue-600' :
                            notification.type === 'atribuicao' ? 'text-purple-600' :
                            'text-gray-600'
                          }`}>
                            {notification.diasInfo}
                          </p>
                        )}
                        {notification.type === 'atribuicao' && (
                          <p className="text-xs text-gray-500">
                            Clique para ver detalhes
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Indicador de não lido */}
                    {!notification.read && (
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Ver todas */}
            <button
              className="w-full block p-4 text-center border-t border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => {
                setIsOpen(false);
                navigate('/notificacoes');
              }}
            >
              <span className="text-sm text-blue-600 font-medium flex items-center justify-center gap-2">
                Ver todas as notificações
                <ChevronRight size={16} />
              </span>
            </button>
          </div>
        )}
      </div>

      {showExigenciaModal && selectedExigenciaId && (
        <RequirementViewModal
          isOpen={showExigenciaModal}
          onClose={() => {
            setShowExigenciaModal(false);
            setSelectedExigenciaId(null);
          }}
          exigenciaId={selectedExigenciaId}
        />
      )}
    </>
  );
};

export default NotificationDropdown;
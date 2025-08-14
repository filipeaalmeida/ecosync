import React, { useState, useRef, useEffect } from 'react';
import { Bell, ExternalLink, Clock, AlertCircle, RefreshCw, Check, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import RequirementModal from '../components/RequirementModal';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'exigencia_prazo' | 'exigencia_vencida' | 'renovacao_prazo' | 'atribuicao';
  title: string;
  prazo?: string;
  diasInfo?: string;
  descricaoCompleta?: string;
  responsavel?: string;
  date: string;
  time: string;
  read: boolean;
  exigenciaId?: number;
}

const Notificacoes: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showExigenciaModal, setShowExigenciaModal] = useState(false);
  const [selectedExigencia, setSelectedExigencia] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função para formatar o texto de dias
  const formatDiasInfo = (diasInfo: string): string => {
    // Substituir "Vence em 0 dias" por "Vence hoje"
    if (diasInfo === 'Vence em 0 dias') {
      return 'Vence hoje';
    }
    // Substituir "Venceu há 0 dias" por "Venceu hoje"
    if (diasInfo === 'Venceu há 0 dias') {
      return 'Venceu hoje';
    }
    return diasInfo;
  };

  const typeOptions = [
    { value: 'exigencia_vencida', label: 'Exigências vencidas' },
    { value: 'exigencia_prazo', label: 'Exigências próximas do prazo' },
    { value: 'renovacao_prazo', label: 'Solicitação de renovação próxima' },
    { value: 'atribuicao', label: 'Atribuídas a mim' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([
    // Hoje - 14/08/2024
    {
      id: '1',
      type: 'atribuicao',
      title: 'Nova exigência atribuída a você',
      descricaoCompleta: 'Enviar documentos de licenciamento ambiental',
      responsavel: 'Carlos Oliveira',
      date: '2024-08-14',
      time: '16:45',
      read: false,
      exigenciaId: 10
    },
    {
      id: '2',
      type: 'exigencia_prazo',
      title: 'Exigência próxima do prazo',
      prazo: '17/08/2024',
      diasInfo: 'Vence em 3 dias',
      descricaoCompleta: 'Realizar pagamento das taxas de licenciamento',
      date: '2024-08-14',
      time: '14:30',
      read: false,
      exigenciaId: 4
    },
    {
      id: '3',
      type: 'renovacao_prazo',
      title: 'Solicitação de renovação de licença',
      prazo: '20/09/2024',
      diasInfo: 'Vence em 37 dias',
      descricaoCompleta: 'Submeter plano de gestão ambiental atualizado',
      date: '2024-08-14',
      time: '11:15',
      read: false,
      exigenciaId: 6
    },
    {
      id: '4',
      type: 'atribuicao',
      title: 'Exigência foi atribuída a você',
      descricaoCompleta: 'Apresentar certidões negativas de débitos',
      responsavel: 'Ana Costa',
      date: '2024-08-14',
      time: '09:20',
      read: true,
      exigenciaId: 11
    },
    // Ontem - 13/08/2024
    {
      id: '5',
      type: 'exigencia_vencida',
      title: 'Exigência com prazo vencido',
      prazo: '11/08/2024',
      diasInfo: 'Venceu há 2 dias',
      descricaoCompleta: 'Apresentar relatório anual completo com demonstrações financeiras',
      date: '2024-08-13',
      time: '09:00',
      read: false,
      exigenciaId: 1
    },
    {
      id: '6',
      type: 'exigencia_prazo',
      title: 'Exigência próxima do prazo',
      prazo: '21/08/2024',
      diasInfo: 'Vence em 7 dias',
      descricaoCompleta: 'Completar treinamento obrigatório de compliance',
      date: '2024-08-13',
      time: '16:00',
      read: true,
      exigenciaId: 3
    },
    // 12/08/2024
    {
      id: '7',
      type: 'atribuicao',
      title: 'Responsável por nova exigência',
      descricaoCompleta: 'Providenciar alvará de funcionamento',
      responsavel: 'Pedro Silva',
      date: '2024-08-12',
      time: '15:30',
      read: true,
      exigenciaId: 12
    },
    {
      id: '8',
      type: 'renovacao_prazo',
      title: 'Solicitação de renovação de licença',
      prazo: '15/08/2024',
      diasInfo: 'Vence em 1 dia',
      descricaoCompleta: 'Atualizar apólice de seguro empresarial',
      date: '2024-08-12',
      time: '10:00',
      read: true,
      exigenciaId: 5
    },
    // 10/08/2024
    {
      id: '9',
      type: 'exigencia_vencida',
      title: 'Exigência com prazo vencido',
      prazo: '31/07/2024',
      diasInfo: 'Venceu há 10 dias',
      descricaoCompleta: 'Renovar licença de operação junto ao órgão competente',
      date: '2024-08-10',
      time: '09:00',
      read: true,
      exigenciaId: 2
    },
    {
      id: '10',
      type: 'exigencia_prazo',
      title: 'Exigência próxima do prazo',
      prazo: '15/08/2024',
      diasInfo: 'Vence em 5 dias',
      descricaoCompleta: 'Apresentar documentação fiscal completa',
      date: '2024-08-10',
      time: '14:00',
      read: true,
      exigenciaId: 7
    }
  ]);

  const handleNotificationClick = (notification: Notification) => {
    // Alternar entre lida e não lida
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: !n.read } : n)
    );
  };

  const handleIconClick = (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    
    if (notification.exigenciaId) {
      // Mock de exigência para o modal
      const mockExigencia = {
        id: notification.exigenciaId,
        titulo: notification.descricaoCompleta || notification.title,
        descricao: notification.descricaoCompleta || '',
        prazo: notification.prazo || '',
        status: 'Pendente',
        responsavel: notification.responsavel || 'Não atribuído'
      };
      setSelectedExigencia(mockExigencia);
      setShowExigenciaModal(true);
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exigencia_vencida':
        return 'Exigência Vencida';
      case 'exigencia_prazo':
        return 'Prazo Próximo';
      case 'renovacao_prazo':
        return 'Prazo Próximo';
      case 'atribuicao':
        return 'Atribuição';
      default:
        return type;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleTypeToggle = (type: string) => {
    if (type === 'all') {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(prev => {
        if (prev.includes(type)) {
          return prev.filter(t => t !== type);
        } else {
          return [...prev, type];
        }
      });
    }
  };

  // Filtrar notificações
  let filteredNotifications = notifications;
  if (selectedFilter === 'unread') {
    filteredNotifications = filteredNotifications.filter(n => !n.read);
  }
  if (selectedTypes.length > 0) {
    filteredNotifications = filteredNotifications.filter(n => selectedTypes.includes(n.type));
  }

  // Agrupar notificações por data
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-700" size={28} />
                <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount} não lidas
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Check size={16} />
                  Marcar todas como lidas
                </button>
              )}
            </div>

            {/* Texto orientativo */}
            <p className="text-sm text-gray-500 mb-4">
              Clique nas notificações para marcar como lidas ou não lidas
            </p>

            {/* Filtros */}
            <div className="flex gap-4 mb-6">
              <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedFilter('unread')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    selectedFilter === 'unread' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Não lidas
                </button>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 min-w-[200px]"
                >
                  <span className="flex-1 text-left">
                    {selectedTypes.length === 0 
                      ? 'Todos os tipos' 
                      : selectedTypes.length === 1
                      ? typeOptions.find(t => t.value === selectedTypes[0])?.label
                      : `${selectedTypes.length} tipos selecionados`
                    }
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showTypeDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <label className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.length === 0}
                          onChange={() => handleTypeToggle('all')}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        Todos
                      </label>
                      <div className="border-t border-gray-200"></div>
                      {typeOptions.map(option => (
                        <label key={option.value} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(option.value)}
                            onChange={() => handleTypeToggle(option.value)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="space-y-6">
            {Object.keys(groupedNotifications).length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Bell className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 text-lg">Nenhuma notificação encontrada</p>
                <p className="text-gray-400 text-sm mt-2">
                  {selectedFilter === 'unread' 
                    ? 'Você não tem notificações não lidas' 
                    : 'Suas notificações aparecerão aqui'}
                </p>
              </div>
            ) : (
              Object.entries(groupedNotifications)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, dayNotifications]) => (
                  <div key={date}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">
                      {formatDate(date)}
                    </h2>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {dayNotifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          } ${index !== dayNotifications.length - 1 ? 'border-b border-gray-100' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {notification.title}
                                    </p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                      {getTypeLabel(notification.type)}
                                    </span>
                                  </div>
                                  {notification.descricaoCompleta && (
                                    <p className="text-sm text-gray-600 mb-2">
                                      {notification.descricaoCompleta}
                                    </p>
                                  )}
                                  <div className="space-y-1">
                                    {notification.prazo && (
                                      <p className="text-sm text-gray-600">
                                        Prazo: {notification.prazo}
                                      </p>
                                    )}
                                    {notification.responsavel && (
                                      <p className="text-sm text-gray-600">
                                        Atribuído por: <span className="font-medium">{notification.responsavel}</span>
                                        {notification.type === 'atribuicao' && (
                                          <span className="text-xs text-gray-400 ml-2">às {notification.time}</span>
                                        )}
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
                                        {formatDiasInfo(notification.diasInfo)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {notification.exigenciaId && notification.type !== 'renovacao_prazo' && (
                                    <button
                                      onClick={(e) => handleIconClick(e, notification)}
                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                      title="Ver detalhes da exigência"
                                    >
                                      <ExternalLink size={16} className="text-blue-600" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {showExigenciaModal && selectedExigencia && (
        <RequirementModal
          isOpen={showExigenciaModal}
          onClose={() => {
            setShowExigenciaModal(false);
            setSelectedExigencia(null);
          }}
          mode="edit"
          exigencia={selectedExigencia}
          onSave={() => {
            setShowExigenciaModal(false);
            setSelectedExigencia(null);
          }}
        />
      )}
    </div>
  );
};

export default Notificacoes;
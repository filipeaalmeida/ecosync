import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMockResponse = (): string => {
    const exigencias = [
      {
        titulo: 'Relatório de Impacto Ambiental',
        processo: 'PROC-2024-001',
        vencimento: '3 dias',
        status: 'Pendente'
      },
      {
        titulo: 'Licença de Operação',
        processo: 'PROC-2024-002',
        vencimento: '5 dias',
        status: 'Em análise'
      },
      {
        titulo: 'Plano de Manejo de Resíduos',
        processo: 'PROC-2024-003',
        vencimento: '2 dias',
        status: 'Documentação incompleta'
      },
      {
        titulo: 'Estudo de Viabilidade Técnica',
        processo: 'PROC-2024-004',
        vencimento: '4 dias',
        status: 'Aguardando vistoria'
      }
    ];

    let response = 'Aqui estão as exigências que vencem nos próximos 5 dias:\n\n';
    
    exigencias.forEach((exigencia, index) => {
      response += `${index + 1}. **${exigencia.titulo}**\n`;
      response += `   • Processo: ${exigencia.processo}\n`;
      response += `   • Vence em: ${exigencia.vencimento}\n`;
      response += `   • Status: ${exigencia.status}\n\n`;
    });

    response += 'Recomendo priorizar os itens com vencimento mais próximo e verificar se há documentação pendente que precisa ser completada.';

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simula tempo de "pensamento"
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: generateMockResponse(),
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto h-[calc(100vh-76px)] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-2">Assistente EcoSync</h2>
              <p className="text-center">
                Olá! Sou seu assistente para monitorar exigências e processos ambientais.
                <br />
                Digite qualquer mensagem para começar nossa conversa.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                    {/* Avatar */}
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-blue-600">
                        U
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#0d141c]">
                        <div className="size-4">
                          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-bold leading-tight tracking-[-0.015em]">EcoSync</span>
                      </div>
                    )}
                    
                    {/* Message Content */}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 shadow-sm border'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex items-center gap-2 text-[#0d141c]">
                      <div className="size-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-bold leading-tight tracking-[-0.015em]">EcoSync</span>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-gray-500 text-sm">Pensando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Floating */}
        <div className="px-4 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 max-h-32"
                    rows={1}
                    style={{
                      minHeight: '48px',
                      height: 'auto'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                    }}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 rounded-md text-blue-600 hover:bg-blue-50 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

interface NotificationRule {
  id?: string;
  type: 'vencimento' | 'prazo_antecipado' | 'renovacao_antecipada';
  dias?: number;
  notificar_criador: boolean;
  notificar_responsavel: boolean;
  usuarios_adicionais: string[];
}

const NotificationSettings: React.FC = () => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [newRule, setNewRule] = useState<NotificationRule>({
    type: 'vencimento',
    notificar_criador: true,
    notificar_responsavel: true,
    usuarios_adicionais: []
  });
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    loadNotificationRules();
  }, []);

  const loadNotificationRules = async () => {
    try {
      // TODO: Implementar chamada para o backend
      // const response = await fetch('/api/notification-rules');
      // const data = await response.json();
      // setRules(data);
    } catch (error) {
      console.error('Erro ao carregar regras de notificação:', error);
    }
  };

  const saveRule = async () => {
    try {
      // TODO: Implementar chamada para o backend
      // const response = await fetch('/api/notification-rules', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRule)
      // });
      
      // Temporariamente adicionando à lista local
      setRules([...rules, { ...newRule, id: Date.now().toString() }]);
      setNewRule({
        type: 'vencimento',
        notificar_criador: true,
        notificar_responsavel: true,
        usuarios_adicionais: []
      });
    } catch (error) {
      console.error('Erro ao salvar regra:', error);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      // TODO: Implementar chamada para o backend
      // await fetch(`/api/notification-rules/${id}`, { method: 'DELETE' });
      
      setRules(rules.filter(rule => rule.id !== id));
    } catch (error) {
      console.error('Erro ao deletar regra:', error);
    }
  };

  const addEmail = () => {
    if (newEmail && !newRule.usuarios_adicionais.includes(newEmail)) {
      setNewRule({
        ...newRule,
        usuarios_adicionais: [...newRule.usuarios_adicionais, newEmail]
      });
      setNewEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setNewRule({
      ...newRule,
      usuarios_adicionais: newRule.usuarios_adicionais.filter(e => e !== email)
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vencimento':
        return 'Vencimento do prazo';
      case 'prazo_antecipado':
        return 'Antecipação do prazo';
      case 'renovacao_antecipada':
        return 'Renovação antecipada';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Configurações de Notificações
            </h1>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-700">
                Nesta aba você deverá configurar o envio de notificações das exigências.
              </p>
            </div>

            {/* Formulário para nova regra */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Adicionar Nova Regra de Notificação
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Notificação
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="vencimento">Notificar quando venceu o prazo</option>
                    <option value="prazo_antecipado">Notificar X dias antes do prazo</option>
                    <option value="renovacao_antecipada">Notificar renovação X dias antes</option>
                  </select>
                </div>

                {(newRule.type === 'prazo_antecipado' || newRule.type === 'renovacao_antecipada') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dias de Antecedência
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRule.dias || ''}
                      onChange={(e) => setNewRule({ ...newRule, dias: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Número de dias"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quem será notificado?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newRule.notificar_criador}
                      onChange={(e) => setNewRule({ ...newRule, notificar_criador: e.target.checked })}
                      className="mr-2"
                    />
                    Criador do processo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newRule.notificar_responsavel}
                      onChange={(e) => setNewRule({ ...newRule, notificar_responsavel: e.target.checked })}
                      className="mr-2"
                    />
                    Responsável pela exigência
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuários Adicionais
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o email do usuário"
                  />
                  <button
                    type="button"
                    onClick={addEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Adicionar
                  </button>
                </div>
                {newRule.usuarios_adicionais.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newRule.usuarios_adicionais.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={saveRule}
                disabled={
                  (newRule.type !== 'vencimento' && !newRule.dias) ||
                  (!newRule.notificar_criador && !newRule.notificar_responsavel && newRule.usuarios_adicionais.length === 0)
                }
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Salvar Regra
              </button>
            </div>

            {/* Lista de regras existentes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Regras Configuradas
              </h2>
              
              {rules.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhuma regra de notificação configurada.
                </p>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {getTypeLabel(rule.type)}
                            {rule.dias && ` (${rule.dias} dias)`}
                          </h3>
                          <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Notificar:</strong></p>
                            <ul className="list-disc list-inside ml-4">
                              {rule.notificar_criador && <li>Criador do processo</li>}
                              {rule.notificar_responsavel && <li>Responsável pela exigência</li>}
                              {rule.usuarios_adicionais.map((email, index) => (
                                <li key={index}>{email}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <button
                          onClick={() => rule.id && deleteRule(rule.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
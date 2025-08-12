import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  TestTube, 
  Eye, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Server,
  Code
} from 'lucide-react';
import { WebhookConfig, WebhookLog, WebhookStats, WebhookTopic } from '../types/webhooks';
import { webhookService } from '../services/webhookService';
import WebhookEndpoint from './WebhookEndpoint';

interface WebhookManagerProps {
  onClose: () => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ onClose }) => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'webhooks' | 'logs' | 'stats'>('webhooks');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<number | null>(null);
  const [showEndpointInfo, setShowEndpointInfo] = useState(false);

  useEffect(() => {
    if (webhookService.isConfigured()) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [webhooksData, logsData, statsData] = await Promise.all([
        webhookService.getWebhooks(),
        Promise.resolve(webhookService.getWebhookLogs()),
        webhookService.getWebhookStats()
      ]);
      
      setWebhooks(webhooksData);
      setLogs(logsData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados dos webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = () => {
    setEditingWebhook(null);
    setShowCreateForm(true);
  };

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setShowCreateForm(true);
  };

  const handleDeleteWebhook = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este webhook?')) {
      try {
        await webhookService.deleteWebhook(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir webhook:', error);
        alert('Erro ao excluir webhook');
      }
    }
  };

  const handleToggleWebhook = async (webhook: WebhookConfig) => {
    try {
      const newStatus = webhook.status === 'active' ? 'paused' : 'active';
      await webhookService.updateWebhook(webhook.id!, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Erro ao alterar status do webhook:', error);
      alert('Erro ao alterar status do webhook');
    }
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    if (!webhook.id) return;
    
    setTestingWebhook(webhook.id);
    try {
      const success = await webhookService.testWebhook(webhook);
      alert(success ? 'Teste realizado com sucesso!' : 'Falha no teste do webhook');
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      alert('Erro ao testar webhook');
    } finally {
      setTestingWebhook(null);
    }
  };

  const getStatusIcon = (status: WebhookConfig['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'disabled':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLogStatusIcon = (status: WebhookLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!webhookService.isConfigured()) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              WooCommerce não configurado
            </h3>
            <p className="text-gray-600 mb-4">
              Configure sua integração com WooCommerce no Dashboard de APIs para gerenciar webhooks.
            </p>
            <button
              onClick={onClose}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Webhook className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Gerenciador de Webhooks</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'webhooks'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Webhooks
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Estatísticas
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'webhooks' && (
            <>
              {!showCreateForm ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Webhooks Configurados</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEndpointInfo(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Code size={16} />
                        Endpoint
                      </button>
                      <button
                        onClick={handleCreateWebhook}
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Criar Webhook
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Carregando webhooks...</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {webhooks.map((webhook) => (
                        <div key={webhook.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(webhook.status)}
                                <h4 className="font-semibold text-gray-900">{webhook.name}</h4>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {webhook.topic}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>URL:</strong> {webhook.delivery_url}
                              </p>
                              <p className="text-sm text-gray-500">
                                Status: {webhook.status} • Criado em: {webhook.date_created ? new Date(webhook.date_created).toLocaleDateString('pt-BR') : 'N/A'}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleTestWebhook(webhook)}
                                disabled={testingWebhook === webhook.id}
                                className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Testar webhook"
                              >
                                <TestTube size={16} className={testingWebhook === webhook.id ? 'animate-pulse' : ''} />
                              </button>
                              
                              <button
                                onClick={() => handleToggleWebhook(webhook)}
                                className={`p-2 rounded-lg transition-colors ${
                                  webhook.status === 'active'
                                    ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                }`}
                                title={webhook.status === 'active' ? 'Pausar' : 'Ativar'}
                              >
                                {webhook.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                              </button>
                              
                              <button
                                onClick={() => handleEditWebhook(webhook)}
                                className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteWebhook(webhook.id!)}
                                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {webhooks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Webhook className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Nenhum webhook configurado ainda.</p>
                          <p className="text-sm">Crie seu primeiro webhook para começar!</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <WebhookForm
                  webhook={editingWebhook}
                  onSave={async (webhookData) => {
                    try {
                      if (editingWebhook) {
                        await webhookService.updateWebhook(editingWebhook.id!, webhookData);
                      } else {
                        await webhookService.createWebhook(webhookData);
                      }
                      loadData();
                      setShowCreateForm(false);
                      setEditingWebhook(null);
                    } catch (error) {
                      console.error('Erro ao salvar webhook:', error);
                      alert('Erro ao salvar webhook');
                    }
                  }}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingWebhook(null);
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'logs' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Logs de Webhooks</h3>
                <button
                  onClick={() => {
                    webhookService.clearWebhookLogs();
                    setLogs([]);
                  }}
                  className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  Limpar Logs
                </button>
              </div>

              <div className="space-y-3">
                {logs.slice(0, 50).map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getLogStatusIcon(log.status)}
                        <span className="font-medium text-gray-900">{log.topic}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {log.event}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(log.date_created).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>URL:</strong> {log.delivery_url}</p>
                      <p><strong>Status:</strong> {log.status}</p>
                      {log.response_code && (
                        <p><strong>Código de Resposta:</strong> {log.response_code}</p>
                      )}
                      {log.response_message && (
                        <p><strong>Mensagem:</strong> {log.response_message}</p>
                      )}
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum log de webhook encontrado.</p>
                    <p className="text-sm">Os logs aparecerão aqui quando os webhooks forem executados.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Estatísticas dos Webhooks</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total de Webhooks</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total_webhooks}</p>
                    </div>
                    <Webhook className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Webhooks Ativos</p>
                      <p className="text-2xl font-bold text-green-900">{stats.active_webhooks}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total de Entregas</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.total_deliveries}</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Entregas Bem-sucedidas</p>
                      <p className="text-2xl font-bold text-emerald-900">{stats.successful_deliveries}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Entregas Falhadas</p>
                      <p className="text-2xl font-bold text-red-900">{stats.failed_deliveries}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Taxa de Sucesso</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.success_rate.toFixed(1)}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showEndpointInfo && (
        <WebhookEndpoint onClose={() => setShowEndpointInfo(false)} />
      )}
    </div>
  );
};

interface WebhookFormProps {
  webhook: WebhookConfig | null;
  onSave: (webhook: Omit<WebhookConfig, 'id'>) => void;
  onCancel: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ webhook, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: webhook?.name || '',
    topic: webhook?.topic || 'order.created' as WebhookTopic,
    delivery_url: webhook?.delivery_url || '',
    secret: webhook?.secret || '',
    status: webhook?.status || 'active' as WebhookConfig['status']
  });

  const availableTopics = webhookService.getAvailableTopics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {webhook ? 'Editar' : 'Criar'} Webhook
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Webhook
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as WebhookConfig['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="active">Ativo</option>
            <option value="paused">Pausado</option>
            <option value="disabled">Desabilitado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tópico do Webhook
        </label>
        <select
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value as WebhookTopic })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        >
          {availableTopics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label} - {topic.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de Entrega
        </label>
        <input
          type="url"
          value={formData.delivery_url}
          onChange={(e) => setFormData({ ...formData, delivery_url: e.target.value })}
          placeholder="https://seu-site.com/webhook"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          URL onde o webhook será enviado quando o evento ocorrer
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Segredo (Opcional)
        </label>
        <input
          type="password"
          value={formData.secret}
          onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
          placeholder="Chave secreta para validação"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Usado para gerar assinatura HMAC-SHA256 para validação de segurança
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Dicas importantes:</h4>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Certifique-se de que a URL de entrega está acessível publicamente</li>
          <li>• Use HTTPS para maior segurança</li>
          <li>• Configure um segredo para validar a autenticidade dos webhooks</li>
          <li>• Teste o webhook após a criação para verificar se está funcionando</li>
        </ul>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-purple-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
        >
          {webhook ? 'Atualizar' : 'Criar'} Webhook
        </button>
      </div>
    </form>
  );
};

export default WebhookManager;
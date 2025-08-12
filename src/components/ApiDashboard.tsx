import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, TestTube, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { ApiConfig, WooCommerceConfig, StabilityConfig } from '../types/api';
import { apiManager } from '../services/apiManager';

interface ApiDashboardProps {
  onClose: () => void;
}

const ApiDashboard: React.FC<ApiDashboardProps> = ({ onClose }) => {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
  const [testingConfig, setTestingConfig] = useState<string | null>(null);

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = () => {
    setConfigs(apiManager.getAllConfigurations());
  };

  const handleAddConfig = () => {
    setEditingConfig(null);
    setShowAddForm(true);
  };

  const handleEditConfig = (config: ApiConfig) => {
    setEditingConfig(config);
    setShowAddForm(true);
  };

  const handleDeleteConfig = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta configuração?')) {
      apiManager.removeConfiguration(id);
      loadConfigurations();
    }
  };

  const handleTestConnection = async (config: ApiConfig) => {
    setTestingConfig(config.id);
    try {
      const isConnected = await apiManager.testConnection(config);
      const status = isConnected ? 'connected' : 'error';
      
      apiManager.updateConfiguration(config.id, {
        status,
        lastTested: new Date()
      });
      
      loadConfigurations();
    } catch (error) {
      apiManager.updateConfiguration(config.id, {
        status: 'error',
        lastTested: new Date()
      });
      loadConfigurations();
    } finally {
      setTestingConfig(null);
    }
  };

  const handleToggleActive = (config: ApiConfig) => {
    // Desativar outras configurações do mesmo tipo
    configs
      .filter(c => c.type === config.type && c.id !== config.id)
      .forEach(c => {
        apiManager.updateConfiguration(c.id, { isActive: false });
      });

    // Ativar/desativar a configuração atual
    apiManager.updateConfiguration(config.id, { isActive: !config.isActive });
    loadConfigurations();
  };

  const getStatusIcon = (status: ApiConfig['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getTypeLabel = (type: ApiConfig['type']) => {
    switch (type) {
      case 'stability':
        return 'Stability AI';
      case 'woocommerce':
        return 'WooCommerce';
      case 'openai':
        return 'OpenAI';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">Dashboard de APIs</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showAddForm ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configurações de API</h3>
                <button
                  onClick={handleAddConfig}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Adicionar API
                </button>
              </div>

              <div className="grid gap-4">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className={`p-4 border rounded-lg ${
                      config.isActive ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(config.status)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{config.name}</h4>
                          <p className="text-sm text-gray-600">{getTypeLabel(config.type)}</p>
                        </div>
                        {config.isActive && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Ativo
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTestConnection(config)}
                          disabled={testingConfig === config.id}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Testar conexão"
                        >
                          <TestTube size={16} className={testingConfig === config.id ? 'animate-pulse' : ''} />
                        </button>
                        
                        <button
                          onClick={() => handleToggleActive(config)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            config.isActive
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          {config.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        
                        <button
                          onClick={() => handleEditConfig(config)}
                          className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Editar"
                        >
                          <Settings size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteConfig(config.id)}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {config.lastTested && (
                      <p className="text-xs text-gray-500 mt-2">
                        Último teste: {new Date(config.lastTested).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                ))}

                {configs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma API configurada ainda.</p>
                    <p className="text-sm">Clique em "Adicionar API" para começar.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <ApiConfigForm
              config={editingConfig}
              onSave={(config) => {
                if (editingConfig) {
                  apiManager.updateConfiguration(editingConfig.id, config);
                } else {
                  apiManager.addConfiguration({
                    ...config,
                    id: Date.now().toString(),
                    status: 'disconnected',
                    isActive: false
                  });
                }
                loadConfigurations();
                setShowAddForm(false);
                setEditingConfig(null);
              }}
              onCancel={() => {
                setShowAddForm(false);
                setEditingConfig(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface ApiConfigFormProps {
  config: ApiConfig | null;
  onSave: (config: Partial<ApiConfig>) => void;
  onCancel: () => void;
}

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: config?.name || '',
    type: config?.type || 'stability' as ApiConfig['type'],
    apiKey: config?.apiKey || '',
    baseUrl: config?.baseUrl || '',
    // WooCommerce specific
    storeUrl: (config as WooCommerceConfig)?.storeUrl || '',
    consumerKey: (config as WooCommerceConfig)?.consumerKey || '',
    consumerSecret: (config as WooCommerceConfig)?.consumerSecret || '',
    version: (config as WooCommerceConfig)?.version || 'v3',
    // Stability specific
    model: (config as StabilityConfig)?.model || 'stable-diffusion-xl-1024-v1-0'
  });

  const [showSecrets, setShowSecrets] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let configData: Partial<ApiConfig> = {
      name: formData.name,
      type: formData.type,
      apiKey: formData.apiKey,
      baseUrl: formData.baseUrl
    };

    if (formData.type === 'woocommerce') {
      configData = {
        ...configData,
        storeUrl: formData.storeUrl,
        consumerKey: formData.consumerKey,
        consumerSecret: formData.consumerSecret,
        version: formData.version
      } as Partial<WooCommerceConfig>;
    } else if (formData.type === 'stability') {
      configData = {
        ...configData,
        model: formData.model
      } as Partial<StabilityConfig>;
    }

    onSave(configData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {config ? 'Editar' : 'Adicionar'} Configuração de API
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Configuração
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
            Tipo de API
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ApiConfig['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={!!config}
          >
            <option value="stability">Stability AI</option>
            <option value="woocommerce">WooCommerce</option>
            <option value="openai">OpenAI</option>
          </select>
        </div>
      </div>

      {formData.type === 'woocommerce' ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Loja
            </label>
            <input
              type="url"
              value={formData.storeUrl}
              onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
              placeholder="https://minha-loja.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Key
              </label>
              <div className="relative">
                <input
                  type={showSecrets ? 'text' : 'password'}
                  value={formData.consumerKey}
                  onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Secret
              </label>
              <input
                type={showSecrets ? 'text' : 'password'}
                value={formData.consumerSecret}
                onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão da API
            </label>
            <select
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="v3">v3</option>
              <option value="v2">v2</option>
              <option value="v1">v1</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showSecrets ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showSecrets ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {formData.type === 'stability' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="stable-diffusion-xl-1024-v1-0">Stable Diffusion XL 1024</option>
                <option value="stable-diffusion-v1-6">Stable Diffusion v1.6</option>
              </select>
            </div>
          )}
        </>
      )}

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
          {config ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
};

export default ApiDashboard;
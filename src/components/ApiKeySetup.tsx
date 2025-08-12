import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    // Check if API key is already set in environment
    const existingKey = import.meta.env.VITE_STABILITY_API_KEY;
    if (existingKey) {
      setValidationStatus('valid');
    }
  }, []);

  const validateApiKey = async (key: string) => {
    if (!key || key.length < 10) {
      setValidationStatus('invalid');
      return false;
    }

    setIsValidating(true);
    try {
      // Simple validation - check if key format looks correct
      if (key.startsWith('sk-') && key.length > 20) {
        setValidationStatus('valid');
        return true;
      } else {
        setValidationStatus('invalid');
        return false;
      }
    } catch (error) {
      setValidationStatus('invalid');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateApiKey(apiKey);
    if (isValid) {
      // Store in sessionStorage for this session
      sessionStorage.setItem('stability_api_key', apiKey);
      onApiKeySet(apiKey);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Configurar Stability AI
          </h3>
          <p className="text-gray-600">
            Para gerar visualizações das logos, você precisa de uma chave da API do Stability AI
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">Como obter sua chave da API:</h4>
          <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
            <li>Acesse <a href="https://platform.stability.ai/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">platform.stability.ai <ExternalLink size={12} /></a></li>
            <li>Crie uma conta ou faça login</li>
            <li>Vá para "API Keys" no menu</li>
            <li>Clique em "Create API Key"</li>
            <li>Copie a chave gerada</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chave da API do Stability AI
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {validationStatus === 'valid' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {validationStatus === 'invalid' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {validationStatus === 'invalid' && (
              <p className="text-red-600 text-sm mt-1">
                Chave da API inválida. Verifique se está no formato correto (sk-...)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!apiKey || isValidating}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? 'Validando...' : 'Configurar e Continuar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Informações importantes:</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Sua chave será armazenada apenas durante esta sessão</li>
            <li>• Cada geração de imagem consome créditos da sua conta Stability AI</li>
            <li>• As imagens são geradas em alta qualidade (1024x1024px)</li>
            <li>• Você pode pular esta etapa e usar apenas as descrições textuais</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
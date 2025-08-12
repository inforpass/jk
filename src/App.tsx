import React, { useState } from 'react';
import { Palette, Settings, ShoppingCart } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import ApiKeySetup from './components/ApiKeySetup';
import ApiDashboard from './components/ApiDashboard';
import WooCommerceIntegration from './components/WooCommerceIntegration';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import { FormData } from './types';
import { generateLogoConcepts } from './utils/logoGenerator';
import { stabilityAI } from './services/stabilityAI';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [showApiDashboard, setShowApiDashboard] = useState(false);
  const [showWooCommerce, setShowWooCommerce] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    sector: '',
    values: '',
    preferredColors: '',
    graphicElements: '',
    designStyle: [],
    targetAudience: '',
    symbolism: '',
    inspirations: '',
    concepts: [],
    refinements: ''
  });

  const handleApiKeySet = (apiKey: string) => {
    // Update the service with the new API key
    (stabilityAI as any).apiKey = apiKey;
    setShowApiKeySetup(false);
  };

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      // Gerar conceitos antes de ir para o step 4
      const concepts = generateLogoConcepts(formData);
      updateFormData({ concepts });
      
      // Check if we should show API key setup
      if (!stabilityAI.isConfigured() && !sessionStorage.getItem('stability_api_key')) {
        setShowApiKeySetup(true);
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData({
      companyName: '',
      sector: '',
      values: '',
      preferredColors: '',
      graphicElements: '',
      designStyle: [],
      targetAudience: '',
      symbolism: '',
      inspirations: '',
      concepts: [],
      refinements: ''
    });
  };

  const renderCurrentStep = () => {
    if (showApiKeySetup) {
      return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
    }

    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 2:
        return <Step2 formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3 formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <Step4 formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <Step5 formData={formData} updateFormData={updateFormData} onBack={handleBack} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Assistente de Criação de Logo
                </h1>
                <p className="text-sm text-gray-600">Crie logos profissionais em minutos</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWooCommerce(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Integração WooCommerce"
              >
                <ShoppingCart size={16} />
                WooCommerce
              </button>
              
              <button
                onClick={() => setShowApiDashboard(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Configurações de API"
              >
                <Settings size={16} />
                APIs
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!showApiKeySetup && (
          <StepIndicator currentStep={currentStep} totalSteps={5} />
        )}
        
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          {renderCurrentStep()}
        </div>

        {currentStep === 4 && !showApiKeySetup && !stabilityAI.isConfigured() && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowApiKeySetup(true)}
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Configurar Stability AI para gerar visualizações
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showApiDashboard && (
        <ApiDashboard onClose={() => setShowApiDashboard(false)} />
      )}
      
      {showWooCommerce && (
        <WooCommerceIntegration 
          formData={formData}
          onClose={() => setShowWooCommerce(false)} 
        />
      )}
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Assistente de Criação de Logo - Criando identidades visuais únicas
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
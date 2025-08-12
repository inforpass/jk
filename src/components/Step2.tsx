import React from 'react';
import { Palette, Shapes, Sparkles } from 'lucide-react';
import { FormData } from '../types';

interface Step2Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const designStyles = [
  'Minimalista',
  'Moderno',
  'Vintage',
  'Divertido',
  'Elegante'
];

const Step2: React.FC<Step2Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleStyleToggle = (style: string) => {
    const currentStyles = formData.designStyle || [];
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style];
    
    updateFormData({ designStyle: newStyles });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.preferredColors && formData.graphicElements && formData.designStyle.length > 0) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Defina o estilo visual
        </h2>
        <p className="text-lg text-gray-600">
          Vamos personalizar a aparência da sua logo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Cores preferidas
            </label>
          </div>
          <input
            type="text"
            value={formData.preferredColors}
            onChange={(e) => updateFormData({ preferredColors: e.target.value })}
            placeholder="Ex: azul corporativo, tons terrosos, verde e branco"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Shapes className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Elementos gráficos
            </label>
          </div>
          <input
            type="text"
            value={formData.graphicElements}
            onChange={(e) => updateFormData({ graphicElements: e.target.value })}
            placeholder="Ex: ícone abstrato, símbolo literal, tipografia, formas geométricas"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Estilo de design (selecione um ou mais)
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {designStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                  formData.designStyle?.includes(style)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!formData.preferredColors || !formData.graphicElements || !formData.designStyle?.length}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Próximo Passo
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
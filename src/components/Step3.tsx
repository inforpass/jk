import React from 'react';
import { Users, Lightbulb, Star } from 'lucide-react';
import { FormData } from '../types';

interface Step3Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step3: React.FC<Step3Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetAudience) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Público-alvo e simbolismo
        </h2>
        <p className="text-lg text-gray-600">
          Vamos refinar os detalhes para criar a logo perfeita
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Público principal *
            </label>
          </div>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => updateFormData({ targetAudience: e.target.value })}
            placeholder="Ex: jovens 18-25, empresas B2B, famílias, profissionais liberais"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Símbolo/conceito específico
            </label>
          </div>
          <textarea
            value={formData.symbolism}
            onChange={(e) => updateFormData({ symbolism: e.target.value })}
            placeholder="Ex: folha para eco, ondas para tecnologia, engrenagem para indústria"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Logos que você admira (opcional)
            </label>
          </div>
          <textarea
            value={formData.inspirations}
            onChange={(e) => updateFormData({ inspirations: e.target.value })}
            placeholder="Ex: Nike (simplicidade), Apple (minimalismo), Google (cores vibrantes)"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
          />
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
            disabled={!formData.targetAudience}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Gerar Conceitos
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
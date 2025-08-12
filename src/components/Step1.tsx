import React from 'react';
import { Building2, Target, Heart } from 'lucide-react';
import { FormData } from '../types';

interface Step1Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({ formData, updateFormData, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.sector && formData.values) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Vamos criar uma logo incrível para você!
        </h2>
        <p className="text-lg text-gray-600">
          Comece nos contando sobre sua empresa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Building2 className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Nome da empresa/marca
            </label>
          </div>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            placeholder="Digite o nome da sua empresa"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Setor/Área de atuação
            </label>
          </div>
          <input
            type="text"
            value={formData.sector}
            onChange={(e) => updateFormData({ sector: e.target.value })}
            placeholder="Ex: Tecnologia, Saúde, Educação, E-commerce"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-4">
            <Heart className="w-5 h-5 text-purple-500 mr-2" />
            <label className="text-lg font-semibold text-gray-900">
              Valores que quer transmitir
            </label>
          </div>
          <textarea
            value={formData.values}
            onChange={(e) => updateFormData({ values: e.target.value })}
            placeholder="Ex: inovação, confiança, sustentabilidade, criatividade"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            required
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!formData.companyName || !formData.sector || !formData.values}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Próximo Passo
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
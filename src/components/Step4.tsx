import React from 'react';
import { Palette, Type, Target, Sparkles } from 'lucide-react';
import { FormData, LogoConcept } from '../types';
import LogoPreview from './LogoPreview';

interface Step4Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface UploadedImage {
  conceptIndex: number;
  imageUrl: string;
}
const ConceptCard: React.FC<{ concept: LogoConcept; index: number }> = ({ concept, index }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
            {index + 1}
          </span>
          {concept.name}
        </h3>
        <p className="text-gray-600 leading-relaxed">{concept.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <Type className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900">Tipografia:</span>
            <p className="text-gray-600 text-sm">{concept.typography}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Palette className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900">Cores:</span>
            <p className="text-gray-600 text-sm">{concept.colors}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Target className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900">Simbolismo:</span>
            <p className="text-gray-600 text-sm">{concept.symbolism}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Sparkles className="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" />
          <div>
            <span className="font-semibold text-gray-900">Estilo:</span>
            <p className="text-gray-600 text-sm">{concept.style}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4: React.FC<Step4Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const [uploadedImages, setUploadedImages] = React.useState<UploadedImage[]>([]);

  const handleImageUploaded = (imageUrl: string, conceptIndex: number) => {
    setUploadedImages(prev => {
      const existing = prev.find(img => img.conceptIndex === conceptIndex);
      if (existing) {
        return prev.map(img => 
          img.conceptIndex === conceptIndex 
            ? { ...img, imageUrl } 
            : img
        );
      }
      return [...prev, { conceptIndex, imageUrl }];
    });

    // Update form data with uploaded images
    updateFormData({ 
      uploadedImages: [...uploadedImages, { conceptIndex, imageUrl }].reduce((acc, img) => {
        acc[img.conceptIndex] = img.imageUrl;
        return acc;
      }, {} as Record<number, string>)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Seus conceitos de logo
        </h2>
        <p className="text-lg text-gray-600">
          Aqui estão 3 opções criadas especialmente para {formData.companyName}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 mb-8">
        {formData.concepts.map((concept, index) => (
          <div key={concept.id} className="space-y-4">
            <ConceptCard concept={concept} index={index} />
            <LogoPreview 
              concept={concept} 
              companyName={formData.companyName}
              index={index}
              onImageUploaded={handleImageUploaded}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          💡 Dicas de aplicação
        </h3>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Teste a legibilidade em diferentes tamanhos</li>
          <li>• Verifique o contraste em fundos claros e escuros</li>
          <li>• Considere a versatilidade para diferentes mídias</li>
          <li>• Pense na reprodução em uma cor (preto/branco)</li>
          <li>• Use o botão "Enviar para Loja" para adicionar as imagens aos produtos WooCommerce</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
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
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Refinar Conceitos
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step4;
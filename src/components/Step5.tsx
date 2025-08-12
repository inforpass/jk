import React from 'react';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { FormData } from '../types';

interface Step5Props {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onBack: () => void;
  onRestart: () => void;
}

const Step5: React.FC<Step5Props> = ({ formData, updateFormData, onBack, onRestart }) => {
  const handleExport = () => {
    const content = `
CONCEITOS DE LOGO PARA ${formData.companyName.toUpperCase()}

INFORMAÇÕES BÁSICAS:
• Empresa: ${formData.companyName}
• Setor: ${formData.sector}
• Valores: ${formData.values}
• Público-alvo: ${formData.targetAudience}
• Cores preferidas: ${formData.preferredColors}
• Elementos gráficos: ${formData.graphicElements}
• Estilo: ${formData.designStyle?.join(', ')}

CONCEITOS GERADOS:

${formData.concepts.map((concept, index) => `
CONCEITO ${index + 1}: ${concept.name}
Descrição: ${concept.description}
Tipografia: ${concept.typography}
Cores: ${concept.colors}
Simbolismo: ${concept.symbolism}
Estilo: ${concept.style}
`).join('\n')}

${formData.refinements ? `REFINAMENTOS SOLICITADOS:\n${formData.refinements}` : ''}

---
Gerado pelo Assistente de Criação de Logo
${new Date().toLocaleDateString('pt-BR')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conceitos-logo-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Conceitos criados com sucesso!
        </h2>
        <p className="text-lg text-gray-600">
          Finalize seu projeto com ajustes ou exporte os resultados
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Algum ajuste antes de finalizar?
        </label>
        <textarea
          value={formData.refinements}
          onChange={(e) => updateFormData({ refinements: e.target.value })}
          placeholder="Ex: Alterar cor principal para verde, simplificar o ícone, usar fonte mais moderna..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
        />
        <div className="text-sm text-gray-500 mt-2">
          Sugestões: alterar cores, simplificar elementos, ajustar simbolismo
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🎉 Próximos passos recomendados
        </h3>
        <ul className="text-green-800 space-y-2 text-sm">
          <li>• <strong>Teste os conceitos</strong> em diferentes aplicações (cartão, site, redes sociais)</li>
          <li>• <strong>Solicite feedback</strong> de clientes ou stakeholders</li>
          <li>• <strong>Crie variações</strong> (horizontal, vertical, versão monocromática)</li>
          <li>• <strong>Defina manual de marca</strong> com regras de uso e aplicação</li>
          <li>• <strong>Considere registrar</strong> sua marca para proteção legal</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300"
        >
          Voltar
        </button>
        <button
          onClick={handleExport}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Exportar Conceitos
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="text-purple-600 hover:text-purple-700 font-medium flex items-center justify-center gap-2 mx-auto transition-colors duration-200"
        >
          <RefreshCw size={16} />
          Criar nova logo
        </button>
      </div>
    </div>
  );
};

export default Step5;
import React, { useState } from 'react';
import { Image, Loader2, RefreshCw, Download, AlertCircle, Upload } from 'lucide-react';
import { LogoConcept } from '../types';
import { stabilityAI } from '../services/stabilityAI';
import { wooCommerceService } from '../services/woocommerceService';

interface LogoPreviewProps {
  concept: LogoConcept;
  companyName: string;
  index: number;
  onImageUploaded?: (imageUrl: string, conceptIndex: number) => void;
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ concept, companyName, index, onImageUploaded }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState<number | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const generateImage = async () => {
    if (!stabilityAI.isConfigured()) {
      setError('Stability AI não está configurado. Configure a chave da API para gerar imagens.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = stabilityAI.createLogoPrompt(concept, companyName);
      const negativePrompt = stabilityAI.createNegativePrompt();

      const result = await stabilityAI.generateLogoImage({
        prompt,
        negativePrompt,
        width: 1024,
        height: 1024,
        steps: 30
      });

      if (result) {
        setImageData(`data:image/png;base64,${result.base64}`);
        setSeed(result.seed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateImage = async () => {
    setImageData(null);
    await generateImage();
  };

  const downloadImage = () => {
    if (!imageData) return;

    const link = document.createElement('a');
    link.href = imageData;
    link.download = `logo-${companyName.toLowerCase().replace(/\s+/g, '-')}-conceito-${index + 1}.png`;
    link.click();
  };

  const uploadToWooCommerce = async () => {
    if (!imageData || !wooCommerceService.isConfigured()) return;

    setIsUploading(true);
    try {
      // Extract base64 data (remove data:image/png;base64, prefix)
      const base64Data = imageData.split(',')[1];
      const filename = `logo-${companyName.toLowerCase().replace(/\s+/g, '-')}-conceito-${index + 1}.png`;
      
      const uploadResult = await wooCommerceService.uploadBase64Image(base64Data, filename);
      setUploadedImageUrl(uploadResult.source_url);
      
      // Notify parent component about the uploaded image
      if (onImageUploaded) {
        onImageUploaded(uploadResult.source_url, index);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload para WooCommerce');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <Image className="w-4 h-4 mr-2 text-purple-500" />
          Visualização do Conceito {index + 1}
        </h4>
        {imageData && (
          <div className="flex items-center gap-2">
            {uploadedImageUrl && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                ✓ Enviado
              </span>
            )}
            <button
              onClick={downloadImage}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <Download size={14} />
              Baixar
            </button>
          </div>
        )}
      </div>

      <div className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-3 relative overflow-hidden">
        {imageData ? (
          <img
            src={imageData}
            alt={`Logo concept for ${companyName}`}
            className="w-full h-full object-contain"
          />
        ) : error ? (
          <div className="text-center p-4">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-2">{error}</p>
            {stabilityAI.isConfigured() && (
              <button
                onClick={generateImage}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Tentar novamente
              </button>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              Clique para gerar uma visualização desta logo
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Gerando logo...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!imageData && !isGenerating && !error && (
          <button
            onClick={generateImage}
            disabled={!stabilityAI.isConfigured()}
            className="flex-1 bg-purple-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Image size={16} />
            Gerar Visualização
          </button>
        )}

        {imageData && !isGenerating && (
          <button
            onClick={regenerateImage}
            className="flex-1 bg-gray-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Regenerar
          </button>
        )}

        {imageData && !isUploading && wooCommerceService.isConfigured() && !uploadedImageUrl && (
          <button
            onClick={uploadToWooCommerce}
            className="flex-1 bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Enviar para Loja
          </button>
        )}

        {isUploading && (
          <div className="flex-1 bg-gray-200 text-gray-600 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Enviando...
          </div>
        )}
      </div>

      {seed && (
        <p className="text-xs text-gray-500 mt-2">
          Seed: {seed}
        </p>
      )}

      {!stabilityAI.isConfigured() && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Nota:</strong> Para gerar visualizações das logos, configure sua chave da API do Stability AI no arquivo .env
          </p>
        </div>
      )}
    </div>
  );
};

export default LogoPreview;
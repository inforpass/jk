interface LogoGenerationParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
}

interface GeneratedImage {
  base64: string;
  seed: number;
}

class StabilityAIService {
  public apiKey: string;
  private baseUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

  constructor() {
    this.apiKey = import.meta.env.VITE_STABILITY_API_KEY || sessionStorage.getItem('stability_api_key') || '';
    if (!this.apiKey) {
      console.warn('Stability AI API key not found. Image generation will be disabled.');
    }
  }

  async generateLogoImage(params: LogoGenerationParams): Promise<GeneratedImage | null> {
    if (!this.apiKey) {
      throw new Error('Stability AI API key not configured');
    }

    const requestBody = {
      text_prompts: [
        {
          text: params.prompt,
          weight: 1
        }
      ],
      cfg_scale: 7,
      height: params.height || 1024,
      width: params.width || 1024,
      steps: params.steps || 30,
      samples: 1,
      style_preset: "digital-art"
    };

    if (params.negativePrompt) {
      requestBody.text_prompts.push({
        text: params.negativePrompt,
        weight: -1
      });
    }

    if (params.seed) {
      requestBody.seed = params.seed;
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Stability AI API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.artifacts && data.artifacts.length > 0) {
        return {
          base64: data.artifacts[0].base64,
          seed: data.artifacts[0].seed
        };
      }

      throw new Error('No image generated');
    } catch (error) {
      console.error('Error generating logo image:', error);
      throw error;
    }
  }

  createLogoPrompt(concept: any, companyName: string): string {
    const basePrompt = `Professional logo design for "${companyName}", ${concept.description.toLowerCase()}, ${concept.style.toLowerCase()}, clean vector style, minimalist, high contrast, suitable for business use, white background, centered composition`;
    
    // Add specific style modifiers
    const styleModifiers = {
      'minimalista': 'ultra minimalist, simple geometric shapes, negative space',
      'moderno': 'modern sleek design, contemporary typography, gradient effects',
      'vintage': 'retro aesthetic, classic typography, aged texture, vintage colors',
      'divertido': 'playful design, vibrant colors, friendly appearance, approachable',
      'elegante': 'sophisticated design, premium feel, refined typography, luxury aesthetic'
    };

    const style = concept.style.toLowerCase();
    const modifier = Object.entries(styleModifiers).find(([key]) => style.includes(key))?.[1] || '';
    
    return `${basePrompt}, ${modifier}`;
  }

  createNegativePrompt(): string {
    return "blurry, low quality, pixelated, distorted, cluttered, busy design, too many elements, poor typography, illegible text, amateur design, stock photo, realistic photo, 3d render, complex background, multiple logos, watermark";
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const stabilityAI = new StabilityAIService();
export type { LogoGenerationParams, GeneratedImage };
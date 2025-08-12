export interface FormData {
  // Passo 1: Informações Básicas
  companyName: string;
  sector: string;
  values: string;

  // Passo 2: Estilo Visual
  preferredColors: string;
  graphicElements: string;
  designStyle: string[];

  // Passo 3: Público-alvo e Simbolismo
  targetAudience: string;
  symbolism: string;
  inspirations: string;

  // Passo 4: Conceitos (gerados)
  concepts: LogoConcept[];

  // Passo 5: Refinamentos
  refinements: string;

  // Imagens enviadas para WooCommerce
  uploadedImages?: Record<number, string>;
}

export interface LogoConcept {
  id: number;
  name: string;
  description: string;
  typography: string;
  colors: string;
  symbolism: string;
  style: string;
}

export type StepStatus = 'pending' | 'current' | 'completed';
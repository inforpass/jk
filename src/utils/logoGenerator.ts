import { FormData, LogoConcept } from '../types';

const colorPsychology: Record<string, string> = {
  'azul': 'confiança e profissionalismo',
  'verde': 'sustentabilidade e crescimento',
  'vermelho': 'energia e paixão',
  'roxo': 'criatividade e inovação',
  'laranja': 'vitalidade e entusiasmo',
  'amarelo': 'otimismo e criatividade',
  'preto': 'elegância e sofisticação',
  'branco': 'simplicidade e pureza'
};

const typographyStyles: Record<string, string[]> = {
  'Minimalista': ['Helvetica Neue', 'Arial', 'Roboto'],
  'Moderno': ['Montserrat', 'Poppins', 'Inter'],
  'Vintage': ['Playfair Display', 'Serif', 'Times'],
  'Divertido': ['Quicksand', 'Nunito', 'Open Sans'],
  'Elegante': ['Cormorant', 'Crimson Text', 'Libre Baskerville']
};

export function generateLogoConcepts(formData: FormData): LogoConcept[] {
  const { companyName, sector, values, preferredColors, graphicElements, designStyle, targetAudience, symbolism } = formData;

  const concepts: LogoConcept[] = [];
  const styles = designStyle.length > 0 ? designStyle : ['Moderno'];

  // Conceito 1 - Baseado no primeiro estilo selecionado
  const primaryStyle = styles[0];
  const primaryTypography = typographyStyles[primaryStyle]?.[0] || 'Montserrat';
  
  concepts.push({
    id: 1,
    name: `${primaryStyle} ${companyName}`,
    description: `Logo ${primaryStyle.toLowerCase()} que combina o nome "${companyName}" com elementos visuais do setor ${sector.toLowerCase()}. ${symbolism ? `Incorpora ${symbolism.toLowerCase()} como elemento central.` : ''} Ideal para ${targetAudience.toLowerCase()}.`,
    typography: `Fonte ${primaryTypography} com peso médio para legibilidade otimizada`,
    colors: `Paleta baseada em ${preferredColors.toLowerCase()} - ${getColorMeaning(preferredColors)}`,
    symbolism: symbolism || `Elementos abstratos relacionados a ${values.toLowerCase()}`,
    style: `Design ${primaryStyle.toLowerCase()} com foco em ${values.toLowerCase()}`
  });

  // Conceito 2 - Alternativo baseado no segundo estilo ou variação
  const secondaryStyle = styles[1] || (primaryStyle === 'Moderno' ? 'Minimalista' : 'Moderno');
  const secondaryTypography = typographyStyles[secondaryStyle]?.[1] || 'Inter';

  concepts.push({
    id: 2,
    name: `${secondaryStyle} ${companyName}`,
    description: `Abordagem ${secondaryStyle.toLowerCase()} que enfatiza ${values.toLowerCase()}. ${graphicElements ? `Utiliza ${graphicElements.toLowerCase()} de forma estilizada.` : 'Foco na tipografia como elemento principal.'} Adequado para comunicação com ${targetAudience.toLowerCase()}.`,
    typography: `Fonte ${secondaryTypography} com hierarquia visual clara`,
    colors: `Esquema de cores complementares baseado em ${preferredColors.toLowerCase()}`,
    symbolism: `Símbolo ${symbolism ? symbolism.toLowerCase() : 'abstrato'} integrado harmoniosamente`,
    style: `Estilo ${secondaryStyle.toLowerCase()} com elementos de ${sector.toLowerCase()}`
  });

  // Conceito 3 - Híbrido ou terceira opção
  const thirdStyle = styles[2] || 'Elegante';
  const thirdTypography = typographyStyles[thirdStyle]?.[2] || 'Roboto';

  concepts.push({
    id: 3,
    name: `${thirdStyle} ${companyName}`,
    description: `Conceito ${thirdStyle.toLowerCase()} que equilibra tradição e inovação. ${symbolism ? `O símbolo ${symbolism.toLowerCase()} é trabalhado com refinamento visual.` : 'Ênfase na elegância tipográfica.'} Transmite ${values.toLowerCase()} de forma sofisticada para ${targetAudience.toLowerCase()}.`,
    typography: `Fonte ${thirdTypography} com detalhes tipográficos únicos`,
    colors: `Gradiente sutil em tons de ${preferredColors.toLowerCase()} com acentos neutros`,
    symbolism: `Elemento simbólico ${symbolism ? symbolism.toLowerCase() : 'minimalista'} de alta versatilidade`,
    style: `Design ${thirdStyle.toLowerCase()} com aplicabilidade multiplataforma`
  });

  return concepts;
}

function getColorMeaning(colors: string): string {
  const colorLower = colors.toLowerCase();
  for (const [color, meaning] of Object.entries(colorPsychology)) {
    if (colorLower.includes(color)) {
      return meaning;
    }
  }
  return 'expressividade visual única';
}
export interface BrandColor {
  name: string;
  role: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
  textColor: string;
  percentage: number;
  description: string;
  culturalNote: string;
}

export interface ContrastPair {
  fgName: string;
  bgName: string;
  fgHex: string;
  bgHex: string;
  ratio: number;
  status: 'AAA' | 'AA' | 'AA-Large' | 'Fail';
  isApproved: boolean;
  notes: string;
}

export type LogoRoute = 'open-door' | 'many-as-one' | 'monogram' | 'shared-dawn';

export interface ConceptRouteData {
  id: LogoRoute;
  name: string;
  tagline: string;
  isRecommended: boolean;
  rationale: string;
  symbolsDescription: string;
  howItConveysValues: {
    inclusion: string;
    hope: string;
    humanAgency: string;
  };
}

export interface TypeLevel {
  name: string;
  role: string;
  size: string;
  fontSizePx: number;
  lineHeight: string;
  tracking: string;
  weight: string;
  sampleText: string;
  usageRules: string;
}

export interface BrandIcon {
  id: string;
  name: string;
  concept: string;
  svgPath: string;
  explanation: string;
}

export interface GuidelinesPage {
  pageNumber: number;
  chapter: string;
  title: string;
  subtitle: string;
  content: string[];
  keyRules?: string[];
  metrics?: { label: string; value: string }[];
}

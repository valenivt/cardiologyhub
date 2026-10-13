export type ActiveTab = 'simulation' | 'model3d' | 'mechanism' | 'literature';

export type CirculationPhase = 'pulmonary' | 'systemic' | 'pressure';

export interface HeartPart {
  id: string;
  nameId: string;
  nameLatin: string;
  category: 'chambers' | 'valves' | 'vessels' | 'muscle';
  gasType: 'co2' | 'o2' | 'mixed' | 'neutral';
  description: string;
  functionDetail: string;
  wallThickness?: string;
  erlanggaNote: string;
}

export interface MechanismStep {
  stepNumber: number;
  title: string;
  action: string;
  valveState: string;
  gasState: 'co2' | 'o2';
  erlanggaQuote: string;
  highlightPart: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  referencePage: string;
}

export interface VesselComparison {
  feature: string;
  artery: string;
  vein: string;
  capillary: string;
}

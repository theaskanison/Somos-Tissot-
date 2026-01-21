export interface SlideProps {
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export enum SlideType {
  INTRO = 'INTRO',
  PARTNERSHIP = 'PARTNERSHIP',
  TECH_EVOLUTION = 'TECH_EVOLUTION',
  CONCEPT_CYCLING = 'CONCEPT_CYCLING',
  CONCEPT_NBA = 'CONCEPT_NBA',
  BUSINESS_MODEL = 'BUSINESS_MODEL',
  GEMINI_DEMO = 'GEMINI_DEMO'
}

export interface InteractiveElementProps {
  title: string;
  description: string;
  triggerLabel: string;
  onTrigger: () => void;
}

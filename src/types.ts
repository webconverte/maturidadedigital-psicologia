export interface AnswerOption {
  text: string;
  points: number;
}

export interface Question {
  id: string;
  pillarId: 'presence' | 'instagram' | 'whatsapp' | 'metrics';
  pillarName: string;
  text: string;
  options: AnswerOption[];
}

export interface QuizScores {
  presence: number;    // Pilar 1: Presença e Visibilidade Local (Q1, Q2)
  instagram: number;   // Pilar 2: Atração e Conteúdo (Q3, Q4, Q5)
  whatsapp: number;    // Pilar 3: Triagem e Conversão (Q6, Q7)
  metrics: number;     // Pilar 4: Dados e Gestão (Q8, Q9, Q10)
}

export type MaturityLevel = 'survival' | 'stagnation' | 'growth' | 'authority';

export interface PersonaDetails {
  level: MaturityLevel;
  minVal: number;
  maxVal: number;
  title: string;       // "Nível Sobrevivência"
  label: string;       // "Sobrevivência"
  color: string;       // HEX/Tailwind class
  badgeColor: string;
  description: string;
  actionPlan: string[];
}

export interface LeadData {
  name: string;
  email: string;
  whatsapp: string;
}

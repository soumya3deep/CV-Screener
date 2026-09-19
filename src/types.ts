export interface CandidateCV {
  id: string;
  name: string;
  fileName: string;
  content: string;
  file?: File;
  source: 'uploaded' | 'sample' | 'pasted';
}

export interface ScoreBreakdown {
  method: string;
  model?: string;
  similarity?: number;
  details?: string;
  [key: string]: any;
}

export interface CandidateResult {
  candidateName: string;
  fileName: string;
  score: number; // 0.00 to 1.00
  tier: 1 | 2 | 3;
  matchedSkills: string[];
  missingSkills: string[];
  pros: string[];
  cons: string[];
  nextAction: string;
  rawBreakdown?: ScoreBreakdown;
}

export interface ScreeningResponse {
  success: boolean;
  count: number;
  results: CandidateResult[];
  error?: string;
}

export interface TierThresholds {
  tier1_min: number; // e.g. 0.75
  tier2_min: number; // e.g. 0.50
}

export type ScoringMethod = 'gemini_ai' | 'tfidf' | 'ollama';

export interface ScreeningSettings {
  tierThresholds: TierThresholds;
  method: ScoringMethod;
  topK: number;
  ollamaModel?: string;
}

export interface HealthResponse {
  status: string;
  ollamaAvailable: boolean;
  ollamaModels: string[];
}

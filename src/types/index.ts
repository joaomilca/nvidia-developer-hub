export type ModelCategory = 'all' | 'llms' | 'rag' | 'vision' | 'voice' | 'biomedical';

export interface NimModel {
  id: string;
  name: string;
  publisher: string;
  category: Exclude<ModelCategory, 'all'>;
  description: string;
  parameters: string;
  contextWindow: string;
  ttftMs: number;
  tokensPerSec: number;
  vramFp8Gb: number;
  recommendedHardware: string;
  tags: string[];
  defaultPrompt: string;
  defaultSystemPrompt: string;
  sampleResponse: string;
}

export type Precision = 'FP4' | 'FP8' | 'INT8' | 'FP16';

export interface GpuRecommendation {
  name: string;
  architecture: string;
  memoryGb: number;
  bandwidthTb: number;
  tdpWatts: number;
  unitsNeeded: number;
  totalVramProvided: number;
  vramUtilizationPct: number;
  estimatedHourlyCost: number;
  efficiencyRating: 'Ideal' | 'Alta' | 'Suportado' | 'Subdimensionado';
  note: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  sources?: GroundingSource[];
  searchQueries?: string[];
  action?: {
    type: 'cal_booking' | 'view_model' | 'gpu_calculator' | 'navigate_section';
    label: string;
    payload?: string;
  };
}

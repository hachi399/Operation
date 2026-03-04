
export interface ExplanationPart {
  id: string;
  type: 'text' | 'image' | 'loading';
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface GeminiExplanationResponse {
  explanation: string;
  visualPrompt: string;
}

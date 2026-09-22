export interface BotConfig {
  greetingMessage: string;
  isGreetingActive: boolean;
  aiApiKey: string;
  aiProvider: string;
  aiBaseUrl: string;
  aiModel: string;
  aiSystemPrompt: string;
  isAiActive: boolean;
}

export interface AutoReplyItem {
  _id: string;
  keyword: string;
  reply: string;
  isActive: boolean;
}

export interface TestAiResult {
  success: boolean;
  reply?: string;
  modelUsed?: string;
  providerUsed?: string;
  error?: string;
}

export const AI_PRESETS: Record<
  string,
  { label: string; baseUrl: string; defaultModel: string; placeholderKey: string }
> = {
  openai: {
    label: 'OpenAI (ChatGPT)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    placeholderKey: 'sk-...',
  },
  deepseek: {
    label: 'DeepSeek AI',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    placeholderKey: 'sk-...',
  },
  groq: {
    label: 'Groq (Ultra-fast LLM)',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    placeholderKey: 'gsk_...',
  },
  gemini: {
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-1.5-flash',
    placeholderKey: 'AIzaSy...',
  },
  openrouter: {
    label: 'OpenRouter (Multi-Model Hub)',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4o-mini',
    placeholderKey: 'sk-or-v1-...',
  },
  anthropic: {
    label: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-5-sonnet-20241022',
    placeholderKey: 'sk-ant-...',
  },
  ollama: {
    label: 'Ollama (Local AI / Self-Hosted)',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    placeholderKey: 'ollama (kosongkan / ketik bebas)',
  },
  custom: {
    label: 'Custom (Semua Endpoint OpenAI-Compatible / Proxy)',
    baseUrl: '',
    defaultModel: 'gpt-4o-mini',
    placeholderKey: 'API key penyedia Anda...',
  },
};

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
  supportsStreaming: boolean;
  supportsJSON: boolean;
  pricing: {
    input: number;
    output: number;
  };
}

export const OPENROUTER_MODELS: AIModel[] = [
  {
    id: "openai/gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient for most tasks",
    maxTokens: 4096,
    contextWindow: 16385,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.0005,
      output: 0.0015
    }
  },
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    description: "Google's powerful language model",
    maxTokens: 8192,
    contextWindow: 32768,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.000125,
      output: 0.000375
    }
  },
  {
    id: "meta-llama/llama-2-70b-chat",
    name: "Llama 2 70B",
    description: "Meta's open-source model",
    maxTokens: 4096,
    contextWindow: 4096,
    supportsStreaming: true,
    supportsJSON: false,
    pricing: {
      input: 0.00075,
      output: 0.00075
    }
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B",
    description: "Lightweight and efficient model",
    maxTokens: 8192,
    contextWindow: 32768,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.00025,
      output: 0.00025
    }
  },
  {
    id: "anthropic/claude-2",
    name: "Claude 2",
    description: "Anthropic's helpful AI assistant",
    maxTokens: 100000,
    contextWindow: 100000,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.008,
      output: 0.024
    }
  },
  {
    id: "perplexity/pplx-7b-chat",
    name: "Perplexity 7B",
    description: "Good for knowledge-based tasks",
    maxTokens: 4096,
    contextWindow: 8192,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.00025,
      output: 0.00025
    }
  },
  {
    id: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo",
    name: "Nous Hermes 2",
    description: "Fine-tuned for instruction following",
    maxTokens: 32768,
    contextWindow: 32768,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.0005,
      output: 0.0005
    }
  },
  {
    id: "openchat/openchat-7b",
    name: "OpenChat 7B",
    description: "Open-source conversational AI",
    maxTokens: 8192,
    contextWindow: 8192,
    supportsStreaming: true,
    supportsJSON: true,
    pricing: {
      input: 0.00025,
      output: 0.00025
    }
  }
];

export const DEFAULT_MODEL = "google/gemini-pro";
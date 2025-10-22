// API Keys Configuration
// For production builds, set these as EAS Secrets
// For local development, use apiKeys.local.js (gitignored)

export const API_KEYS = {
  OPENAI: process.env.EXPO_PUBLIC_OPENAI_API_KEY || "your-openai-key-here",
  CLAUDE: process.env.EXPO_PUBLIC_CLAUDE_API_KEY || "your-claude-key-here",
  MISTRAL: process.env.EXPO_PUBLIC_MISTRAL_API_KEY || "your-mistral-key-here",
  PERPLEXITY: process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY || "your-perplexity-key-here",
  GEMINI: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "your-gemini-key-here",
  DEEPSEEK: process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || "your-deepseek-key-here",
  GROK: process.env.EXPO_PUBLIC_GROK_API_KEY || "your-grok-key-here",
  OPENROUTER: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "your-openrouter-key-here",
};

export const API_ENDPOINTS = {
  OPENAI: "https://api.openai.com/v1/chat/completions",
  CLAUDE: "https://api.anthropic.com/v1/messages",
  MISTRAL: "https://api.mistral.ai/v1/chat/completions",
  PERPLEXITY: "https://api.perplexity.ai/chat/completions",
  GEMINI: "https://generativelanguage.googleapis.com/v1beta/models",
  DEEPSEEK: "https://api.deepseek.com/v1/chat/completions",
  GROK: "https://api.x.ai/v1/chat/completions",
  OPENROUTER: "https://openrouter.ai/api/v1/chat/completions",
};

export const config = {
  apis: {
    openrouter: {
      key: 'OPENROUTER_API_KEY',
      url: 'https://openrouter.ai/api/v1/chat/completions'
    },
    groq: {
      key: 'GROQ_API_KEY',
      url: 'https://api.groq.com/openai/v1/chat/completions'
    },
  },
  routes: {
    chatCompletions: '/v1/chat/completions',
  },
  models: {
    text: {
      modelId: 'openai/gpt-oss-20b:free',
      displayName: 'imaginary-v1-instruct',
    },
    groq: {
      modelId: 'meta-llama/llama-4-scout-17b-16e-instruct',
      displayName: 'imaginary-v1-instruct',
    },
  },
  defaults: {
    chat: {
      maxTokens: 8129,
      temperature: 0.7,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
    },
  },
};
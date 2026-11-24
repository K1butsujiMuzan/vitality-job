export const PROCESSING_CONFIG = {
  SOURCE_URL: 'https://opendata.trudvsem.ru/api/v1/vacancies/region/39',
  DEFAULT_LIMIT: 40,
  MAX_LIMIT: 500,
  CONCURRENCY: 4,
  GROQ_URL: 'https://api.groq.com/openai/v1',
  GROQ_MODEL: 'openai/gpt-oss-20b',
  CLOUDFLARE_API_URL: 'https://api.cloudflare.com/client/v4/accounts',
  CLOUDFLARE_MODEL: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  OLLAMA_URL: 'http://127.0.0.1:11434/v1',
  OLLAMA_MODEL: 'qwen2.5:7b',
  ANALYZER_VERSION: '1',
  LEASE_SECONDS: 330,
} as const

export interface Env {
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;            // default "openai/gpt-oss-120b"
  CF_ACCOUNT_ID?: string;
  AI_GATEWAY_ID?: string;
  WORKERS_AI_MODEL?: string;      // default "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
  TURNSTILE_SECRET_KEY?: string;
  SESSION_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  ALLOWED_ORIGINS?: string;       // comma list, extends defaults; entries may be "https://*.example.pages.dev"
  NOTIFY_UNANSWERED?: string;     // "on" to enable
  GROQ_BASE_URL?: string;         // dev only
  TELEGRAM_API_BASE?: string;     // dev only
  AI?: Ai;                        // Workers AI binding (optional at runtime)
  RATE_KV?: KVNamespace;          // optional
}

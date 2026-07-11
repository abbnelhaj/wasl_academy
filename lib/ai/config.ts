export type WaslAiProvider = "gateway" | "gemini" | "groq" | "local";

export const DEFAULT_WASL_GEMINI_MODEL = "gemini-3.5-flash";
export const DEFAULT_WASL_GATEWAY_MODEL = "openai/gpt-5-mini";
export const DEFAULT_WASL_GROQ_MODEL = "llama-3.1-8b-instant";

function parseWaslAiProvider(value: string | undefined): WaslAiProvider | null {
  const provider = value?.trim().toLowerCase();

  if (
    provider === "gemini" ||
    provider === "gateway" ||
    provider === "groq" ||
    provider === "local"
  ) {
    return provider;
  }

  return null;
}

export function getWaslAiProvider(): WaslAiProvider {
  const provider = parseWaslAiProvider(process.env.WASL_AI_PROVIDER);

  if (provider) {
    return provider;
  }

  if (process.env.GROQ_API_KEY) {
    return "groq";
  }

  if (process.env.GEMINI_API_KEY) {
    return "gemini";
  }

  if (process.env.AI_GATEWAY_API_KEY) {
    return "gateway";
  }

  return "local";
}

export function getWaslAiFallbackProvider(): WaslAiProvider {
  return parseWaslAiProvider(process.env.WASL_AI_FALLBACK_PROVIDER) ?? "gemini";
}

export function getWaslGeminiModel() {
  return process.env.WASL_GEMINI_MODEL?.trim() || DEFAULT_WASL_GEMINI_MODEL;
}

export function getWaslGatewayModel() {
  return process.env.WASL_GATEWAY_MODEL?.trim() || DEFAULT_WASL_GATEWAY_MODEL;
}

export function getWaslGroqModel() {
  return process.env.WASL_GROQ_MODEL?.trim() || DEFAULT_WASL_GROQ_MODEL;
}

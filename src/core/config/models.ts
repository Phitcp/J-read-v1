import { ProviderId } from "@/shared/types/provider";

// Default model suggestions per provider, shown in the UI dropdown until
// dynamic model listing (Phase 2) replaces this with a live API call.
export const DEFAULT_MODELS: Record<ProviderId, string[]> = {
  anthropic: ["claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-opus-4-8"],
  openai: ["gpt-5.1", "gpt-5.1-mini"],
  gemini: ["gemini-3.1-flash-lite"],
};

export const PROVIDER_LABELS: Record<ProviderId, string> = {
  anthropic: "Anthropic (Claude)",
  openai: "OpenAI",
  gemini: "Google Gemini",
};

/** Finds which provider a given model id belongs to, based on DEFAULT_MODELS. */
export function findProviderForModel(model: string): ProviderId | null {
  for (const provider of Object.keys(DEFAULT_MODELS) as ProviderId[]) {
    if (DEFAULT_MODELS[provider].includes(model)) return provider;
  }
  return null;
}

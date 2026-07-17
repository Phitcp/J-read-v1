import { ProviderId } from "@/shared/types/provider";
import { ModelProviderAdapter } from "./types";
import { anthropicAdapter } from "./anthropic";
import { openaiAdapter } from "./openai";
import { geminiAdapter } from "./gemini";

const registry: Record<ProviderId, ModelProviderAdapter> = {
  anthropic: anthropicAdapter,
  openai: openaiAdapter,
  gemini: geminiAdapter,
};

export function getModelProvider(provider: ProviderId): ModelProviderAdapter {
  const adapter = registry[provider];
  if (!adapter) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return adapter;
}

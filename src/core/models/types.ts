import { ProviderConfig } from "@/shared/types/provider";

export interface HealthResult {
  ok: boolean;
  message?: string;
}

/** Base64-encoded image, no "data:...;base64," prefix. */
export interface ImageInput {
  mediaType: string; // e.g. "image/png"
  data: string;
}

/**
 * Every model provider adapter (Anthropic, OpenAI, Gemini, ...) implements
 * this same interface. Adding a new provider only requires a new adapter
 * file + one line in the registry — nothing else in the codebase changes.
 */
export interface ModelProviderAdapter {
  /** Sends a single prompt (optionally with an image) and resolves with the full text response. */
  send(
    config: ProviderConfig,
    systemPrompt: string,
    userPrompt: string,
    image?: ImageInput
  ): Promise<string>;

  /**
   * Sends a single prompt and streams the response back chunk by chunk.
   * POC note: current adapters resolve `send()` first and yield it as one
   * chunk. Callers already iterate over this async generator, so swapping
   * in real token-by-token streaming later won't require touching any
   * call site.
   */
  stream(
    config: ProviderConfig,
    systemPrompt: string,
    userPrompt: string,
    image?: ImageInput
  ): AsyncGenerator<string, void, unknown>;

  /** Lightweight check that the given API key/model config is reachable. */
  health(config: ProviderConfig): Promise<HealthResult>;
}

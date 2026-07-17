export type ProviderId = "anthropic" | "openai" | "gemini";

/** What the client tracks as the "current" choice - no secret material. */
export interface ModelSelection {
  provider: ProviderId;
  model: string;
}

/** What gets sent to our own API routes - includes the resolved active key. */
export interface ProviderConfig extends ModelSelection {
  apiKey: string;
}

/**
 * Thrown by a model provider adapter when it detects a rate-limit, quota,
 * or token-exhaustion response from the provider's API. API routes catch
 * this specifically and respond with HTTP 429 + errorType "quota_exceeded"
 * so the client can rotate to the next API key for the same model.
 */
export class ProviderQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderQuotaError";
  }
}

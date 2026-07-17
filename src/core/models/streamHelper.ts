/**
 * Wraps a `send`-style function into the `stream` shape required by
 * ModelProviderAdapter. Yields the full response as a single chunk.
 * Replace with real SSE/token streaming per-adapter later without
 * changing anything that calls `.stream()`.
 */
export async function* streamFromSend(sendPromise: Promise<string>): AsyncGenerator<string, void, unknown> {
  const text = await sendPromise;
  yield text;
}

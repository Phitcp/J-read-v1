import { ProviderConfig } from "@/shared/types/provider";
import { ModelProviderAdapter, HealthResult } from "./types";
import { streamFromSend } from "./streamHelper";
import { ProviderQuotaError } from "./errors";

async function send(config: ProviderConfig, systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (res.status === 429) {
    const errText = await res.text();
    throw new ProviderQuotaError(`Anthropic rate limit / quota exceeded: ${errText}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("Anthropic response did not contain a text block");
  }
  return textBlock.text as string;
}

async function health(config: ProviderConfig): Promise<HealthResult> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
    });
    if (!res.ok) {
      return { ok: false, message: `Anthropic health check failed (${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Unknown error" };
  }
}

export const anthropicAdapter: ModelProviderAdapter = {
  send,
  stream: (config, systemPrompt, userPrompt) => streamFromSend(send(config, systemPrompt, userPrompt)),
  health,
};

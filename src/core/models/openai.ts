import { ProviderConfig } from "@/shared/types/provider";
import { ModelProviderAdapter, HealthResult, ImageInput } from "./types";
import { streamFromSend } from "./streamHelper";
import { ProviderQuotaError } from "./errors";

async function send(
  config: ProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  image?: ImageInput
): Promise<string> {
  const userContent = image
    ? [
        { type: "text", text: userPrompt },
        { type: "image_url", image_url: { url: `data:${image.mediaType};base64,${image.data}` } },
      ]
    : userPrompt;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) {
    const errText = await res.text();
    throw new ProviderQuotaError(`OpenAI rate limit / quota exceeded: ${errText}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenAI response did not contain message content");
  }
  return text as string;
}

async function health(config: ProviderConfig): Promise<HealthResult> {
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    if (!res.ok) {
      return { ok: false, message: `OpenAI health check failed (${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Unknown error" };
  }
}

export const openaiAdapter: ModelProviderAdapter = {
  send,
  stream: (config, systemPrompt, userPrompt, image) =>
    streamFromSend(send(config, systemPrompt, userPrompt, image)),
  health,
};

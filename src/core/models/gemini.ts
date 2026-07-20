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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const parts: object[] = [{ text: userPrompt }];
  if (image) {
    parts.push({ inlineData: { mimeType: image.mediaType, data: image.data } });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (res.status === 429) {
    const errText = await res.text();
    throw new ProviderQuotaError(`Gemini rate limit / quota exceeded: ${errText}`);
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini response did not contain text content");
  }
  return text as string;
}

async function health(config: ProviderConfig): Promise<HealthResult> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${config.apiKey}`
    );
    if (!res.ok) {
      return { ok: false, message: `Gemini health check failed (${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Unknown error" };
  }
}

export const geminiAdapter: ModelProviderAdapter = {
  send,
  stream: (config, systemPrompt, userPrompt, image) =>
    streamFromSend(send(config, systemPrompt, userPrompt, image)),
  health,
};

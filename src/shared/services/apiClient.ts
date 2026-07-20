import { ModelSelection } from "@/shared/types/provider";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import { QuotaExceededError } from "@/shared/types/errors";
import { callWithKeyRotation } from "@/shared/services/withKeyRotation";
import { IngestResult, ExplainResult } from "@/features/translation/types";
import { WritingReviewResult } from "@/features/writing/types";
import { JlptLevel, ExerciseItem, GrammarCheckResult } from "@/features/grammar/types";
import type { ImageInput } from "@/core/models/types";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (res.status === 429) {
    throw new QuotaExceededError(data.error || "Rate limit / quota exceeded");
  }
  if (!res.ok) {
    throw new Error(data.error || "Có lỗi xảy ra.");
  }
  return data as T;
}

export async function ingestText(
  text: string,
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<IngestResult> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<IngestResult>(res);
  });
}

export async function ocrImage(
  image: ImageInput,
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<IngestResult> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<IngestResult>(res);
  });
}

export async function translateBatch(
  sentences: string[],
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<{ translations: string[] }> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/translate-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentences, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<{ translations: string[] }>(res);
  });
}
export async function explainSentence(
  params: { sentence: string; contextBefore?: string; contextAfter?: string },
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<ExplainResult> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<ExplainResult>(res);
  });
}

export async function reviewWriting(
  text: string,
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<WritingReviewResult> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/writing/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<WritingReviewResult>(res);
  });
}

export async function generateGrammarExercises(
  params: { level: JlptLevel; grammarPoints: string[]; count: number },
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<{ exercises: ExerciseItem[] }> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/grammar/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<{ exercises: ExerciseItem[] }>(res);
  });
}

export async function checkGrammarAnswer(
  params: { exercise: ExerciseItem; userAnswer: string },
  selection: ModelSelection,
  keyManager: ApiKeyManager
): Promise<GrammarCheckResult> {
  return callWithKeyRotation(selection, keyManager, async (apiKey) => {
    const res = await fetch("/api/grammar/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, providerConfig: { ...selection, apiKey } }),
    });
    return parseJsonOrThrow<GrammarCheckResult>(res);
  });
}

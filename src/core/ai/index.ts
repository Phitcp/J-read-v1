import { ProviderConfig } from "@/shared/types/provider";
import { getModelProvider } from "@/core/models/registry";
import { ImageInput } from "@/core/models/types";
import { cleanJsonResponse } from "@/core/utils/json";
import { loadPrompt } from "@/core/prompts/loader";
import { IngestResult, ExplainResult } from "@/features/translation/types";
import { WritingReviewResult } from "@/features/writing/types";
import { ExerciseType, ExerciseItem, GrammarCheckResult, JlptLevel } from "@/features/grammar/types";

/**
 * Splits raw Japanese text into individual sentences.
 * Used by the Translation feature's ingest step.
 */
export async function segmentJapaneseText(
  config: ProviderConfig,
  text: string
): Promise<IngestResult> {
  const provider = getModelProvider(config.provider);
  const raw = await provider.send(config, loadPrompt("translation-segment"), text);
  const cleaned = cleanJsonResponse(raw);

  let parsed: IngestResult;
  try {
    parsed = JSON.parse(cleaned) as IngestResult;
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
  if (!Array.isArray(parsed.sentences)) {
    throw new Error(`Model response did not contain a sentences array: ${raw}`);
  }
  return parsed;
}

/**
 * Reads Japanese text out of an image (OCR) and splits it into sentences.
 * Used by the Translation feature's image-input workflow.
 */
export async function segmentJapaneseImage(
  config: ProviderConfig,
  image: ImageInput
): Promise<IngestResult> {
  const provider = getModelProvider(config.provider);
  const raw = await provider.send(
    config,
    loadPrompt("translation-segment-image"),
    "Read the Japanese text in this image and segment it into sentences.",
    image
  );
  const cleaned = cleanJsonResponse(raw);

  let parsed: IngestResult;
  try {
    parsed = JSON.parse(cleaned) as IngestResult;
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
  if (!Array.isArray(parsed.sentences)) {
    throw new Error(`Model response did not contain a sentences array: ${raw}`);
  }
  return parsed;
}

/**
 * Translates a batch of sentences in one call, one Vietnamese translation
 * per input sentence, same order. Used for the image OCR workflow's
 * side-by-side "scan + translation" view.
 */
export async function translateSentencesBatch(
  config: ProviderConfig,
  sentences: string[]
): Promise<{ translations: string[] }> {
  const provider = getModelProvider(config.provider);
  const userPrompt = JSON.stringify({ sentences });
  const raw = await provider.send(config, loadPrompt("translation-batch"), userPrompt);
  const cleaned = cleanJsonResponse(raw);

  let parsed: { translations: string[] };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
  if (!Array.isArray(parsed.translations) || parsed.translations.length !== sentences.length) {
    throw new Error(
      `Model returned ${parsed.translations?.length ?? 0} translations for ${sentences.length} sentences: ${raw}`
    );
  }
  return parsed;
}

/**
 * Translates a single sentence and explains its grammar/vocab.
 * Used by the Translation feature when the user taps a sentence.
 */
export async function explainSentence(
  config: ProviderConfig,
  params: { sentence: string; contextBefore?: string; contextAfter?: string }
): Promise<ExplainResult> {
  const { sentence, contextBefore, contextAfter } = params;

  const userPrompt = `${contextBefore ? `Previous sentence (context only): ${contextBefore}\n` : ""}Target sentence: ${sentence}${
    contextAfter ? `\nNext sentence (context only): ${contextAfter}` : ""
  }`;

  const provider = getModelProvider(config.provider);
  const raw = await provider.send(config, loadPrompt("translation-explain"), userPrompt);
  const cleaned = cleanJsonResponse(raw);

  try {
    return JSON.parse(cleaned) as ExplainResult;
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
}

/**
 * Evaluates a piece of Japanese writing: score, grammar/spelling mistakes,
 * naturalness, suggestions, and a corrected version.
 * Used by the Writing Practice feature.
 */
export async function reviewWriting(
  config: ProviderConfig,
  text: string
): Promise<WritingReviewResult> {
  const provider = getModelProvider(config.provider);
  const raw = await provider.send(config, loadPrompt("writing"), text);
  const cleaned = cleanJsonResponse(raw);

  try {
    return JSON.parse(cleaned) as WritingReviewResult;
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
}

interface RawGeneratedExercise {
  type: ExerciseType;
  grammar_point: string;
  prompt: string;
  choices?: string[];
}

/**
 * Generates a batch of JLPT grammar exercises for the given level and
 * grammar points. Used by the Grammar Practice feature.
 */
export async function generateGrammarExercises(
  config: ProviderConfig,
  params: { level: JlptLevel; grammarPoints: string[]; count: number }
): Promise<{ exercises: ExerciseItem[] }> {
  const provider = getModelProvider(config.provider);
  const userPrompt = JSON.stringify({
    level: params.level,
    grammar_points: params.grammarPoints,
    count: params.count,
  });

  const raw = await provider.send(config, loadPrompt("grammar-generate"), userPrompt);
  const cleaned = cleanJsonResponse(raw);

  let parsed: { exercises: RawGeneratedExercise[] };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
  if (!Array.isArray(parsed.exercises)) {
    throw new Error(`Model response did not contain an exercises array: ${raw}`);
  }

  const exercises: ExerciseItem[] = parsed.exercises.map((e, i) => ({
    ...e,
    id: `ex-${Date.now()}-${i}`,
  }));

  return { exercises };
}

/**
 * Checks a learner's answer to a grammar exercise and returns full feedback.
 * The caller decides how much of the result to reveal based on attempt count.
 */
export async function checkGrammarAnswer(
  config: ProviderConfig,
  params: { exercise: ExerciseItem; userAnswer: string }
): Promise<GrammarCheckResult> {
  const provider = getModelProvider(config.provider);
  const userPrompt = JSON.stringify({
    type: params.exercise.type,
    grammar_point: params.exercise.grammar_point,
    prompt: params.exercise.prompt,
    user_answer: params.userAnswer,
  });

  const raw = await provider.send(config, loadPrompt("grammar-check"), userPrompt);
  const cleaned = cleanJsonResponse(raw);

  try {
    return JSON.parse(cleaned) as GrammarCheckResult;
  } catch {
    throw new Error(`Failed to parse model response as JSON: ${raw}`);
  }
}

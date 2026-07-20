import fs from "fs";
import path from "path";

const cache = new Map<string, string>();

export type PromptName =
  | "translation-segment"
  | "translation-segment-image"
  | "translation-explain"
  | "translation-batch"
  | "writing"
  | "grammar-generate"
  | "grammar-check"
  | "chat";

/**
 * Loads a prompt markdown file from src/core/prompts/{name}.md.
 * Cached in memory after first read (files don't change at runtime).
 */
export function loadPrompt(name: PromptName): string {
  const cached = cache.get(name);
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "src", "core", "prompts", `${name}.md`);
  const content = fs.readFileSync(filePath, "utf-8").trim();
  cache.set(name, content);
  return content;
}

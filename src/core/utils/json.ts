/**
 * Strips markdown code fences (```json ... ```) that some providers
 * wrap around JSON responses despite being asked not to.
 */
export function cleanJsonResponse(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

import { ModelSelection } from "@/shared/types/provider";
import { QuotaExceededError } from "@/shared/types/errors";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";

/**
 * Calls `request(apiKey)` using the current active key for `selection.model`.
 * If the request throws QuotaExceededError, marks that key exhausted and
 * retries with the next ready key - never switching to another model.
 * Throws a clear Vietnamese error once every key for the model is exhausted.
 */
export async function callWithKeyRotation<T>(
  selection: ModelSelection,
  keyManager: ApiKeyManager,
  request: (apiKey: string) => Promise<T>
): Promise<T> {
  const totalKeys = keyManager.getKeysForModel(selection.model).length;
  if (totalKeys === 0) {
    throw new Error(
      `Chưa có API key nào cho model "${selection.model}". Vào tab "API Key" để thêm.`
    );
  }

  let attempts = 0;
  while (attempts < totalKeys) {
    const active = keyManager.getActiveKey(selection.model);
    if (!active) break;

    try {
      return await request(active.key);
    } catch (err) {
      if (err instanceof QuotaExceededError) {
        keyManager.markKeyExhausted(selection.model, active.id);
        attempts++;
        continue;
      }
      throw err;
    }
  }

  throw new Error(
    `Tất cả API key cho "${selection.model}" đã hết hạn mức. Vui lòng thêm key mới hoặc chuyển sang model khác.`
  );
}

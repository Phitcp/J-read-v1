"use client";

import { ModelSelection } from "@/shared/types/provider";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import { PROVIDER_LABELS, findProviderForModel } from "@/core/config/models";
import ModelStatusCard from "./ModelStatusCard";

interface Props {
  selection: ModelSelection;
  keyManager: ApiKeyManager;
}

export default function ApiKeyManagerPanel({ selection, keyManager }: Props) {
  const otherModels = keyManager
    .getAllModelsWithKeys()
    .filter((m) => m !== selection.model);

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-stone-800">Quản lý API Key</h2>
        <p className="text-sm text-stone-500">
          Mỗi model lưu nhiều key. Khi một key gặp lỗi rate limit / hết hạn mức, hệ thống tự
          động chuyển sang key tiếp theo trong cùng model — không bao giờ tự đổi sang model
          khác.
        </p>
      </header>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs uppercase tracking-wide text-stone-400">Model đang chọn</h3>
        <ModelStatusCard
          model={selection.model}
          providerLabel={PROVIDER_LABELS[selection.provider]}
          keyManager={keyManager}
          highlight
        />
      </section>

      {otherModels.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-wide text-stone-400">Model khác đã có key</h3>
          <div className="flex flex-col gap-3">
            {otherModels.map((m) => {
              const provider = findProviderForModel(m);
              return (
                <ModelStatusCard
                  key={m}
                  model={m}
                  providerLabel={provider ? PROVIDER_LABELS[provider] : "Không xác định"}
                  keyManager={keyManager}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { ModelSelection, ProviderId } from "@/shared/types/provider";
import { DEFAULT_MODELS, PROVIDER_LABELS } from "@/core/config/models";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";

interface Props {
  selection: ModelSelection;
  onChange: (selection: ModelSelection) => void;
  keyManager: ApiKeyManager;
  onGoToKeys: () => void;
}

export default function SettingsPanel({ selection, onChange, keyManager, onGoToKeys }: Props) {
  function updateProvider(provider: ProviderId) {
    onChange({ provider, model: DEFAULT_MODELS[provider][0] });
  }

  const keys = keyManager.getKeysForModel(selection.model);
  const readyCount = keys.filter((k) => k.status === "ready").length;

  return (
    <div className="flex flex-wrap items-center gap-3 border border-stone-300 rounded-sm bg-stone-50 px-4 py-2.5">
      <div className="flex gap-1.5">
        {(Object.keys(PROVIDER_LABELS) as ProviderId[]).map((p) => (
          <button
            key={p}
            onClick={() => updateProvider(p)}
            className={`text-xs py-1.5 px-2.5 rounded-sm border transition-colors ${
              selection.provider === p
                ? "bg-stone-800 text-stone-50 border-stone-800"
                : "bg-white text-stone-600 border-stone-300 hover:border-stone-400"
            }`}
          >
            {PROVIDER_LABELS[p]}
          </button>
        ))}
      </div>

      <select
        value={selection.model}
        onChange={(e) => onChange({ ...selection, model: e.target.value })}
        className="text-sm border border-stone-300 rounded-sm px-2 py-1.5 bg-white text-stone-800"
      >
        {DEFAULT_MODELS[selection.provider].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <button
        onClick={onGoToKeys}
        className="ml-auto flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors"
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            readyCount > 0 ? "bg-emerald-600" : "bg-red-500"
          }`}
        />
        {readyCount > 0 ? `${readyCount} key sẵn sàng` : "Chưa có key khả dụng"}
      </button>
    </div>
  );
}

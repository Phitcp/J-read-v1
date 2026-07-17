"use client";

import { useState } from "react";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import ApiKeyList from "./ApiKeyList";
import CurrentKeyIndicator from "./CurrentKeyIndicator";

interface Props {
  model: string;
  providerLabel: string;
  keyManager: ApiKeyManager;
  highlight?: boolean;
}

export default function ModelStatusCard({ model, providerLabel, keyManager, highlight }: Props) {
  const [newKey, setNewKey] = useState("");

  const keys = keyManager.getKeysForModel(model);
  const activeKey = keyManager.getActiveKey(model);
  const allExhausted = keys.length > 0 && !activeKey;

  function handleAdd() {
    if (!newKey.trim()) return;
    keyManager.addKey(model, newKey);
    setNewKey("");
  }

  return (
    <div
      className={`border rounded-sm px-4 py-3.5 flex flex-col gap-2.5 ${
        highlight ? "border-stone-400 bg-stone-50" : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-stone-800">
          {model} <span className="text-xs text-stone-400 font-normal">· {providerLabel}</span>
        </h3>
        <CurrentKeyIndicator activeKey={activeKey} />
      </div>

      {allExhausted && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          Tất cả API key cho {model} đã hết hạn mức. Vui lòng thêm key mới hoặc chuyển sang model khác.
        </p>
      )}

      <ApiKeyList
        keys={keys}
        onReset={(id) => keyManager.resetKey(model, id)}
        onRemove={(id) => keyManager.removeKey(model, id)}
      />

      <div className="flex gap-2">
        <input
          type="password"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Dán API key mới..."
          className="flex-1 text-sm border border-stone-300 rounded-sm px-2.5 py-1.5 bg-white text-stone-800 font-mono"
        />
        <button
          onClick={handleAdd}
          disabled={!newKey.trim()}
          className="text-xs bg-stone-800 text-stone-50 px-3 py-1.5 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Thêm key
        </button>
      </div>
    </div>
  );
}

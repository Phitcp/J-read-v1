import { ApiKeyEntry } from "@/shared/types/keys";
import ApiKeyStatus from "./ApiKeyStatus";

function maskKey(key: string): string {
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

interface Props {
  keys: ApiKeyEntry[];
  onReset: (keyId: string) => void;
  onRemove: (keyId: string) => void;
}

export default function ApiKeyList({ keys, onReset, onRemove }: Props) {
  if (keys.length === 0) {
    return <p className="text-xs text-stone-400">Chưa có key nào.</p>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {keys.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between gap-2 text-sm bg-white border border-stone-200 rounded-sm px-3 py-1.5"
        >
          <span className="font-mono text-stone-700">{maskKey(k.key)}</span>
          <div className="flex items-center gap-2">
            <ApiKeyStatus status={k.status} />
            {k.status !== "ready" && (
              <button
                onClick={() => onReset(k.id)}
                className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
              >
                Đặt lại
              </button>
            )}
            <button
              onClick={() => onRemove(k.id)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

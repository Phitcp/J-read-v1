import { ApiKeyEntry } from "@/shared/types/keys";

function maskKey(key: string): string {
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}

export default function CurrentKeyIndicator({ activeKey }: { activeKey: ApiKeyEntry | null }) {
  if (!activeKey) {
    return <p className="text-xs text-red-600">Không có key nào đang hoạt động.</p>;
  }
  return (
    <p className="text-xs text-stone-500">
      Đang dùng: <span className="font-mono text-stone-700">{maskKey(activeKey.key)}</span>
    </p>
  );
}

import { KeyStatus } from "@/shared/types/keys";

const LABELS: Record<KeyStatus, string> = {
  ready: "✅ Sẵn sàng",
  limited: "⚠ Giới hạn",
  exhausted: "❌ Hết hạn mức",
};

const COLORS: Record<KeyStatus, string> = {
  ready: "text-emerald-700 bg-emerald-50 border-emerald-200",
  limited: "text-amber-700 bg-amber-50 border-amber-200",
  exhausted: "text-red-700 bg-red-50 border-red-200",
};

export default function ApiKeyStatus({ status }: { status: KeyStatus }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${COLORS[status]}`}>
      {LABELS[status]}
    </span>
  );
}

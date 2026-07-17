"use client";

export type TabId = "translation" | "writing" | "grammar" | "keys";

const TABS: { id: TabId; label: string }[] = [
  { id: "translation", label: "Đọc hiểu" },
  { id: "writing", label: "Luyện viết" },
  { id: "grammar", label: "Luyện ngữ pháp" },
  { id: "keys", label: "API Key" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function Sidebar({ active, onChange }: Props) {
  return (
    <nav className="w-44 shrink-0 border-r border-stone-200 flex flex-col gap-0.5 px-2 py-6">
      <div className="px-2.5 pb-4">
        <span
          className="text-lg font-semibold text-stone-800"
          style={{ fontFamily: "var(--font-jp)" }}
        >
          J-Read
        </span>
      </div>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`text-left text-sm px-2.5 py-2 rounded-sm transition-colors ${
            active === tab.id
              ? "bg-stone-800 text-stone-50"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

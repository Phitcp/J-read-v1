"use client";

import { useMemo, useRef, useState } from "react";
import { GrammarPointDef } from "@/features/grammar/types";

interface Props {
  points: GrammarPointDef[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function GrammarMultiSelect({ points, selected, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return points;
    return points.filter(
      (p) => p.point.toLowerCase().includes(q) || p.meaning.toLowerCase().includes(q)
    );
  }, [points, query]);

  function toggle(point: string) {
    onChange(selected.includes(point) ? selected.filter((p) => p !== point) : [...selected, point]);
  }

  function remove(point: string) {
    onChange(selected.filter((p) => p !== point));
  }

  // Close the dropdown once focus leaves the whole component (input or list).
  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} onBlur={handleBlur} className="relative flex flex-col gap-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((point) => (
            <span
              key={point}
              className="flex items-center gap-1 text-xs bg-stone-800 text-stone-50 rounded-full pl-2.5 pr-1.5 py-1"
            >
              <span style={{ fontFamily: "var(--font-jp)" }}>{point}</span>
              <button
                onClick={() => remove(point)}
                className="text-stone-300 hover:text-white leading-none"
                aria-label={`Bỏ chọn ${point}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Tìm và chọn điểm ngữ pháp..."
        className="w-full text-sm border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-stone-300 rounded-sm shadow-lg z-10">
          {filtered.length === 0 && (
            <p className="text-xs text-stone-400 px-3 py-2">Không tìm thấy điểm ngữ pháp nào.</p>
          )}
          {filtered.map((p) => {
            const isSelected = selected.includes(p.point);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.point)}
                className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 transition-colors ${
                  isSelected ? "bg-stone-100" : "hover:bg-stone-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="accent-stone-800 pointer-events-none"
                />
                <span style={{ fontFamily: "var(--font-jp)" }}>{p.point}</span>
                <span className="text-stone-400">— {p.meaning}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

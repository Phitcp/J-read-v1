"use client";

import { useState } from "react";
import { GrammarPointDef } from "@/features/grammar/types";
import GrammarMultiSelect from "./GrammarMultiSelect";

interface Props {
  points: GrammarPointDef[];
  onSubmit: (selectedPoints: string[], count: number) => void;
  loading: boolean;
}

export default function GrammarSelector({ points, onSubmit, loading }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs uppercase tracking-wide text-stone-400 mb-2">
          Chọn điểm ngữ pháp
        </h3>
        <GrammarMultiSelect points={points} selected={selected} onChange={setSelected} />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-stone-600">Số câu hỏi</label>
        <input
          type="number"
          min={1}
          max={20}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
          className="w-16 text-sm border border-stone-300 rounded-sm px-2 py-1 bg-white text-stone-800"
        />
      </div>

      <button
        onClick={() => onSubmit(selected, count)}
        disabled={selected.length === 0 || loading}
        className="self-start bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Đang tạo bài..." : "Tạo bài luyện tập"}
      </button>
    </div>
  );
}

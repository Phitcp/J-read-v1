"use client";

import { useState } from "react";

interface Props {
  onSubmit: (answer: string) => void;
  loading: boolean;
}

export default function AnswerInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit(value)}
        placeholder="Nhập câu trả lời..."
        className="flex-1 text-base border border-stone-300 rounded-sm px-3 py-2 bg-white text-stone-800"
        style={{ fontFamily: "var(--font-jp)" }}
      />
      <button
        onClick={() => onSubmit(value)}
        disabled={loading || !value.trim()}
        className="bg-stone-800 text-stone-50 text-sm px-4 py-2 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Đang chấm..." : "Nộp bài"}
      </button>
    </div>
  );
}

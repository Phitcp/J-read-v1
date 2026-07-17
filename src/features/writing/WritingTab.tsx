"use client";

import { useState } from "react";
import { ModelSelection } from "@/shared/types/provider";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import { WritingReviewResult } from "@/features/writing/types";
import { reviewWriting } from "@/shared/services/apiClient";
import WritingEditor from "./components/WritingEditor";
import EvaluationCard from "./components/EvaluationCard";
import GrammarErrorCard from "./components/GrammarErrorCard";
import CorrectedText from "./components/CorrectedText";

interface Props {
  selection: ModelSelection;
  keyManager: ApiKeyManager;
}

export default function WritingTab({ selection, keyManager }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WritingReviewResult | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await reviewWriting(text, selection, keyManager);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  }

  function handleWriteAgain() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-stone-800">Luyện viết</h2>
        <p className="text-sm text-stone-500">
          Viết một đoạn văn tiếng Nhật, AI sẽ chấm điểm, chỉ ra lỗi ngữ pháp/chính tả, gợi ý
          cải thiện, và đưa ra bản đã sửa.
        </p>
      </header>

      {!result && (
        <>
          <WritingEditor value={text} onChange={setText} onSubmit={handleSubmit} loading={loading} />
          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {error}
            </p>
          )}
        </>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          <button
            onClick={handleWriteAgain}
            className="self-start text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Viết bài khác
          </button>
          <EvaluationCard
            score={result.score}
            naturalness={result.naturalness}
            suggestions={result.suggestions}
          />
          <GrammarErrorCard title="Lỗi ngữ pháp" mistakes={result.grammar_mistakes} />
          <GrammarErrorCard title="Lỗi chính tả" mistakes={result.spelling_mistakes} />
          <CorrectedText text={result.corrected_version} />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ModelSelection } from "@/shared/types/provider";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import { ExplainResult } from "@/features/translation/types";
import { ingestText, explainSentence } from "@/shared/services/apiClient";
import TranslationToolbar, { TranslationMode } from "./components/TranslationToolbar";
import ReadingView from "./components/ReadingView";
import NormalView from "./components/NormalView";
import ExplainPopover from "./components/ExplainPopover";

interface Props {
  selection: ModelSelection;
  keyManager: ApiKeyManager;
}

export default function TranslationTab({ selection, keyManager }: Props) {
  const [mode, setMode] = useState<TranslationMode>("normal");
  const [inputText, setInputText] = useState("");
  const [sentences, setSentences] = useState<string[] | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestError, setIngestError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState<string | null>(null);

  async function handleStart() {
    if (!inputText.trim()) return;

    if (mode === "normal") {
      // No AI call at all - just display the raw pasted text.
      setSentences([inputText]);
      setIngestError(null);
      return;
    }

    setIngestLoading(true);
    setIngestError(null);
    setSentences(null);

    try {
      const data = await ingestText(inputText, selection, keyManager);
      setSentences(data.sentences);
    } catch (err) {
      setIngestError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setIngestLoading(false);
    }
  }

  async function handleTapSentence(index: number) {
    if (!sentences || mode !== "translate_only") return;
    setActiveIndex(index);
    setExplainResult(null);
    setExplainError(null);
    setExplainLoading(true);

    try {
      const data = await explainSentence(
        {
          sentence: sentences[index],
          contextBefore: index > 0 ? sentences[index - 1] : undefined,
          contextAfter: index < sentences.length - 1 ? sentences[index + 1] : undefined,
        },
        selection,
        keyManager
      );
      setExplainResult(data);
    } catch (err) {
      setExplainError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setExplainLoading(false);
    }
  }

  function closePopover() {
    setActiveIndex(null);
    setExplainResult(null);
    setExplainError(null);
  }

  function reset() {
    setSentences(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-stone-800">Đọc hiểu</h2>
        <p className="text-sm text-stone-500">
          Dán văn bản tiếng Nhật. Ở chế độ Translate Only, tap vào từng câu để xem dịch nghĩa
          và ngữ pháp.
        </p>
      </header>

      <TranslationToolbar mode={mode} onChange={setMode} />

      {!sentences && (
        <div className="flex flex-col gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Dán đoạn văn tiếng Nhật vào đây..."
            rows={10}
            className="w-full resize-none border border-stone-300 rounded-sm px-4 py-3 text-lg leading-relaxed bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            style={{ fontFamily: "var(--font-jp)" }}
          />
          {ingestError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {ingestError}
            </p>
          )}
          <button
            onClick={handleStart}
            disabled={ingestLoading || !inputText.trim()}
            className="self-start bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {ingestLoading ? "Đang xử lý..." : "Bắt đầu đọc"}
          </button>
        </div>
      )}

      {sentences && (
        <div className="flex flex-col gap-4">
          <button
            onClick={reset}
            className="self-start text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Nhập văn bản khác
          </button>
          <div className="bg-white border border-stone-200 rounded-sm px-6 py-6">
            {mode === "translate_only" ? (
              <ReadingView
                sentences={sentences}
                activeIndex={activeIndex}
                onTapSentence={handleTapSentence}
              />
            ) : (
              <NormalView text={sentences.join("")} />
            )}
          </div>
        </div>
      )}

      {activeIndex !== null && sentences && mode === "translate_only" && (
        <ExplainPopover
          sentence={sentences[activeIndex]}
          loading={explainLoading}
          error={explainError}
          result={explainResult}
          onClose={closePopover}
        />
      )}
    </div>
  );
}

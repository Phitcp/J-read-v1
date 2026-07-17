"use client";

import { ExplainResult } from "@/features/translation/types";

interface Props {
  sentence: string;
  loading: boolean;
  error: string | null;
  result: ExplainResult | null;
  onClose: () => void;
}

export default function ExplainPopover({ sentence, loading, error, result, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-900/30 backdrop-blur-[2px]">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full sm:max-w-md max-h-[80vh] overflow-y-auto bg-[#FBF9F4] border border-stone-300 rounded-t-lg sm:rounded-lg shadow-xl">
        <div className="sticky top-0 bg-[#FBF9F4] border-b border-stone-200 px-5 py-3 flex items-start justify-between gap-3">
          <p className="text-lg leading-relaxed text-stone-800" style={{ fontFamily: "var(--font-jp)" }}>
            {sentence}
          </p>
          <button
            onClick={onClose}
            className="shrink-0 text-stone-400 hover:text-stone-700 text-sm mt-0.5"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-stone-500 py-4">
              <span className="inline-block w-3 h-3 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
              Đang dịch...
            </div>
          )}

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {error}
            </div>
          )}

          {result && (
            <>
              <section>
                <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-1">
                  Dịch nghĩa
                </h3>
                <p className="text-base text-stone-800 leading-relaxed">{result.translation}</p>
              </section>

              {result.grammar_points?.length > 0 && (
                <section>
                  <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-1.5">
                    Ngữ pháp
                  </h3>
                  <div className="flex flex-col gap-2">
                    {result.grammar_points.map((g, i) => (
                      <div key={i} className="border-l-2 border-amber-600/40 pl-3">
                        <p className="text-sm font-medium text-stone-800">{g.phrase}</p>
                        <p className="text-sm text-stone-600">{g.explanation}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {result.vocab?.length > 0 && (
                <section>
                  <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-1.5">
                    Từ vựng
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {result.vocab.map((v, i) => (
                      <div key={i} className="flex items-baseline gap-2 text-sm">
                        <span className="text-stone-800" style={{ fontFamily: "var(--font-jp)" }}>
                          {v.word}
                        </span>
                        <span className="text-stone-400 text-xs">{v.reading}</span>
                        <span className="text-stone-600">— {v.meaning}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

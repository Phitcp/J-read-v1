import { GrammarCheckResult } from "@/features/grammar/types";

interface Props {
  result: GrammarCheckResult;
  /** Whether to reveal the correct answer + rewrite suggestions (2nd wrong attempt). */
  revealAnswer: boolean;
}

export default function FeedbackCard({ result, revealAnswer }: Props) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-sm px-5 py-4 border ${
        result.correct
          ? "bg-emerald-50 border-emerald-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <span
        className={`text-xs uppercase tracking-wide ${
          result.correct ? "text-emerald-700" : "text-red-700"
        }`}
      >
        {result.correct ? "Chính xác!" : "Chưa đúng"}
      </span>

      {revealAnswer && !result.correct && (
        <div>
          <h4 className="text-[11px] uppercase tracking-wide text-stone-400 mb-0.5">
            Đáp án đúng
          </h4>
          <p className="text-base text-stone-800" style={{ fontFamily: "var(--font-jp)" }}>
            {result.correct_answer}
          </p>
        </div>
      )}

      <div>
        <h4 className="text-[11px] uppercase tracking-wide text-stone-400 mb-0.5">
          Giải thích
        </h4>
        <p className="text-sm text-stone-700 leading-relaxed">{result.explanation}</p>
      </div>

      <div>
        <h4 className="text-[11px] uppercase tracking-wide text-stone-400 mb-0.5">
          Ghi chú ngữ pháp
        </h4>
        <p className="text-sm text-stone-700 leading-relaxed">{result.grammar_notes}</p>
      </div>

      <div>
        <h4 className="text-[11px] uppercase tracking-wide text-stone-400 mb-0.5">
          Ghi chú từ vựng
        </h4>
        <p className="text-sm text-stone-700 leading-relaxed">{result.vocab_notes}</p>
      </div>

      {revealAnswer && result.rewrite_suggestions?.length > 0 && (
        <div>
          <h4 className="text-[11px] uppercase tracking-wide text-stone-400 mb-0.5">
            Gợi ý viết lại
          </h4>
          <ul className="list-disc list-inside text-sm text-stone-700 flex flex-col gap-1">
            {result.rewrite_suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

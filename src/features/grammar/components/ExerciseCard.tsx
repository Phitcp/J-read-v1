import { ExerciseItem } from "@/features/grammar/types";
import AnswerInput from "./AnswerInput";

const TYPE_LABELS: Record<ExerciseItem["type"], string> = {
  fill_blank: "Điền vào chỗ trống",
  complete_sentence: "Hoàn thành câu",
  translate_vn_to_jp: "Dịch Việt → Nhật",
};

interface Props {
  exercise: ExerciseItem;
  onSubmit: (answer: string) => void;
  loading: boolean;
  attempt: number;
}

export default function ExerciseCard({ exercise, onSubmit, loading, attempt }: Props) {
  return (
    <div className="flex flex-col gap-4 bg-white border border-stone-200 rounded-sm px-5 py-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-stone-400">
          {TYPE_LABELS[exercise.type]}
        </span>
        <span className="text-xs text-stone-400" style={{ fontFamily: "var(--font-jp)" }}>
          {exercise.grammar_point}
        </span>
      </div>

      <p className="text-lg leading-relaxed text-stone-800" style={{ fontFamily: "var(--font-jp)" }}>
        {exercise.prompt}
      </p>

      {exercise.type === "fill_blank" && exercise.choices ? (
        <div className="grid grid-cols-2 gap-2">
          {exercise.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onSubmit(choice)}
              disabled={loading}
              className="text-sm text-left border border-stone-300 rounded-sm px-3 py-2 bg-white hover:border-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-40"
              style={{ fontFamily: "var(--font-jp)" }}
            >
              {choice}
            </button>
          ))}
        </div>
      ) : (
        <AnswerInput key={`${exercise.id}-${attempt}`} onSubmit={onSubmit} loading={loading} />
      )}
    </div>
  );
}

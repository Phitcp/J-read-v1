interface Props {
  score: number;
  naturalness: string;
  suggestions: string[];
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-red-700 bg-red-50 border-red-200";
}

export default function EvaluationCard({ score, naturalness, suggestions }: Props) {
  return (
    <div className="flex flex-col gap-3 bg-white border border-stone-200 rounded-sm px-5 py-4">
      <div className="flex items-center gap-3">
        <span className={`text-2xl font-semibold px-3 py-1 rounded-sm border ${scoreColor(score)}`}>
          {score}
        </span>
        <span className="text-xs text-stone-400 uppercase tracking-wide">Điểm tổng thể</span>
      </div>

      <div>
        <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-1">
          Độ tự nhiên
        </h3>
        <p className="text-sm text-stone-700 leading-relaxed">{naturalness}</p>
      </div>

      {suggestions.length > 0 && (
        <div>
          <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-1">
            Gợi ý cải thiện
          </h3>
          <ul className="list-disc list-inside text-sm text-stone-700 flex flex-col gap-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

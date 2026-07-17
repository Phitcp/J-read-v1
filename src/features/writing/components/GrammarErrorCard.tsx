import { WritingMistake } from "@/features/writing/types";

interface Props {
  title: string;
  mistakes: WritingMistake[];
}

export default function GrammarErrorCard({ title, mistakes }: Props) {
  if (mistakes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 bg-white border border-stone-200 rounded-sm px-5 py-4">
      <h3 className="text-[11px] uppercase tracking-wide text-stone-400">{title}</h3>
      <div className="flex flex-col gap-3">
        {mistakes.map((m, i) => (
          <div key={i} className="border-l-2 border-red-400/50 pl-3 flex flex-col gap-0.5">
            <p className="text-sm text-stone-500 line-through" style={{ fontFamily: "var(--font-jp)" }}>
              {m.original}
            </p>
            <p className="text-sm text-emerald-700" style={{ fontFamily: "var(--font-jp)" }}>
              {m.correct}
            </p>
            <p className="text-sm text-stone-600">{m.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

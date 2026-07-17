import { JlptLevel } from "@/features/grammar/types";

interface Props {
  level: JlptLevel;
  onSelect: (level: JlptLevel) => void;
}

export default function LevelCard({ level, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(level)}
      className="flex items-center justify-center h-20 border border-stone-300 rounded-sm bg-white hover:border-stone-500 hover:bg-stone-50 transition-colors"
    >
      <span className="text-xl font-semibold text-stone-800">{level}</span>
    </button>
  );
}

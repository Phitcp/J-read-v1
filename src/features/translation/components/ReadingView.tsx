"use client";

interface Props {
  sentences: string[];
  activeIndex: number | null;
  onTapSentence: (index: number) => void;
}

export default function ReadingView({ sentences, activeIndex, onTapSentence }: Props) {
  return (
    <div
      className="text-xl leading-loose text-stone-800"
      style={{ fontFamily: "var(--font-jp)" }}
    >
      {sentences.map((s, i) => (
        <span
          key={i}
          onClick={() => onTapSentence(i)}
          className={`cursor-pointer rounded-sm transition-colors ${
            activeIndex === i
              ? "bg-amber-200/60"
              : "hover:bg-amber-100/50"
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

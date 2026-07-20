interface Props {
  original: string[];
  translations: string[];
  activeIndex: number | null;
  onTapSentence: (index: number) => void;
}

export default function DualPanelView({ original, translations, activeIndex, onTapSentence }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-2">
          Bản scan
        </h3>
        <div className="flex flex-col gap-2">
          {original.map((s, i) => (
            <p
              key={i}
              onClick={() => onTapSentence(i)}
              className={`text-lg leading-relaxed cursor-pointer rounded-sm px-1 -mx-1 transition-colors ${
                activeIndex === i ? "bg-amber-200/60" : "hover:bg-amber-100/50"
              }`}
              style={{ fontFamily: "var(--font-jp)" }}
            >
              {s}
            </p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] uppercase tracking-wide text-stone-400 mb-2">
          Bản dịch
        </h3>
        <div className="flex flex-col gap-2">
          {translations.map((t, i) => (
            <p
              key={i}
              onClick={() => onTapSentence(i)}
              className={`text-base leading-relaxed cursor-pointer rounded-sm px-1 -mx-1 transition-colors ${
                activeIndex === i ? "bg-amber-200/60" : "hover:bg-amber-100/50"
              } text-stone-700`}
            >
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

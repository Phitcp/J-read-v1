interface Props {
  text: string;
}

export default function CorrectedText({ text }: Props) {
  return (
    <div className="flex flex-col gap-2 bg-white border border-stone-200 rounded-sm px-5 py-4">
      <h3 className="text-[11px] uppercase tracking-wide text-stone-400">Bản đã sửa</h3>
      <p
        className="text-lg leading-relaxed text-stone-800 whitespace-pre-wrap"
        style={{ fontFamily: "var(--font-jp)" }}
      >
        {text}
      </p>
    </div>
  );
}

export type TranslationMode = "normal" | "translate_only";

interface Props {
  mode: TranslationMode;
  onChange: (mode: TranslationMode) => void;
}

export default function TranslationToolbar({ mode, onChange }: Props) {
  return (
    <div className="flex items-center gap-5 text-sm text-stone-700">
      {/* <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={mode === "normal"}
          onChange={() => onChange("normal")}
          className="accent-stone-800"
        />
        Normal Mode
      </label> */}
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={mode === "translate_only"}
          onChange={() => onChange("translate_only")}
          className="accent-stone-800"
        />
        Translate Only
      </label>
    </div>
  );
}

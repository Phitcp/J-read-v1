interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function WritingEditor({ value, onChange, onSubmit, loading }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Viết đoạn văn tiếng Nhật của bạn ở đây..."
        rows={10}
        className="w-full resize-none border border-stone-300 rounded-sm px-4 py-3 text-lg leading-relaxed bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
        style={{ fontFamily: "var(--font-jp)" }}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="self-start bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Đang chấm..." : "Chấm bài viết"}
      </button>
    </div>
  );
}

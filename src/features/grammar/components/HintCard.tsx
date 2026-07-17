interface Props {
  hint: string;
}

export default function HintCard({ hint }: Props) {
  return (
    <div className="flex flex-col gap-1.5 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
      <span className="text-xs uppercase tracking-wide text-amber-700">
        Chưa đúng — gợi ý
      </span>
      <p className="text-sm text-amber-800">{hint}</p>
      <p className="text-xs text-amber-600">Hãy thử sửa lại câu trả lời và nộp lại nhé.</p>
    </div>
  );
}

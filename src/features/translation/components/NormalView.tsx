interface Props {
  text: string;
}

export default function NormalView({ text }: Props) {
  return (
    <div
      className="text-xl leading-loose text-stone-800 whitespace-pre-wrap"
      style={{ fontFamily: "var(--font-jp)" }}
    >
      {text}
    </div>
  );
}

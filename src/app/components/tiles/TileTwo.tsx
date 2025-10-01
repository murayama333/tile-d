type Props = { html: string; open: boolean; onToggleSize: () => void };

export default function TileTwo({ html, open, onToggleSize }: Props) {
  return (
    <div
      className={`common fixed right-0 top-0 z-[2] bg-slate-100  ${
        open
          ? "opacity-100 pointer-events-auto w-[40vw] h-screen p-8"
          : "opacity-0 pointer-events-none w-[40vw] h-screen p-8"
      }`}
      contentEditable={true}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

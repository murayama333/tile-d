type Props = {
  html: string;
  open: boolean;
  onToggleSize: () => void;
  widthVW: number;
  fade?: boolean;
};

export default function TileTwo({
  html,
  open,
  onToggleSize,
  widthVW,
  fade = true,
}: Props) {
  return (
    <div
      className={`common ${
        fade ? "fade" : ""
      } two fixed right-0 top-0 z-[2] bg-slate-100  ${
        open
          ? "opacity-100 pointer-events-auto h-screen p-8"
          : "opacity-0 pointer-events-none h-screen p-8"
      }`}
      style={{ width: `${widthVW}vw` }}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

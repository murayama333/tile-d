type Props = {
  html: string;
  open: boolean;
  onToggleSize: () => void;
  widthVW: number;
};

export default function TileThree({
  html,
  open,
  onToggleSize,
  widthVW,
}: Props) {
  return (
    <div
      className={`common bg-teal-600 text-white fixed bottom-0 left-0 z-[3] ${
        open
          ? "opacity-100 pointer-events-auto h-[50vh] p-2"
          : "opacity-0 pointer-events-none h-[50vh] p-2"
      }`}
      style={{ width: `${widthVW}vw` }}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

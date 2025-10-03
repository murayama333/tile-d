type Props = {
  html: string;
  open: boolean;
  onToggleSize: () => void;
  widthVW: number;
  topHeightVH: number;
};

export default function TileThree({
  html,
  open,
  onToggleSize,
  widthVW,
  topHeightVH,
}: Props) {
  return (
    <div
      className={`common bg-teal-600 text-white fixed left-0 z-[3] ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{
        width: `${widthVW}vw`,
        top: `${topHeightVH}vh`,
        height: `${100 - topHeightVH}vh`,
      }}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

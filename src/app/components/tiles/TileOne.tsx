type Props = {
  html: string;
  widthVW: number;
  heightVH: number;
  visible: boolean;
  fade?: boolean;
};

export default function TileOne({
  html,
  widthVW,
  heightVH,
  visible,
  fade = true,
}: Props) {
  return (
    <div
      className={`common ${
        fade ? "fade" : ""
      } one bg-white fixed left-0 top-0 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ width: `${widthVW}vw`, height: `${heightVH}vh` }}
      contentEditable={false}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

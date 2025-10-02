type Props = {
  html: string;
  widthVW: number;
  heightVH: number;
  visible: boolean;
};

export default function TileOne({ html, widthVW, heightVH, visible }: Props) {
  return (
    <div
      className={`common one bg-white fixed left-0 top-0 transition-opacity duration-500 ease-in-out ${
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

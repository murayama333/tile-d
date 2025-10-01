type Props = { html: string; widthVW: number; heightVH: number };

export default function TileOne({ html, widthVW, heightVH }: Props) {
  return (
    <div
      className="common bg-white fixed left-0 top-0"
      style={{ width: `${widthVW}vw`, height: `${heightVH}vh` }}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

type Props = { html: string; widthVW: number };

export default function TileOne({ html, widthVW }: Props) {
  return (
    <div
      className="common bg-white fixed left-0 top-0 h-screen"
      style={{ width: `${widthVW}vw` }}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

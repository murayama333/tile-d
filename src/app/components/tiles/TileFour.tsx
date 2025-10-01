type Props = { html: string; open: boolean; widthVW: number };

export default function TileFour({ html, open, widthVW }: Props) {
  return (
    <div
      className={`common bg-teal-900 justify-center text-white fixed bottom-0 left-0 z-[4]  ${
        open
          ? "opacity-100 pointer-events-auto h-[35vh] p-8"
          : "opacity-0 pointer-events-none h-[35vh] p-8"
      }`}
      style={{ width: `${widthVW}vw` }}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

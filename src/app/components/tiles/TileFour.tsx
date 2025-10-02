type Props = { html: string; open: boolean; widthVW: number };

export default function TileFour({ html, open, widthVW }: Props) {
  return (
    <div
      className={`common bg-gradient-to-b from-teal-900 to-teal-800 justify-center text-white font-bold fixed bottom-0 left-0 z-[200] w-[100vw] ${
        open
          ? "opacity-90 pointer-events-auto h-[30vh] p-8"
          : "opacity-0 pointer-events-none h-[30vh] p-8"
      }`}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

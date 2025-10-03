type Props = { html: string; open: boolean; fade?: boolean };

export default function TileFour({ html, open, fade = true }: Props) {
  return (
    <div
      className={`common ${
        fade ? "fade" : ""
      } bg-gradient-to-b from-slate-900 to-slate-800 justify-center text-white fixed bottom-0 left-0 z-[200] w-[100vw] ${
        open
          ? "opacity-95 pointer-events-auto p-8"
          : "opacity-0 pointer-events-none p-8"
      }`}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

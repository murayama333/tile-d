type Props = { html: string; open: boolean };

export default function TileFour({ html, open }: Props) {
  return (
    <div
      className={`common bg-teal-900 justify-center text-white fixed bottom-0 left-0 z-[4]  ${
        open
          ? "opacity-100 pointer-events-auto w-[60vw] h-[35vh] p-8"
          : "opacity-0 pointer-events-none w-[60vw] h-[35vh] p-8"
      }`}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

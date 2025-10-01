type Props = { html: string; open: boolean };

export default function TileFour({ html, open }: Props) {
  return (
    <div
      className={`common four bg-teal-500 text-white fixed bottom-0 left-0 z-[4] flex flex-col justify-center items-start gap-2 transition-opacity duration-500 ease-in-out [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800 ${
        open ? "opacity-100 pointer-events-auto w-[60vw] h-[35vh] p-8" : "opacity-0 pointer-events-none w-[60vw] h-[35vh] p-8"
      }`}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}


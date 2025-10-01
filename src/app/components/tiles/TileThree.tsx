type Props = { html: string; open: boolean; onToggleSize: () => void };

export default function TileThree({ html, open, onToggleSize }: Props) {
  return (
    <div
      className={`common three fixed bottom-0 left-0 z-[3] flex flex-col justify-start items-center overflow-y-scroll transition-opacity duration-500 ease-in-out [&_p]:text-center [&_p]:w-full [&_img]:max-w-full [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800 ${
        open ? "opacity-100 pointer-events-auto w-[60vw] h-[50vh] p-2" : "opacity-0 pointer-events-none w-[60vw] h-[50vh] p-2"
      }`}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}


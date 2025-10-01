export default function TileOne() {
  return (
    <div
      className="common one bg-white fixed left-0 top-0 w-[60vw] h-screen p-8 z-[1] flex flex-col gap-1 overflow-y-scroll [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800"
      contentEditable={true}
    ></div>
  );
}


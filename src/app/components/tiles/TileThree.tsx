export default function TileThree() {
  return (
    <div
      className="common three fixed bottom-0 left-0 w-[60vw] h-[50vh] p-2 z-[3] flex flex-col justify-start items-center overflow-y-scroll opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out [&_p]:text-center [&_p]:w-full [&_img]:max-w-full [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800"
      contentEditable={false}
    ></div>
  );
}


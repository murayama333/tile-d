export default function TileTwo() {
  return (
    <div
      className="common two fixed right-0 top-0 w-[40vw] h-screen p-8 z-[2] overflow-y-scroll flex flex-col items-start justify-center gap-4 bg-[#eee] opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out [&_h3]:text-[1.2rem] [&_h3]:text-left [&_img]:max-w-full [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800"
      contentEditable={true}
    ></div>
  );
}


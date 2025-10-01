export default function TileFour() {
  return (
    <div
      className="common four bg-teal-500 text-white fixed bottom-0 left-0 w-[60vw] h-[35vh] p-8 z-[4] flex flex-col justify-center items-start gap-2 opacity-0 pointer-events-none transition-opacity duration-500 ease-in-out [&_ul]:text-[1.5rem] [&_p]:text-[1.5rem] [&_pre_code]:rounded-[10px] [&_pre_code]:text-[1.20rem] [&_pre_code]:bg-neutral-800"
      contentEditable={true}
    ></div>
  );
}


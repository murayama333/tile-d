export default function ContentsInput() {
  return (
    <div className="common contents-input fixed top-[10vh] left-[10vw] w-[80vw] h-[80vh] z-[100] rounded-[20px] hidden bg-[#0c1116] text-white">
      <textarea
        id="contents"
        placeholder="Contents"
        className="bg-transparent text-white w-full h-full rounded-[20px] border-0 p-8 text-[1.2rem] outline-none"
      ></textarea>
    </div>
  );
}


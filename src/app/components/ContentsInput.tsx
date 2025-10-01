type Props = {
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onClose: () => void;
};

export default function ContentsInput({ value, visible, onChange, onClose }: Props) {
  return (
    <div
      className={`common contents-input fixed top-[10vh] left-[10vw] w-[80vw] h-[80vh] z-[100] rounded-[20px] bg-[#0c1116] text-white ${
        visible ? "block" : "hidden"
      }`}
    >
      <textarea
        id="contents"
        placeholder="Contents"
        className="bg-transparent text-white w-full h-full rounded-[20px] border-0 p-8 text-[1.2rem] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onClose}
        onKeyDown={(e) => {
          if (e.code === "Escape") {
            onClose();
          }
        }}
      ></textarea>
    </div>
  );
}


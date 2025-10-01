type Props = {
  url: string;
  visible: boolean;
  onChange: (value: string) => void;
  onLoad: () => void;
};

export default function UrlInput({ url, visible, onChange, onLoad }: Props) {
  return (
    <div
      className={`common url-input fixed top-[10px] left-[10px] w-screen z-[100] flex items-center gap-2 p-2 ${
        visible ? "block" : "hidden"
      }`}
    >
      <input
        type="text"
        id="url"
        placeholder="URL"
        className="border rounded px-2 py-1 w-[320px] max-w-[60vw] bg-white text-black"
        value={url}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        id="load-url"
        className="px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
        onClick={onLoad}
      >
        Load
      </button>
    </div>
  );
}


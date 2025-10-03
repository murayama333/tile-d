"use client";
type Props = {
  html: string;
  open: boolean;
  onToggleSize: () => void;
  widthVW: number;
  fade?: boolean;
  effect?: "fade" | "reveal";
};

export default function TileTwo({
  html,
  open,
  onToggleSize,
  widthVW,
  fade = true,
  effect = "fade",
}: Props) {
  return (
    <div
      className={`common two fixed right-0 top-0 z-[2] bg-slate-100 p-8 overflow-hidden ${
        effect === "fade"
          ? `${fade ? "fade" : ""} ${
              open
                ? "opacity-100 pointer-events-auto h-screen"
                : "opacity-0 pointer-events-none h-screen"
            }`
          : `reveal-base ${
              open
                ? "reveal-open pointer-events-auto"
                : "reveal-closed pointer-events-none"
            } h-screen`
      }`}
      style={{ width: `${widthVW}vw` }}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

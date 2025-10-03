"use client";
import { useEffect, useRef, useState } from "react";
type Props = {
  html: string;
  open: boolean;
  onToggleSize: () => void;
  widthVW: number;
  topHeightVH: number;
  fade?: boolean;
  effect?: "fade" | "reveal";
};

export default function TileThree({
  html,
  open,
  onToggleSize,
  widthVW,
  topHeightVH,
  fade = true,
  effect = "fade",
}: Props) {
  const [runReveal, setRunReveal] = useState(false);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (effect === "reveal" && !prevOpen.current && open) {
      setRunReveal(true);
      const timer = setTimeout(() => setRunReveal(false), 900);
      prevOpen.current = open;
      return () => clearTimeout(timer);
    }
    prevOpen.current = open;
  }, [open, effect]);
  return (
    <div
      className={`common bg-slate-200 text-white fixed left-0 z-[3] overflow-hidden ${
        effect === "fade"
          ? `${fade ? "fade" : ""} ${
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`
          : `reveal-base ${runReveal ? "reveal-seq" : ""} ${
              open
                ? "reveal-open pointer-events-auto"
                : "reveal-closed pointer-events-none"
            }`
      }`}
      style={{
        width: `${widthVW}vw`,
        top: `${topHeightVH}vh`,
        height: `${100 - topHeightVH}vh`,
      }}
      contentEditable={false}
      onDoubleClick={onToggleSize}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

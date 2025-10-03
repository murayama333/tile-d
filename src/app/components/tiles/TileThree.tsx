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
    <>
      {effect === "fade" ? (
        <div
          className={`common bg-slate-200 text-white fixed left-0 z-[3] ${
            fade ? "fade" : ""
          } ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{
            width: `${widthVW}vw`,
            top: `${topHeightVH}vh`,
            height: `${100 - topHeightVH}vh`,
          }}
          onDoubleClick={onToggleSize}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      ) : (
        <div
          className={`fixed left-0 z-[3] reveal-base ${
            runReveal ? "reveal-seq" : ""
          } ${
            open
              ? "reveal-open pointer-events-auto"
              : "reveal-closed pointer-events-none"
          }`}
          style={{
            width: `${widthVW}vw`,
            top: `${topHeightVH}vh`,
            height: `${100 - topHeightVH}vh`,
            overflow: "hidden",
          }}
        >
          <div
            className="common bg-slate-200 text-white h-full"
            onDoubleClick={onToggleSize}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </>
  );
}

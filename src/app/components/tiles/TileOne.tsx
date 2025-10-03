"use client";
import { useEffect, useRef, useState } from "react";
type Props = {
  html: string;
  widthVW: number;
  heightVH: number;
  visible: boolean;
  fade?: boolean;
  effect?: "fade" | "reveal";
};

export default function TileOne({
  html,
  widthVW,
  heightVH,
  visible,
  fade = true,
  effect = "fade",
}: Props) {
  const [runReveal, setRunReveal] = useState(false);
  const prevVisible = useRef(visible);

  useEffect(() => {
    if (effect === "reveal" && !prevVisible.current && visible) {
      setRunReveal(true);
      const t = setTimeout(() => setRunReveal(false), 900);
      prevVisible.current = visible;
      return () => clearTimeout(t);
    }
    prevVisible.current = visible;
  }, [visible, effect]);
  return (
    <div
      className={`common one bg-white fixed left-0 top-0 overflow-hidden ${
        effect === "fade"
          ? `${fade ? "fade" : ""} ${
              visible
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`
          : `reveal-base ${runReveal ? "reveal-seq" : ""} ${
              visible
                ? "reveal-open pointer-events-auto"
                : "reveal-closed pointer-events-none"
            }`
      }`}
      style={{ width: `${widthVW}vw`, height: `${heightVH}vh` }}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}

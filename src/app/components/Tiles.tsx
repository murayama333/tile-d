"use client";
import TileOne from "./tiles/TileOne";
import TileTwo from "./tiles/TileTwo";
import TileThree from "./tiles/TileThree";
import TileFour from "./tiles/TileFour";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  htmlOne: string;
  htmlTwo: string;
  htmlThree: string;
  htmlFour: string;
  openTwo: boolean;
  openThree: boolean;
  openFour: boolean;
  onToggleTwo: () => void;
  onToggleThree: () => void;
};

export default function Tiles({
  htmlOne,
  htmlTwo,
  htmlThree,
  htmlFour,
  openTwo,
  openThree,
  openFour,
  onToggleTwo,
  onToggleThree,
}: Props) {
  const [leftVW, setLeftVW] = useState(60);
  const rightVW = 100 - leftVW;

  const dragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const vw = (e.clientX / window.innerWidth) * 100;
      const clamped = Math.min(90, Math.max(10, vw));
      setLeftVW(clamped);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <TileOne html={htmlOne} widthVW={leftVW} />
      <div
        className="fixed top-0 left-0 h-screen z-[5] cursor-col-resize"
        style={{ left: `${leftVW}vw`, width: 8 }}
        onMouseDown={onMouseDown}
      />
      <TileTwo
        html={htmlTwo}
        open={openTwo}
        onToggleSize={onToggleTwo}
        widthVW={rightVW}
      />
      <TileThree
        html={htmlThree}
        open={openThree}
        onToggleSize={onToggleThree}
        widthVW={leftVW}
      />
      <TileFour html={htmlFour} open={openFour} widthVW={leftVW} />
    </>
  );
}

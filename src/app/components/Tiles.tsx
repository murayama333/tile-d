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
  const [leftVW, setLeftVW] = useState(100);
  const [topVH, setTopVH] = useState(100);
  const rightVW = 100 - leftVW;

  const dragging = useRef(false);
  const draggingH = useRef(false);
  const prevOpenTwo = useRef(openTwo);
  const prevOpenThree = useRef(openThree);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
  }, []);

  const onMouseDownH = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingH.current = true;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) {
        const vw = (e.clientX / window.innerWidth) * 100;
        const clamped = Math.min(90, Math.max(10, vw));
        setLeftVW(clamped);
      }
      if (draggingH.current) {
        const vh = (e.clientY / window.innerHeight) * 100;
        const clamped = Math.min(90, Math.max(10, vh));
        setTopVH(clamped);
      }
    };
    const onUp = () => {
      dragging.current = false;
      draggingH.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // PanelTwo を開いたときに 60:40 へスナップ
  useEffect(() => {
    if (!prevOpenTwo.current && openTwo) {
      setLeftVW(60);
    }
    prevOpenTwo.current = openTwo;
  }, [openTwo]);

  // PanelThree を開いたときに 上下 50:50 へスナップ
  useEffect(() => {
    if (!prevOpenThree.current && openThree) {
      setTopVH(50);
    }
    prevOpenThree.current = openThree;
  }, [openThree]);

  return (
    <>
      <TileOne html={htmlOne} widthVW={leftVW} heightVH={topVH} />
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
        topHeightVH={topVH}
      />
      <TileFour html={htmlFour} open={openFour} widthVW={leftVW} />
      <div
        className="fixed left-0 z-[6] cursor-row-resize bg-transparent"
        style={{ top: `${topVH}vh`, height: 8, width: `${leftVW}vw` }}
        onMouseDown={onMouseDownH}
      />
    </>
  );
}

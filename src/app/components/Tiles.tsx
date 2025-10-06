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
  openOne?: boolean;
  openTwo: boolean;
  openThree: boolean;
  openFour: boolean;
  onToggleTwo: () => void;
  onToggleThree: () => void;
  layoutVersion?: number;
  fadeEnabled?: boolean;
};

export default function Tiles({
  htmlOne,
  htmlTwo,
  htmlThree,
  htmlFour,
  openOne = true,
  openTwo,
  openThree,
  openFour,
  onToggleTwo,
  onToggleThree,
  layoutVersion = 0,
  fadeEnabled = true,
}: Props) {
  const [leftVW, setLeftVW] = useState(100);
  const [topVH, setTopVH] = useState(100);
  const rightVW = 100 - leftVW;

  // Alt+Drag で赤枠の矩形を描画するための状態
  type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    colorIdx?: number;
  };
  const [selectionRects, setSelectionRects] = useState<Rect[]>([]);
  const [drawingRect, setDrawingRect] = useState<Rect | null>(null);
  const drawingRectRef = useRef<Rect | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  // 既存の矩形ドラッグ移動
  const movingIdxRef = useRef<number | null>(null);
  const movingOffsetRef = useRef<{ dx: number; dy: number } | null>(null);
  // 矩形の右下リサイズ
  const resizingIdxRef = useRef<number | null>(null);
  const resizeStartRef = useRef<{
    sx: number;
    sy: number;
    origW: number;
    origH: number;
  } | null>(null);

  // 枠色のパレット（赤, 青, 緑, 黄, ピンク, オレンジ, 紫）
  const palette = [
    { stroke: "#ef4444", fill: "rgba(239,68,68,0.08)" }, // red-500
    { stroke: "#3b82f6", fill: "rgba(59,130,246,0.08)" }, // blue-500
    { stroke: "#22c55e", fill: "rgba(34,197,94,0.10)" }, // green-500
    { stroke: "#eab308", fill: "rgba(234,179,8,0.12)" }, // yellow-500
    { stroke: "#ec4899", fill: "rgba(236,72,153,0.10)" }, // pink-500
    { stroke: "#f97316", fill: "rgba(249,115,22,0.10)" }, // orange-500
    { stroke: "#a855f7", fill: "rgba(168,85,247,0.10)" }, // purple-500
  ] as const;

  const rectStyle = (r: Rect, idx: number): React.CSSProperties => {
    const chosenIdx =
      r.colorIdx !== undefined ? r.colorIdx : idx % palette.length;
    const c = palette[chosenIdx % palette.length];
    return {
      position: "absolute",
      left: r.x,
      top: r.y,
      width: r.width,
      height: r.height,
      border: `2px solid ${c.stroke}`,
      background: c.fill,
      boxShadow: `0 0 0 1px ${c.stroke}66`,
      pointerEvents: "auto",
    };
  };
  const drawingStart = useRef<{ x: number; y: number } | null>(null);
  const currentDrawColorIdxRef = useRef<number | null>(null);
  const [currentDrawColorIdx, setCurrentDrawColorIdx] = useState<number | null>(
    null
  );
  useEffect(() => {
    currentDrawColorIdxRef.current = currentDrawColorIdx;
  }, [currentDrawColorIdx]);

  // PanelOne が非表示のときの幅配分（重なり防止）
  const twoWidthWhenOneHidden = !openOne
    ? openTwo && openThree
      ? 40
      : openTwo
      ? 100
      : 0
    : rightVW;
  const threeWidthWhenOneHidden = !openOne
    ? openTwo && openThree
      ? 60
      : openThree
      ? 100
      : 0
    : leftVW;
  const threeTopWhenOneHidden = !openOne ? 0 : topVH;

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

  // R/G/B + ドラッグ選択（色付き矩形）の実装
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const colorIdx = currentDrawColorIdxRef.current;
      if (colorIdx === null) return;
      // 既存のドラッグ操作などを抑止
      e.preventDefault();
      drawingStart.current = { x: e.clientX, y: e.clientY };
      const init = {
        x: e.clientX,
        y: e.clientY,
        width: 0,
        height: 0,
        colorIdx,
      };
      setDrawingRect(init);
      drawingRectRef.current = init;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!drawingStart.current) return;
      const { x: sx, y: sy } = drawingStart.current;
      const x = Math.min(sx, e.clientX);
      const y = Math.min(sy, e.clientY);
      const width = Math.abs(e.clientX - sx);
      const height = Math.abs(e.clientY - sy);
      const next = {
        x,
        y,
        width,
        height,
        colorIdx: drawingRectRef.current?.colorIdx,
      } as Rect;
      setDrawingRect(next);
      drawingRectRef.current = next;
    };
    const onMouseUp = () => {
      const rect = drawingRectRef.current;
      if (rect && rect.width > 2 && rect.height > 2) {
        setSelectionRects((prev) => [...prev, rect]);
      }
      setDrawingRect(null);
      drawingRectRef.current = null;
      drawingStart.current = null;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // Alt+Q: すべての矩形を消去
      if (e.altKey && e.code === "KeyQ") {
        setSelectionRects([]);
        setDrawingRect(null);
        drawingRectRef.current = null;
        movingIdxRef.current = null;
        movingOffsetRef.current = null;
        resizingIdxRef.current = null;
        resizeStartRef.current = null;
        return;
      }
      // R/G/B キーで描画色を選択
      if (e.code === "KeyR") {
        setCurrentDrawColorIdx(0); // red
        return;
      }
      if (e.code === "KeyG") {
        setCurrentDrawColorIdx(2); // green
        return;
      }
      if (e.code === "KeyB") {
        setCurrentDrawColorIdx(1); // blue
        return;
      }
      // Y/P は無効化（押しにくいため）
      if ((e.key === "Delete" || e.key === "Backspace") && e.altKey) {
        // Alt+Delete/Alt+Backspace: 直前の矩形を削除（編集中は無効）
        if (editingIdx === null) {
          setSelectionRects((prev) => (prev.length ? prev.slice(0, -1) : prev));
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        // 単独の Delete/Backspace は「描画中の矩形のキャンセル」のみ。既存矩形は削除しない
        if (editingIdx !== null) return;
        if (drawingRectRef.current) {
          setDrawingRect(null);
          drawingRectRef.current = null;
          drawingStart.current = null;
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Alt") drawingStart.current = null;
      // R/G/B キーを離したら描画モード解除
      if (e.code === "KeyR" || e.code === "KeyG" || e.code === "KeyB") {
        setCurrentDrawColorIdx(null);
      }
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // 既存矩形のドラッグ移動
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rIdx = resizingIdxRef.current;
      const rStart = resizeStartRef.current;
      if (rIdx !== null && rStart) {
        // サイズ変更中
        setSelectionRects((prev) => {
          const next = [...prev];
          const r = next[rIdx];
          if (!r) return prev;
          const newW = Math.max(10, rStart.origW + (e.clientX - rStart.sx));
          const newH = Math.max(10, rStart.origH + (e.clientY - rStart.sy));
          next[rIdx] = { ...r, width: newW, height: newH };
          return next;
        });
        return;
      }
      const idx = movingIdxRef.current;
      const off = movingOffsetRef.current;
      if (idx === null || !off) return;
      setSelectionRects((prev) => {
        const next = [...prev];
        const r = next[idx];
        if (!r) return prev;
        next[idx] = { ...r, x: e.clientX - off.dx, y: e.clientY - off.dy };
        return next;
      });
    };
    const onUp = () => {
      movingIdxRef.current = null;
      movingOffsetRef.current = null;
      resizingIdxRef.current = null;
      resizeStartRef.current = null;
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
      // close -> open
      setLeftVW(60);
    } else if (prevOpenTwo.current && !openTwo) {
      // open -> close
      setLeftVW(100);
    }
    prevOpenTwo.current = openTwo;
  }, [openTwo]);

  // PanelThree を開いたときに 上下 50:50 へスナップ
  useEffect(() => {
    if (!prevOpenThree.current && openThree) {
      // close -> open
      setTopVH(45);
    } else if (prevOpenThree.current && !openThree) {
      // open -> close
      setTopVH(100);
    }
    prevOpenThree.current = openThree;
  }, [openThree]);

  // 親からのレイアウトリセット指示（ページ送り時など）
  useEffect(() => {
    setLeftVW(100);
    setTopVH(100);
  }, [layoutVersion]);

  return (
    <>
      <TileOne
        html={htmlOne}
        widthVW={leftVW}
        heightVH={topVH}
        visible={openOne}
        fade={fadeEnabled}
      />
      {openOne && (
        <div
          className="fixed top-0 left-0 h-screen z-[5] cursor-col-resize"
          style={{ left: `${leftVW}vw`, width: 8 }}
          onMouseDown={onMouseDown}
        />
      )}
      <TileTwo
        html={htmlTwo}
        open={openTwo}
        onToggleSize={onToggleTwo}
        widthVW={twoWidthWhenOneHidden}
        fade={fadeEnabled}
        effect="reveal"
      />
      <TileThree
        html={htmlThree}
        open={openThree}
        onToggleSize={onToggleThree}
        widthVW={threeWidthWhenOneHidden}
        topHeightVH={threeTopWhenOneHidden}
        fade={fadeEnabled}
        effect="reveal"
      />
      <TileFour html={htmlFour} open={openFour} fade={fadeEnabled} />
      {openOne && (
        <div
          className="fixed left-0 z-[6] cursor-row-resize bg-transparent"
          style={{ top: `${topVH}vh`, height: 8, width: `${leftVW}vw` }}
          onMouseDown={onMouseDownH}
        />
      )}
      {(selectionRects.length > 0 || drawingRect) && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          {selectionRects.map((r, i) => {
            const chosenIdx =
              r.colorIdx !== undefined ? r.colorIdx : i % palette.length;
            const c = palette[chosenIdx % palette.length];
            return (
              <div
                key={`rect-${i}`}
                style={rectStyle(r, i)}
                onMouseDown={(e) => {
                  if (e.altKey || editingIdx !== null) return;
                  // 左クリックのみ。テキスト選択などを抑止
                  if (e.button !== 0) return;
                  e.preventDefault();
                  movingIdxRef.current = i;
                  movingOffsetRef.current = {
                    dx: e.clientX - r.x,
                    dy: e.clientY - r.y,
                  };
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  setEditingIdx(i);
                  setEditingText(r.text ?? "");
                }}
              >
                {/* 右下リサイズハンドル */}
                <div
                  onMouseDown={(e) => {
                    // 編集中や Alt 操作時はスキップ
                    if (editingIdx !== null || e.button !== 0) return;
                    e.stopPropagation();
                    e.preventDefault();
                    resizingIdxRef.current = i;
                    resizeStartRef.current = {
                      sx: e.clientX,
                      sy: e.clientY,
                      origW: r.width,
                      origH: r.height,
                    };
                  }}
                  style={{
                    position: "absolute",
                    right: -4,
                    bottom: -4,
                    width: 8,
                    height: 8,
                    background: c.stroke,
                    borderRadius: 4,
                    cursor: "nwse-resize",
                    pointerEvents: "auto",
                  }}
                />
                {editingIdx !== i && r.text && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.stroke,
                      fontWeight: 700,
                      textAlign: "center",
                      padding: 8,
                      userSelect: "none",
                    }}
                  >
                    {r.text}
                  </div>
                )}
                {editingIdx === i && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "auto",
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    <input
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => {
                        setSelectionRects((prev) => {
                          const next = [...prev];
                          next[i] = { ...next[i], text: editingText };
                          return next;
                        });
                        setEditingIdx(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        } else if (e.key === "Escape") {
                          setEditingIdx(null);
                        }
                      }}
                      style={{
                        width: "90%",
                        maxWidth: "100%",
                        textAlign: "center",
                        fontWeight: 700,
                        color: c.stroke,
                        border: `2px dashed ${c.stroke}`,
                        padding: "6px 8px",
                        background: "#fff",
                        outline: "none",
                        borderRadius: 6,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {drawingRect && (
            <div style={rectStyle(drawingRect, selectionRects.length)} />
          )}
        </div>
      )}
    </>
  );
}

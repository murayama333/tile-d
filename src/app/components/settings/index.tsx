"use client";

import { Agenda } from "@/app/page";
import { AgendaLoader } from "./AgendaLoader";
import { useEffect, useState } from "react";

type Props = {
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
  clearAgenda: () => void;
  courseTitle: string;
  chapterTitle: string;
  slideTotal: number;
  slideCurrent: number;
  onChangeSlide: (n: number) => void;
};

export const Settings = ({
  url,
  setUrl,
  agenda,
  loadAgenda,
  clearAgenda,
  courseTitle,
  chapterTitle,
  slideTotal,
  slideCurrent,
  onChangeSlide,
}: Props) => {
  const [openAgendaLoader, setOpenAgendaLoader] = useState(false);

  // 初回起動で URL が空欄なら AgendaLoader を開いておく
  useEffect(() => {
    if (!url) setOpenAgendaLoader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full min-h-[35px] bg-teal-950 text-white text-sm py-2 overflow-y-auto z-[100] flex flex-col justify-center">
      <div className="flex justify-between gap-2 items-center px-4">
        <div className="font-bold flex gap-2 items-center">
          <button onClick={() => setOpenAgendaLoader((v) => !v)}>
            SLIDE-D
          </button>
          <div onClick={() => setOpenAgendaLoader((v) => !v)}>
            {agenda.length === 0
              ? "IT講師のための .md ファイルをスライドに変換するツール"
              : `${courseTitle} - ${chapterTitle}`}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-8 px-1 py-0.5 text-right"
            min={1}
            max={Math.max(1, slideTotal)}
            value={slideCurrent}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) onChangeSlide(v);
            }}
            disabled={slideTotal === 0}
          />
          <span>/ {slideTotal}</span>
        </div>
      </div>
      <AgendaLoader
        open={openAgendaLoader}
        url={url}
        setUrl={setUrl}
        loadAgenda={loadAgenda}
        clearAgenda={clearAgenda}
        agenda={agenda}
        onChangeSlide={onChangeSlide}
        onClose={() => setOpenAgendaLoader(false)}
      />
    </div>
  );
};

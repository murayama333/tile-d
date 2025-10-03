"use client";

import { Agenda } from "@/app/page";
import { AgendaLoader } from "./AgendaLoader";
import { useState } from "react";

type Props = {
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
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
  courseTitle,
  chapterTitle,
  slideTotal,
  slideCurrent,
  onChangeSlide,
}: Props) => {
  const [openAgendaLoader, setOpenAgendaLoader] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full min-h-[35px] bg-teal-800 text-white text-sm py-2 px-4 overflow-y-auto z-[100] flex flex-col gap-x-2 justify-center">
      <div className="flex justify-between gap-2 items-center">
        <div className="font-bold flex gap-2 items-center">
          <button onClick={() => setOpenAgendaLoader((v) => !v)}>
            SLIDE-D
          </button>
          <div onClick={() => setOpenAgendaLoader((v) => !v)}>
            {courseTitle} - {chapterTitle}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-12 px-1 py-0.5 text-center"
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
      <div className="flex gap-2 flex-col">
        <AgendaLoader
          open={openAgendaLoader}
          url={url}
          setUrl={setUrl}
          loadAgenda={loadAgenda}
          agenda={agenda}
          onChangeSlide={onChangeSlide}
          onClose={() => setOpenAgendaLoader(false)}
        />
      </div>
    </div>
  );
};

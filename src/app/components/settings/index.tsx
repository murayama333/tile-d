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
}: Props) => {
  const [openAgendaLoader, setOpenAgendaLoader] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full min-h-[35px] bg-teal-800 text-white text-sm py-2 px-4 overflow-y-auto z-[100] flex gap-2 justify-between">
      <div className="flex gap-2">
        <div className="font-bold">
          <button onClick={() => setOpenAgendaLoader((v) => !v)}>TILE-D</button>
        </div>
        <p>
          {courseTitle} - {chapterTitle} - {slideCurrent}/{slideTotal}
        </p>
      </div>

      <div className="flex gap-2 flex-col items-end">
        <button onClick={() => setOpenAgendaLoader((v) => !v)}>Settings</button>
        <AgendaLoader
          open={openAgendaLoader}
          url={url}
          setUrl={setUrl}
          loadAgenda={loadAgenda}
          agenda={agenda}
        />
      </div>
    </div>
  );
};

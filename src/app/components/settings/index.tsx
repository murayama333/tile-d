"use client";

import { Agenda } from "@/app/page";
import { AgendaLoader } from "./AgendaLoader";
import { useState } from "react";

type Props = {
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
};

export const Settings = ({ url, setUrl, agenda, loadAgenda }: Props) => {
  const courseTitle = "CSS基礎知識";
  const chapterTitle = "Part1: CSSとは";
  const pageTitle = "CSS（Cascading Style Sheets）";
  const [openAgendaLoader, setOpenAgendaLoader] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full min-h-[35px] bg-slate-800 text-white text-sm font-bold py-2 px-4 overflow-y-auto z-[100] flex gap-2 justify-between">
      <div className="flex gap-2">
        <div>
          <button onClick={() => setOpenAgendaLoader((v) => !v)}>TILE-D</button>
        </div>
        <p>{courseTitle}</p>
        <p>{chapterTitle}</p>
        <p>{pageTitle}</p>
      </div>

      <div className="flex gap-2 flex-col items-end">
        <button onClick={() => setOpenAgendaLoader((v) => !v)}>Agenda</button>
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

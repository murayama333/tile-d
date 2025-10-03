import { Agenda } from "@/app/page";
import { useEffect } from "react";

type Props = {
  open: boolean;
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
};

export const AgendaLoader = ({
  open,
  url,
  setUrl,
  loadAgenda,
  agenda,
}: Props) => {
  useEffect(() => {
    if (!open) return;
    loadAgenda();
  }, [open, url, loadAgenda]);
  return (
    <div className={`p-4 ${open ? "block" : "hidden"}`}>
      <div className="flex gap-2 items-center mb-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-2 py-1 border border-slate-500 rounded w-[480px] max-w-[70vw]"
        />
        <button onClick={loadAgenda} className="px-3 py-1 rounded bg-slate-800">
          Load
        </button>
      </div>
      <div className="space-y-2">
        {agenda.map((item) => (
          <div key={item.course}>
            <h2 className="font-semibold">{item.course}</h2>
            <div className="ml-2 space-y-1">
              {item.chapters.map((chapter) => (
                <div key={chapter.title}>
                  <h3 className="font-medium">{chapter.title}</h3>
                  <div className="ml-2">
                    {chapter.urls.map((u) => (
                      <div key={u}>
                        <a
                          href={u}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {u}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

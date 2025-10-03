"use client";
import { Agenda } from "@/app/page";
import { useEffect, useMemo, useState } from "react";

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
  const [titles, setTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    loadAgenda();
  }, [open, url, loadAgenda]);

  const allUrls = useMemo(() => {
    const list: string[] = [];
    for (const course of agenda) {
      for (const ch of course.chapters) {
        for (const u of ch.urls) list.push(u);
      }
    }
    return list;
  }, [agenda]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const missing = allUrls.filter((u) => titles[u] === undefined);
    if (missing.length === 0) return;
    const fetchOne = async (u: string) => {
      try {
        const res = await fetch(u, {
          cache: "force-cache",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const m = text.match(/^#\s+(.+)$/m);
        const title = (m?.[1] ?? u).trim();
        return [u, title] as const;
      } catch {
        return [u, u] as const;
      }
    };
    (async () => {
      const results = await Promise.allSettled(missing.map(fetchOne));
      const merged: Record<string, string> = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          const [u, t] = r.value;
          merged[u] = t;
        }
      }
      if (!controller.signal.aborted && Object.keys(merged).length > 0) {
        setTitles((prev) => ({ ...prev, ...merged }));
      }
    })();
    return () => controller.abort();
  }, [open, allUrls, titles]);
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
                          {titles[u] ?? "読み込み中..."}
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

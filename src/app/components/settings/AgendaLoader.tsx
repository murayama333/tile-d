"use client";
import { Agenda } from "@/app/page";
import { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
  onChangeSlide: (n: number) => void;
  onClose: () => void;
};

export const AgendaLoader = ({
  open,
  url,
  setUrl,
  loadAgenda,
  agenda,
  onChangeSlide,
  onClose,
}: Props) => {
  const [titles, setTitles] = useState<Record<string, string>>({});

  // Loadボタン押下時に保存する方針に変更（テキスト変更では保存しない）

  // 初期表示時にローカルストレージから復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem("agendaUrl");
      if (saved && saved !== url) {
        setUrl(saved);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 自動フェッチは行わない（Loadボタンでのみフェッチ）

  // すべての URL をフラット化
  const allUrls = useMemo(() => {
    const list: string[] = [];
    for (const course of agenda) {
      for (const ch of course.chapters) {
        for (const u of ch.urls) list.push(u);
      }
    }
    return list;
  }, [agenda]);

  // コースごとの URL -> スライド番号(1始まり) マップ
  const slideIndexByCourse = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const course of agenda) {
      let i = 1;
      const inner: Record<string, number> = {};
      for (const ch of course.chapters) {
        for (const u of ch.urls) {
          if (inner[u] === undefined) inner[u] = i;
          i++;
        }
      }
      map[course.course] = inner;
    }
    return map;
  }, [agenda]);

  // 見出し(# ...) を各 URL から取得してキャッシュ
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
    <div
      className={`p-4 mt-2 bg-white h-[calc(100vh-35px-4px)] overflow-y-scroll ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="px-2 py-2 text-slate-800 border border-slate-300 rounded w-[45vw] max-w-[70vw] placeholder:text-slate-500 font-bold"
          placeholder="アジェンダページのURLを入力してください"
        />
        <button
          onClick={() => {
            loadAgenda();
            try {
              if (url) localStorage.setItem("agendaUrl", url);
              else localStorage.removeItem("agendaUrl");
            } catch {}
          }}
          className="px-4 py-2 rounded bg-teal-950 border border-slate-300"
        >
          start
        </button>
      </div>
      <div>
        {agenda.map((item) => (
          <div key={item.course}>
            <h2 className="font-semibold">{item.course}</h2>
            <div className="ml-4 space-y-4">
              {item.chapters.map((chapter) => (
                <div key={chapter.title}>
                  <h3 className="font-medium">{chapter.title}</h3>
                  <div className="ml-4">
                    {chapter.urls.map((u) => {
                      const n = slideIndexByCourse[item.course]?.[u];
                      return (
                        <div key={u} className="flex items-center gap-2">
                          <button
                            type="button"
                            className="underline text-left hover:opacity-90"
                            onClick={() => {
                              if (typeof n === "number") {
                                onChangeSlide(n);
                                onClose();
                              }
                            }}
                          >
                            {titles[u] ?? "読み込み中..."}
                          </button>
                          <a
                            href={u}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="外部リンク"
                            className="inline-flex items-center opacity-80 hover:opacity-100"
                            title="外部リンクを開く"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden
                            >
                              <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"></path>
                              <path d="M5 5h7v2H7v10h10v-5h2v7H5V5z"></path>
                            </svg>
                          </a>
                        </div>
                      );
                    })}
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

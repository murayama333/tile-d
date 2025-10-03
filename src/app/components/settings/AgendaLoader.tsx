"use client";
import { Agenda } from "@/app/page";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  url: string;
  setUrl: (v: string) => void;
  agenda: Agenda[];
  loadAgenda: () => void;
  clearAgenda: () => void;
  onChangeSlide: (n: number) => void;
  onClose: () => void;
};

export const AgendaLoader = ({
  open,
  url,
  setUrl,
  loadAgenda,
  clearAgenda,
  agenda,
  onChangeSlide,
  onClose,
}: Props) => {
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const demoDisplayUrl =
    "https://github.com/murayama333/md2slide/blob/main/md/css/agenda.json";
  const demoFetchUrl =
    "https://raw.githubusercontent.com/murayama333/md2slide/refs/heads/main/md/css/agenda.json";

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
  const checkAndLoad = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("JSON の形式が不正です（配列ではありません）");
      }
      // 形式OKなら本体のロード関数を実行
      loadAgenda();
      try {
        if (url) localStorage.setItem("agendaUrl", url);
        else localStorage.removeItem("agendaUrl");
      } catch {}
    } catch (e: any) {
      setError(
        e?.message
          ? `読み込みに失敗しました: ${e.message}`
          : "読み込みに失敗しました"
      );
      // 失敗時は agenda を空に
      clearAgenda();
    } finally {
      setLoading(false);
    }
  };

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
      className={`p-4 mt-2 bg-white text-slate-950 h-[calc(100vh-35px-4px)] overflow-y-scroll ${
        open ? "flex flex-col items-center" : "hidden"
      }`}
    >
      <div className="flex flex-col gap-4 w-[60vw]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="px-2 py-2 text-slate-800 border border-slate-300 rounded w-full placeholder:text-slate-500 font-bold"
            placeholder="アジェンダページのURLを入力してください"
            ref={inputRef}
          />
          <button
            onClick={checkAndLoad}
            disabled={loading}
            className={`px-4 py-2 rounded border border-slate-300 text-white ${
              loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-950"
            }`}
          >
            {loading ? "loading..." : "start"}
          </button>
        </div>
        {error && (
          <div className="mt-2 w-full text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}
        <div className="flex w-full">
          {agenda.length === 0 && (
            <div className="text-center text-slate-500 space-y-2 w-full">
              <p>アジェンダが読み込まれていません。</p>
              <p>
                <a
                  href={demoDisplayUrl}
                  className="underline text-blue-600"
                  onClick={(e) => {
                    e.preventDefault();
                    setError("");
                    setUrl(demoFetchUrl);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                >
                  デモ用スライドのURLはこちらです
                </a>
              </p>
            </div>
          )}
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
    </div>
  );
};

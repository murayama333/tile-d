"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import UrlInput from "./components/UrlInput";
import ContentsInput from "./components/ContentsInput";
import Tiles from "./components/Tiles";
import { Settings } from "./components/settings";

type Parsed = {
  one: string;
  two: string;
  three: string;
  four: string;
};

export type Agenda = {
  course: string;
  chapters: { title: string; urls: string[] }[];
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [raw, setRaw] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [showContents, setShowContents] = useState(false);
  // URL for agenda.json
  const defaultAgendaUrl =
    "https://raw.githubusercontent.com/murayama333/md2slide/refs/heads/main/md/css/agenda.json";
  const [agendaUrl, setAgendaUrl] = useState(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("agendaUrl")
          : null;
      return saved ?? defaultAgendaUrl;
    } catch {
      return defaultAgendaUrl;
    }
  });
  // Agenda state and navigation
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [courseIdx] = useState(0);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [urlIdx, setUrlIdx] = useState(0);
  const [openOne, setOpenOne] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openFour, setOpenFour] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [fadeEnabled, setFadeEnabled] = useState(true);

  const disableFadeTemporarily = useCallback(() => {
    setFadeEnabled(false);
    // 次フレームで再度フェードを有効化
    setTimeout(() => setFadeEnabled(true), 0);
  }, []);

  const fetchUrl = useCallback(async () => {
    if (!url) return;
    const response = await fetch(url);
    const text = await response.text();
    setRaw(text);
  }, [url]);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);

  // 初期表示および agendaUrl 変更時に agenda を取得（定義の後で呼ぶ）
  const loadAgenda = useCallback(async () => {
    try {
      const res = await fetch(agendaUrl, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid agenda format: expected an array");
      }
      setAgenda(data as Agenda[]);
    } catch (err) {
      console.error("Failed to load agenda: ", err);
      setAgenda([]);
    }
  }, [agendaUrl]);

  // When navigation indices change, update url/raw by fetching the selected md
  useEffect(() => {
    const selected = agenda[courseIdx]?.chapters[chapterIdx]?.urls?.[urlIdx];
    if (selected) {
      setUrl(selected);
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx]);

  const gotoNext = useCallback(() => {
    disableFadeTemporarily();
    const c = agenda[courseIdx];
    if (!c) return;
    const ch = c.chapters[chapterIdx];
    if (!ch) return;
    if (urlIdx + 1 < ch.urls.length) {
      setUrlIdx(urlIdx + 1);
      setOpenOne(true);
      setOpenTwo(false);
      setOpenThree(false);
      setOpenFour(false);
      setLayoutVersion((v) => v + 1);
      return;
    }
    if (chapterIdx + 1 < c.chapters.length) {
      setChapterIdx(chapterIdx + 1);
      setUrlIdx(0);
      setOpenOne(true);
      setOpenTwo(false);
      setOpenThree(false);
      setOpenFour(false);
      setLayoutVersion((v) => v + 1);
      return;
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx, disableFadeTemporarily]);

  const gotoPrev = useCallback(() => {
    disableFadeTemporarily();
    if (urlIdx - 1 >= 0) {
      setUrlIdx(urlIdx - 1);
      setOpenOne(true);
      setOpenTwo(false);
      setOpenThree(false);
      setOpenFour(false);
      setLayoutVersion((v) => v + 1);
      return;
    }
    if (chapterIdx - 1 >= 0) {
      const c = agenda[courseIdx];
      const prevCh = c?.chapters[chapterIdx - 1];
      if (!prevCh) return;
      setChapterIdx(chapterIdx - 1);
      setUrlIdx(prevCh.urls.length - 1);
      setOpenOne(true);
      setOpenTwo(false);
      setOpenThree(false);
      setOpenFour(false);
      setLayoutVersion((v) => v + 1);
      return;
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx, disableFadeTemporarily]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.altKey) {
        e.preventDefault();
        if (e.code === "Digit0" || e.code === "Numpad0") {
          disableFadeTemporarily();
          setOpenOne(false);
          setOpenTwo(false);
          setOpenThree(false);
          setOpenFour(false);
        } else if (e.code === "Digit1" || e.code === "Numpad1") {
          setOpenOne((v) => !v);
        } else if (e.code === "Digit2" || e.code === "Numpad2") {
          setOpenTwo((v) => !v);
        } else if (e.code === "Digit3" || e.code === "Numpad3") {
          setOpenThree((v) => !v);
        } else if (e.code === "Digit4" || e.code === "Numpad4") {
          setOpenFour((v) => !v);
        } else if (e.key === "ArrowRight") {
          if (!openTwo) setOpenTwo(true);
          else if (!openThree) setOpenThree(true);
          else if (!openFour) setOpenFour(true);
          else {
            // PanelFour まで開いている場合は次ページへ（Alt+Down と同等）
            gotoNext();
          }
        } else if (e.key === "ArrowLeft") {
          // 逆順に閉じていき、全て閉なら前ページへ
          if (openFour) setOpenFour(false);
          else if (openThree) setOpenThree(false);
          else if (openTwo) setOpenTwo(false);
          else {
            gotoPrev();
          }
        } else if (e.code === "KeyF") {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          }
        } else if (e.code === "KeyU") {
          setShowUrl((v) => !v);
        } else if (e.code === "KeyC") {
          setShowContents((v) => !v);
        } else if (e.code === "ArrowDown") {
          gotoNext();
        } else if (e.code === "ArrowUp") {
          gotoPrev();
        }
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [openOne, openTwo, openThree, openFour, gotoNext, gotoPrev]);

  const parsed: Parsed = useMemo(() => {
    const parts = raw.split(/^##\s/m);
    const adjustFirstLine = (s: string) => {
      if (s.startsWith("サンプルコード\n"))
        return s.replace("サンプルコード\n", "");
      if (s.startsWith("イメージ\n")) return s.replace("イメージ\n", "");
      if (s.startsWith("実行結果\n")) return s.replace("実行結果\n", "");
      if (s.startsWith("ポイント")) return s.replace("ポイント", "");
      return s;
    };
    const [p1 = "", p2 = "", p3 = "", p4 = ""] = parts;
    return {
      one: adjustFirstLine(p1),
      two: adjustFirstLine(p2),
      three: adjustFirstLine(p3),
      four: adjustFirstLine(p4),
    };
  }, [raw]);

  useEffect(() => {
    marked.use(
      markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        },
      })
    );
  }, []);

  const html = useMemo(() => {
    if (!mounted) return { one: "", two: "", three: "", four: "" };
    const render = (md: string) => marked.parse(md) as string;
    return {
      one: render(parsed.one),
      two: render(parsed.two),
      three: render(parsed.three),
      four: render(parsed.four),
    };
  }, [parsed, mounted]);

  // 初期表示時のみ agenda を取得（テキスト変更ではフェッチしない）
  useEffect(() => {
    loadAgenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      hljs.highlightAll();
    } catch {}
  }, [html, mounted]);

  const courseTitle = agenda[courseIdx]?.course ?? "";
  const chapterTitle = agenda[courseIdx]?.chapters?.[chapterIdx]?.title ?? "";
  const slideTotal = useMemo(() => {
    const c = agenda[courseIdx];
    if (!c) return 0;
    return c.chapters.reduce((sum, ch) => sum + (ch.urls?.length ?? 0), 0);
  }, [agenda, courseIdx]);
  const slideCurrent = useMemo(() => {
    const c = agenda[courseIdx];
    if (!c) return 0;
    let count = 0;
    for (let i = 0; i < chapterIdx; i++) {
      count += c.chapters[i]?.urls?.length ?? 0;
    }
    const within = c.chapters[chapterIdx]?.urls?.length ?? 0;
    return count + Math.min(urlIdx + 1, within);
  }, [agenda, courseIdx, chapterIdx, urlIdx]);

  const goToSlide = useCallback(
    (n: number) => {
      const c = agenda[courseIdx];
      if (!c || n <= 0) return;
      let remain = Math.min(
        n,
        c.chapters.reduce((s, ch) => s + (ch.urls?.length ?? 0), 0)
      );
      let chIdx = 0;
      while (chIdx < c.chapters.length) {
        const len = c.chapters[chIdx]?.urls?.length ?? 0;
        if (remain <= len) {
          setChapterIdx(chIdx);
          setUrlIdx(Math.max(0, remain - 1));
          setOpenOne(true);
          setOpenTwo(false);
          setOpenThree(false);
          setOpenFour(false);
          setLayoutVersion((v) => v + 1);
          return;
        }
        remain -= len;
        chIdx++;
      }
    },
    [agenda, courseIdx]
  );

  const toggleTwoSize = useCallback(() => {
    // 100vw/100vh <-> 40vw/100vh 相当の切替は、ここでは open 状態のままにして、
    // 実装簡略化のためサイズ固定のままとします。必要なら state を増やして切替可能です。
  }, []);
  const toggleThreeSize = useCallback(() => {
    // 60vw/50vh <-> 100vw/100vh 相当の切替も同様に省略。必要なら拡張します。
  }, []);

  return (
    <div>
      <Settings
        url={agendaUrl}
        setUrl={setAgendaUrl}
        agenda={agenda}
        loadAgenda={loadAgenda}
        courseTitle={courseTitle}
        chapterTitle={chapterTitle}
        slideTotal={slideTotal}
        slideCurrent={slideCurrent}
        onChangeSlide={goToSlide}
      />
      <UrlInput
        url={url}
        visible={showUrl}
        onChange={setUrl}
        onLoad={fetchUrl}
      />
      <ContentsInput
        value={raw}
        visible={showContents}
        onChange={setRaw}
        onClose={() => setShowContents(false)}
      />
      <Tiles
        htmlOne={html.one}
        htmlTwo={html.two}
        htmlThree={html.three}
        htmlFour={html.four}
        openOne={openOne}
        openTwo={openTwo}
        openThree={openThree}
        openFour={openFour}
        onToggleTwo={toggleTwoSize}
        onToggleThree={toggleThreeSize}
        layoutVersion={layoutVersion}
        fadeEnabled={fadeEnabled}
      />
    </div>
  );
}

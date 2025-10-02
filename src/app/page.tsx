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
  // Agenda state and navigation
  const [agenda, setAgenda] = useState<Agenda[]>([]);
  const [courseIdx, setCourseIdx] = useState(0);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [urlIdx, setUrlIdx] = useState(0);
  const [openOne, setOpenOne] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const [openFour, setOpenFour] = useState(false);
  const [mounted, setMounted] = useState(false);

  const defaultMdUrl =
    "https://raw.githubusercontent.com/murayama333/md2slide/refs/heads/main/md/css/part1/02_css.md";

  const fetchUrl = useCallback(async () => {
    const target = url === "" ? defaultMdUrl : url;
    const response = await fetch(target);
    const text = await response.text();
    setRaw(text);
  }, [url]);

  useEffect(() => {
    fetchUrl();
  }, [fetchUrl]);
  const loadAgenda = useCallback(async () => {
    try {
      const res = await fetch("/agenda.json");
      const data = (await res.json()) as Agenda[];
      setAgenda(data);
    } catch {}
  }, []);

  // When navigation indices change, update url/raw by fetching the selected md
  useEffect(() => {
    const selected = agenda[courseIdx]?.chapters[chapterIdx]?.urls?.[urlIdx];
    if (selected) {
      setUrl(selected);
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx]);

  const gotoNext = useCallback(() => {
    const c = agenda[courseIdx];
    if (!c) return;
    const ch = c.chapters[chapterIdx];
    if (!ch) return;
    if (urlIdx + 1 < ch.urls.length) {
      setUrlIdx(urlIdx + 1);
      return;
    }
    if (chapterIdx + 1 < c.chapters.length) {
      setChapterIdx(chapterIdx + 1);
      setUrlIdx(0);
      return;
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx]);

  const gotoPrev = useCallback(() => {
    if (urlIdx - 1 >= 0) {
      setUrlIdx(urlIdx - 1);
      return;
    }
    if (chapterIdx - 1 >= 0) {
      const c = agenda[courseIdx];
      const prevCh = c?.chapters[chapterIdx - 1];
      if (!prevCh) return;
      setChapterIdx(chapterIdx - 1);
      setUrlIdx(prevCh.urls.length - 1);
      return;
    }
  }, [agenda, courseIdx, chapterIdx, urlIdx]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.altKey) {
        e.preventDefault();
        if (e.code === "Digit0" || e.code === "Numpad0") {
          setOpenOne(true);
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
        } else if ((e as any).key === "ArrowRight") {
          if (!openTwo) setOpenTwo(true);
          else if (!openThree) setOpenThree(true);
          else if (!openFour) setOpenFour(true);
          else {
            setOpenTwo(false);
            setOpenThree(false);
            setOpenFour(false);
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

  useEffect(() => {
    if (!mounted) return;
    try {
      hljs.highlightAll();
    } catch {}
  }, [html, mounted]);

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
        url={"/agenda.json"}
        setUrl={() => {}}
        agenda={agenda}
        loadAgenda={loadAgenda}
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
      />
    </div>
  );
}

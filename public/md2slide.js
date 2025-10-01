const { markedHighlight } = window.markedHighlight;
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  })
);

const togglePanel = (number) => {
  if (number === 0) {
    hidePanels();
  } else if (number === 2) {
    togglePanelInternal(".two");
  } else if (number === 3) {
    togglePanelInternal(".three");
  } else if (number === 4) {
    togglePanelInternal(".four");
  }
  flash();
};

const hidePanels = () => {
  hidePanel(document.querySelector(".two"));
  hidePanel(document.querySelector(".three"));
  hidePanel(document.querySelector(".four"));
};

const flash = () => {
  const common = document.querySelector(".common");
  common.style.backgroundColor = "lightyellow";
  setTimeout(() => {
    common.style.backgroundColor = "";
  }, 200);
};

const nextPanel = () => {
  const two = document.querySelector(".two");
  const three = document.querySelector(".three");
  const four = document.querySelector(".four");
  if (two.classList.contains("is-open")) {
    if (three.classList.contains("is-open")) {
      if (four.classList.contains("is-open")) {
        hidePanels();
      } else {
        openPanel(four);
      }
    } else {
      openPanel(three);
    }
  } else {
    openPanel(two);
  }
  flash();
};

const togglePanelInternal = (panelClass) => {
  const panel = document.querySelector(panelClass);
  if (panel.classList.contains("is-open")) {
    hidePanel(panel);
  } else {
    openPanel(panel);
  }
};
const openPanel = (panel) => {
  panel.classList.add("is-open");
  panel.classList.add("opacity-100", "pointer-events-auto");
  panel.classList.remove("opacity-0", "pointer-events-none");
};
const hidePanel = (panel) => {
  panel.classList.remove("is-open");
  panel.classList.remove("opacity-100", "pointer-events-auto");
  panel.classList.add("opacity-0", "pointer-events-none");
};

const fetchURL = async () => {
  const urlValue = document.querySelector("#url").value;
  const url =
    urlValue === ""
      ? "https://raw.githubusercontent.com/murayama333/md2slide/refs/heads/main/md/css/part1/02_css.md"
      : urlValue;
  const response = await fetch(url);
  const md = await response.text();
  setContents(md);
};

const fetchContents = () => {
  const contentsValue = document.querySelector("#contents").value;
  setContents(contentsValue);
};

const setContents = async (md) => {
  const mdParts = md.split(/^##\s/m);
  const oneContents = marked.parse(adjustFirstLine(mdParts[0]));
  document.querySelector(".one").innerHTML = oneContents;
  const twoContents = marked.parse(adjustFirstLine(mdParts[1]));
  document.querySelector(".two").innerHTML = twoContents;
  const threeContents = marked.parse(adjustFirstLine(mdParts[2]));
  document.querySelector(".three").innerHTML = threeContents;
  const fourContents = marked.parse(adjustFirstLine(mdParts[3]));
  document.querySelector(".four").innerHTML = fourContents;
};

const keydown = (e) => {
  if (e.altKey) {
    e.preventDefault();
    if (e.code === "Digit0" || e.code === "Numpad0") {
      togglePanel(0);
    } else if (e.code === "Digit2" || e.code === "Numpad2") {
      togglePanel(2);
    } else if (e.code === "Digit3" || e.code === "Numpad3") {
      togglePanel(3);
    } else if (e.code === "Digit4" || e.code === "Numpad4") {
      togglePanel(4);
    } else if (e.key === "ArrowRight") {
      console.log("ArrowRight");
      nextPanel();
    } else if (e.code === "KeyF") {
      console.log("f");
      if (document.documentElement.requestFullscreen) {
        console.log("f2");
        document.documentElement.requestFullscreen();
      }
    } else if (e.code === "KeyU") {
      toggleController(document.querySelector(".url-input"));
    } else if (e.code === "KeyC") {
      toggleController(document.querySelector(".contents-input"));
    }
  }
};

const toggleController = (controller) => {
  if (controller.style.display === "none") {
    controller.style.display = "block";
    console.log("block");
  } else {
    controller.style.display = "none";
    console.log("none");
  }
};

const adjustFirstLine = (string) => {
  if (string.startsWith("サンプルコード\n")) {
    return string.replace("サンプルコード\n", "");
  } else if (string.startsWith("実行結果\n")) {
    return string.replace("実行結果\n", "");
  } else if (string.startsWith("ポイント")) {
    return string.replace("ポイント", "");
  }
  return string;
};

const toggle = (panel, size1, size2) => {
  if (panel.style.width === size1.width) {
    panel.style.width = size2.width;
    panel.style.height = size2.height;
  } else {
    panel.style.width = size1.width;
    panel.style.height = size1.height;
  }

  hljs.highlightAll();
};

/* Event Listeners */
window.addEventListener("load", fetchURL);
window.addEventListener("keydown", keydown);
const two = document.querySelector(".two");
two.addEventListener("dblclick", () => {
  toggle(
    two,
    { width: "100vw", height: "100vh" },
    { width: "40vw", height: "100vh" }
  );
});
const three = document.querySelector(".three");
three.addEventListener("dblclick", () => {
  toggle(
    three,
    { width: "60vw", height: "50vh" },
    { width: "100vw", height: "100vh" }
  );
});

document.querySelector("#load-url").addEventListener("click", fetchURL);

const contents = document.querySelector("#contents");
contents.addEventListener("blur", () => {
  if (document.querySelector(".contents-input").style.display === "block") {
    fetchContents();
    toggleController(document.querySelector(".contents-input"));
  }
});
contents.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (document.querySelector(".contents-input").style.display === "block") {
      fetchContents();
      toggleController(document.querySelector(".contents-input"));
      console.log("escape");
    }
  }
});

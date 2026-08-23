const logEl = document.querySelector("#terminal-log");
const formEl = document.querySelector("#tui-form");
const inputEl = document.querySelector("#tui-input");
const clockEl = document.querySelector("#clock");
const startBtn = document.querySelector("#start-btn");
const startMenu = document.querySelector("#start-menu");
const enrollForm = document.querySelector("#enroll-form");
const enrollDialog = document.querySelector("#enroll-dialog");
const enrollDialogBody = document.querySelector("#enroll-dialog-body");
const progressWindow = document.querySelector("#window-progress");

const works = {
  solitude: { artist: "Marina Chen", price: "8.5 ETH" },
  "urban dreams": { artist: "James Wright", price: "5.2 ETH" },
  metamorphosis: { artist: "Sofia Laurent", price: "12 ETH" },
  "digital bloom": { artist: "Alex Kim", price: "6.8 ETH" },
};

const bootLines = [
  "ClayMint OS [Version 95.01]",
  "(c) 1998-2026 Atelier Corp. No rights reserved.",
  "",
  "Type help for the curriculum. Type mint <work> to mint.",
  "",
];

function printLine(text) {
  if (!logEl) {
    return;
  }
  logEl.textContent += `${text}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function printBoot() {
  if (!logEl) {
    return;
  }
  logEl.textContent = bootLines.join("\n");
}

function mintWork(name) {
  const key = name.trim().toLowerCase();
  const work = works[key];
  if (!work) {
    printLine(`error: unknown work "${name}"`);
    printLine("available: solitude | urban dreams | metamorphosis | digital bloom");
    return;
  }
  const token = String(Math.floor(Math.random() * 900) + 42).padStart(3, "0");
  printLine(`minting "${name}" by ${work.artist}...`);
  printLine(`reserve ${work.price}`);
  printLine(`tx 0xAMBA${token} confirmed`);
  printLine(`token #${token} dropped into /gallery/you`);
}

function runCommand(raw) {
  const line = raw.trim();
  printLine(`$ ${line || " "}`);
  if (!line) {
    return;
  }
  const [cmd, ...rest] = line.split(/\s+/u);
  const arg = rest.join(" ");
  switch (cmd.toLowerCase()) {
    case "help":
      printLine("help     show this lesson plan");
      printLine("ls       list curated works");
      printLine("mint     mint <work>");
      printLine("enroll   jump to free trial");
      printLine("whoami   identity crisis");
      printLine("clear    wipe the CRT");
      break;
    case "ls":
      printLine("solitude.nft");
      printLine("urban-dreams.nft");
      printLine("metamorphosis.nft");
      printLine("digital-bloom.nft");
      printLine("progress.exe");
      printLine("guestbook.html");
      break;
    case "mint":
      mintWork(arg || "solitude");
      break;
    case "enroll":
      printLine("opening enrollment.wizard...");
      document.querySelector("#enroll")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "whoami":
      printLine("student@claymint — also a collector, also Clippy");
      break;
    case "clear":
      printBoot();
      break;
    case "date":
      printLine(new Date().toString());
      break;
    default:
      printLine(`command not found: ${cmd}`);
      printLine("hint: this shell grades effort, not syntax. try help");
      break;
  }
}

function tickClock() {
  if (!clockEl) {
    return;
  }
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  clockEl.dateTime = now.toISOString();
}

function setStartOpen(open) {
  if (!startBtn || !startMenu) {
    return;
  }
  startBtn.setAttribute("aria-expanded", String(open));
  startMenu.hidden = !open;
}

function fillBars() {
  for (const bar of document.querySelectorAll(".win-bar span[data-fill]")) {
    bar.style.width = `${bar.dataset.fill}%`;
  }
}

function bumpHits() {
  const key = "claymint-hits";
  const next = Number(localStorage.getItem(key) || "384721") + 1;
  localStorage.setItem(key, String(next));
  for (const el of document.querySelectorAll("[data-hit-counter]")) {
    el.textContent = String(next).padStart(6, "0");
  }
}

printBoot();
tickClock();
setInterval(tickClock, 30_000);
bumpHits();

formEl?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = inputEl?.value ?? "";
  runCommand(value);
  if (inputEl) {
    inputEl.value = "";
  }
});

startBtn?.addEventListener("click", () => {
  const open = startBtn.getAttribute("aria-expanded") !== "true";
  setStartOpen(open);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }
  if (startMenu && startBtn && !startMenu.contains(target) && !startBtn.contains(target)) {
    setStartOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setStartOpen(false);
    enrollDialog?.close();
  }
});

startMenu?.addEventListener("click", () => {
  setStartOpen(false);
});

enrollForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(enrollForm);
  const name = String(data.get("name") || "bạn");
  const track = String(data.get("track") || "web");
  if (enrollDialogBody) {
    enrollDialogBody.textContent = `${name} đã ghi danh lộ trình ${track}. Clippy sẽ gửi homework lúc 3:14 AM.`;
  }
  enrollDialog?.showModal();
});

document.querySelector("[data-close-dialog]")?.addEventListener("click", () => {
  enrollDialog?.close();
});

for (const btn of document.querySelectorAll("[data-enroll]")) {
  btn.addEventListener("click", () => {
    const track = btn.getAttribute("data-enroll");
    const select = enrollForm?.querySelector("select[name='track']");
    if (select && track) {
      select.value = track;
    }
    document.querySelector("#enroll")?.scrollIntoView({ behavior: "smooth" });
  });
}

document.querySelector("[data-close-window]")?.addEventListener("click", () => {
  if (progressWindow) {
    progressWindow.hidden = true;
  }
});

document.querySelector("[data-open-window='progress']")?.addEventListener("click", () => {
  if (progressWindow) {
    progressWindow.hidden = false;
  }
  document.querySelector("#progress")?.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("[data-open-window='recycle']")?.addEventListener("click", () => {
  document.querySelector("#stories")?.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("[data-scroll='#mint']")?.addEventListener("click", () => {
  document.querySelector("#mint")?.scrollIntoView({ behavior: "smooth" });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion) {
  fillBars();
} else if ("IntersectionObserver" in window && progressWindow) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          fillBars();
          observer.disconnect();
        }
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(progressWindow);
} else {
  fillBars();
}

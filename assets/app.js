const logEl = document.querySelector("#terminal-log");
const formEl = document.querySelector("#tui-form");
const inputEl = document.querySelector("#tui-input");
const clockEl = document.querySelector("#clock");
const startBtn = document.querySelector("#start-btn");
const startMenu = document.querySelector("#start-menu");
const signForm = document.querySelector("#sign-form");
const signDialog = document.querySelector("#sign-dialog");
const signDialogBody = document.querySelector("#sign-dialog-body");
const filesWindow = document.querySelector("#window-files");

const bootLines = [
  "quan.sys peace kernel",
  "(c) student runtime — commits, not tokens.",
  "",
  "whoami is a student. heat is a changelog.",
  "Type help. Click piano-roll notes to stage bars.",
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
  logEl.textContent = `${bootLines.join("\n")}\n`;
}

function runCommand(raw) {
  const line = raw.trim();
  printLine(`$ ${line || " "}`);
  if (!line) {
    return;
  }
  const [cmd, ...rest] = line.split(/\s+/u);
  switch (cmd.toLowerCase()) {
    case "help":
      printLine("help     commands");
      printLine("whoami   student runtime");
      printLine("log      heat commit mixtape");
      printLine("commit   stage a message");
      printLine("peace    jump to La Peace");
      printLine("roll     open the DAW");
      printLine("clear    wipe CRT");
      break;
    case "whoami":
      printLine("tranminhquan564");
      printLine("role: student compiling memes into UI");
      printLine("stack: HTML, CSS, git jokes, exams");
      break;
    case "log":
      printLine("01 feat: first intentional pixel");
      printLine("04 docs: centering a div (again)");
      printLine("06 release: merge conflict resolved");
      break;
    case "commit": {
      const msg = rest.join(" ") || "feat: one more refactor";
      printLine(`[main ${Math.random().toString(16).slice(2, 9)}] ${msg}`);
      break;
    }
    case "peace":
      printLine("It's La Peace.");
      document.querySelector("#peace")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "roll":
      document.querySelector("#roll")?.scrollIntoView({ behavior: "smooth" });
      printLine("sequencer armed");
      break;
    case "clear":
      printBoot();
      break;
    case "date":
      printLine(new Date().toString());
      break;
    default:
      printLine(`command not found: ${cmd}`);
      printLine("this shell grades bit, not syntax. try help");
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

function bindLightDismiss(dialog) {
  if (!dialog || "closedBy" in dialog) {
    return;
  }
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) {
      dialog.close();
    }
  });
}

printBoot();
tickClock();
setInterval(tickClock, 30_000);
bindLightDismiss(signDialog);

formEl?.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(inputEl?.value ?? "");
  if (inputEl) {
    inputEl.value = "";
  }
});

for (const note of document.querySelectorAll(".note")) {
  note.addEventListener("click", () => {
    note.classList.toggle("is-on");
    printLine(`note ${note.textContent?.trim()} // ${note.dataset.cmd}`);
  });
}

startBtn?.addEventListener("click", () => {
  setStartOpen(startBtn.getAttribute("aria-expanded") !== "true");
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
  }
});

startMenu?.addEventListener("click", () => setStartOpen(false));

signForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signForm);
  const name = String(data.get("name") || "anon");
  const caption = String(data.get("caption") || "La Peace");
  if (signDialogBody) {
    signDialogBody.textContent = `${name} dropped: “${caption}”. Local only.`;
  }
  signDialog?.showModal();
  signForm.reset();
});

document.querySelector("[data-close-window]")?.addEventListener("click", () => {
  if (filesWindow) {
    filesWindow.hidden = true;
  }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion) {
  fillBars();
} else if ("IntersectionObserver" in window && filesWindow) {
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
  observer.observe(filesWindow);
} else {
  fillBars();
}

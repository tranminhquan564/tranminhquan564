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
  "AMBATUKAM PROTOCOL 0",
  "(c) 1998-2026 student runtime. No tokens. No L2.",
  "",
  "whoami is a student. flex is a bit.",
  "Type help. Click piano-roll notes to log bars.",
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
  const [cmd] = line.split(/\s+/u);
  switch (cmd.toLowerCase()) {
    case "help":
      printLine("help    commands");
      printLine("whoami  the punchline");
      printLine("flex    README energy");
      printLine("peace   la peace");
      printLine("roll    open the DAW");
      printLine("ls      alleged binaries");
      printLine("clear   wipe CRT");
      break;
    case "whoami":
      printLine("tranminhquan564");
      printLine("role: student pretending to be a runtime legend");
      printLine("stack: HTML, CSS, jokes, exams");
      break;
    case "flex":
      printLine("coded since dinosaurs");
      printLine("dreams in binary");
      printLine("cannot sell you a bridge");
      break;
    case "peace":
      printLine("It's La Peace.");
      document.querySelector("#peace")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "roll":
      document.querySelector("#daw")?.scrollIntoView({ behavior: "smooth" });
      printLine("sequencer armed");
      break;
    case "ls":
      printLine("quebrarsistemas.bat  pentagon.lnk  cafe.com");
      printLine("tuesday-only.exe     student.txt   heat.commit");
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

printBoot();
tickClock();
setInterval(tickClock, 30_000);

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
    printLine(`note ${note.textContent?.trim()} // ${note.dataset.line}`);
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
    signDialog?.close();
  }
});

startMenu?.addEventListener("click", () => setStartOpen(false));

signForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signForm);
  const name = String(data.get("name") || "anon");
  const caption = String(data.get("caption") || "La Peace");
  if (signDialogBody) {
    signDialogBody.textContent = `${name} dropped: “${caption}”. It's La Peace.`;
  }
  signDialog?.showModal();
  signForm.reset();
});

document.querySelector("[data-close-dialog]")?.addEventListener("click", () => {
  signDialog?.close();
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

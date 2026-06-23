/* terminal.jsx — press ` to open the secret dev terminal */

const { useEffect, useRef, useState, useCallback } = React;

// ── static data ────────────────────────────────────────────────────────────

const PROJECTS = [
  { n: 1, slug: "cavite-moto-tech", label: "Cavite Moto-Tech Hub",            stack: "Vue 3 · Laravel · MySQL · Three.js · Capacitor", year: "2025—now", url: "https://cavitemototech.ogm1.com" },
  { n: 2, slug: "dc-transport",     label: "D.C. Transport Services",         stack: "Vue 3 · Laravel · MySQL · Leaflet",               year: "2026",     url: "https://dctransport.ogm1.com" },
  { n: 3, slug: "den-portfolio",    label: "Den · VA Portfolio",              stack: "HTML · CSS · JS · Vercel · Figma",               year: "2026",     url: "https://den-portfolio-plum.vercel.app" },
  { n: 4, slug: "rmo-global",       label: "R Mo Global Diversity Solutions", stack: "React · HTML · CSS · Vercel",                    year: "2026",     url: "https://rmo-seven.vercel.app" },
  { n: 5, slug: "klori",            label: "Klori · Calorie Tracker",         stack: "Flutter · Dart · Riverpod · Laravel · MySQL",    year: "2026",     url: null },
];

const SECTIONS = ["about", "stack", "skills", "work", "journey", "contact"];

const CMD_NAMES = [
  "help", "whoami", "ls", "cat", "skills", "cd", "open",
  "git", "neofetch", "theme", "matrix", "sudo", "clear", "exit",
];

const NF_LOGO = [
  "  ███╗   ███╗██████╗ ",
  "  ████╗ ████║██╔══██╗",
  "  ██╔████╔██║██║  ██║",
  "  ██║╚██╔╝██║██║  ██║",
  "  ██║ ╚═╝ ██║██████╔╝",
  "  ╚═╝     ╚═╝╚═════╝ ",
];

const NF_INFO = (theme) => [
  ["",        "marc daniel @ portfolio"],
  ["",        "─".repeat(26)],
  ["os",      "portfolio.jsx v2.0"],
  ["host",    "Cavite, PH · UTC+8"],
  ["uptime",  "since 2023"],
  ["shell",   "terminal.jsx 1.0"],
  ["theme",   theme],
  ["stack",   "Vue 3 · React · Laravel · PHP"],
  ["tools",   "Three.js · Capacitor · Leaflet"],
  ["gpu",     "WebGL — Three.js renderer"],
  ["memory",  "∞ late-night sessions"],
  ["",        ""],
  ["",        "██ ██ ██ ██ ██ ██ ██"],
];

// ── command processor ─────────────────────────────────────────────────────

function exec(raw, { theme, setTheme, onClose, onMatrix }) {
  const input = raw.trim();
  if (!input) return null;

  const parts = input.split(/\s+/);
  const cmd   = parts[0].toLowerCase();
  const args  = parts.slice(1).join(" ");

  switch (cmd) {

    case "help":
      return [
        { t: "dim",   s: "╭──────────────────────────────────────────╮" },
        { t: "dim",   s: "│  command           description           │" },
        { t: "dim",   s: "├──────────────────────────────────────────┤" },
        { t: "plain", s: "│  help              show this             │" },
        { t: "plain", s: "│  whoami            about marc daniel     │" },
        { t: "plain", s: "│  ls                list files            │" },
        { t: "plain", s: "│  cat <file>        read a file           │" },
        { t: "plain", s: "│  skills            tech capabilities     │" },
        { t: "plain", s: "│  cd <section>      scroll to section     │" },
        { t: "plain", s: "│  open <1-4>        launch project        │" },
        { t: "plain", s: "│  git log           commit history        │" },
        { t: "plain", s: "│  neofetch          system info           │" },
        { t: "plain", s: "│  theme             toggle dark / light   │" },
        { t: "plain", s: "│  matrix            ???                   │" },
        { t: "plain", s: "│  clear             clear screen          │" },
        { t: "plain", s: "│  exit              close terminal        │" },
        { t: "dim",   s: "╰──────────────────────────────────────────╯" },
        { t: "dim",   s: "tip: ↑↓ history · tab complete · ctrl+l clear" },
      ];

    case "whoami":
      return [
        { t: "accent", s: "marc daniel u. dela cruz" },
        { t: "dim",    s: "─".repeat(30) },
        { t: "kv",     s: ["role  ", "full-stack developer"] },
        { t: "kv",     s: ["school", "BSIT · 4th yr · NCST"] },
        { t: "kv",     s: ["base  ", "Cavite, Philippines · UTC+8"] },
        { t: "kv-ok",  s: ["status", "open for freelance · Q3 2026"] },
        { t: "kv",     s: ["mail  ", "marcdanieldelacruz599@gmail.com"] },
        { t: "kv",     s: ["github", "github.com/jckdanielss"] },
      ];

    case "ls": {
      if (!args || args === "." || args === "./") {
        return [
          { t: "dim",   s: "total 5" },
          { t: "dir",   s: "drwxr-xr-x  projects/" },
          { t: "dir",   s: "drwxr-xr-x  skills/" },
          { t: "plain", s: "-rw-r--r--  about.json" },
          { t: "dim",   s: "-rw-r--r--  resume.pdf         [locked until Q3 2026]" },
          { t: "exec",  s: "-rwxr-xr-x  portfolio.jsx      ← you are here" },
        ];
      }
      if (args === "projects" || args === "projects/") {
        return PROJECTS.map(p => ({
          t: "plain",
          s: `  [${p.n}]  ${p.slug.padEnd(22)}  ${p.year}`,
        })).concat([
          { t: "dim", s: "" },
          { t: "dim", s: "use: open <n> to launch · cat projects/<slug> for details" },
        ]);
      }
      if (args === "-la" || args === "-al" || args === "-l" || args === "-a") {
        return [
          { t: "dim",   s: "total 5" },
          { t: "dir",   s: "drwxr-xr-x  2  marc  staff   64  projects/" },
          { t: "dir",   s: "drwxr-xr-x  9  marc  staff  288  skills/" },
          { t: "plain", s: "-rw-r--r--  1  marc  staff  2.1k about.json" },
          { t: "dim",   s: "-rw-r--r--  1  marc  staff  ??   resume.pdf  [locked]" },
          { t: "exec",  s: "-rwxr-xr-x  1  marc  staff  18k  portfolio.jsx" },
        ];
      }
      return [{ t: "plain", s: "projects/   skills/   about.json   resume.pdf   portfolio.jsx" }];
    }

    case "cat": {
      if (args === "about.json") {
        return [
          { t: "json-b", s: "{" },
          { t: "json",   s: ['  "name"',      '"Marc Daniel U. Dela Cruz"'] },
          { t: "json",   s: ['  "role"',       '"full-stack developer"'] },
          { t: "json",   s: ['  "edu"',        '"BSIT · 4th yr · NCST"'] },
          { t: "json",   s: ['  "base"',       '"Cavite, Philippines · UTC+8"'] },
          { t: "json",   s: ['  "stack"',      '["Vue 3","React","Laravel","PHP","TypeScript","PostgreSQL"]'] },
          { t: "json",   s: ['  "tools"',      '["Three.js","Capacitor","Leaflet","Git","Blender","Figma"]'] },
          { t: "json-g", s: ['  "status"',     '"open — freelance + collabs"'] },
          { t: "json",   s: ['  "vices"',      '["gaming","music","blender fails"]'] },
          { t: "json",   s: ['  "available"',  '"Q3 2026"'] },
          { t: "json-b", s: "}" },
        ];
      }
      if (args === "resume.pdf") {
        return [{ t: "warn", s: "access denied — resume unlocks Q3 2026. check back soon." }];
      }
      if (args.startsWith("projects/")) {
        const slug = args.slice(9);
        const p = PROJECTS.find(x => x.slug === slug);
        if (p) {
          return [
            { t: "accent", s: p.label },
            { t: "dim",    s: "─".repeat(p.label.length) },
            { t: "kv",     s: ["stack", p.stack] },
            { t: "kv",     s: ["year ", p.year] },
            p.url
              ? { t: "kv-url", s: ["url  ", p.url] }
              : { t: "dim",    s: "  url   · mobile app — no public URL yet" },
          ];
        }
        return [
          { t: "error", s: `cat: ${args}: no such file` },
          { t: "dim",   s: "available: " + PROJECTS.map(x => `projects/${x.slug}`).join("  ") },
        ];
      }
      if (!args) return [{ t: "error", s: "cat: missing operand" }];
      return [{ t: "error", s: `cat: ${args}: no such file or directory` }];
    }

    case "skills":
      return [
        { t: "dim",   s: "─── cross-cutting capabilities ───────────────────────" },
        { t: "kv",    s: ["RBAC      ", "7 roles in prod · Spatie + Laravel middleware"] },
        { t: "kv",    s: ["REST API  ", "Sanctum auth · versioned endpoints · JSON:API"] },
        { t: "kv",    s: ["real-time ", "Pusher + Laravel Echo · live dashboards"] },
        { t: "kv",    s: ["auth      ", "OTP/SMS/email · session + token · SPA + mobile"] },
        { t: "kv",    s: ["mail      ", "queued SMTP · templates · Laravel Queues"] },
        { t: "kv",    s: ["db schema ", "relational modeling · MySQL + PostgreSQL"] },
        { t: "kv",    s: ["frontend  ", "Vue 3 + React · Pinia · Tailwind · responsive"] },
        { t: "kv",    s: ["mobile    ", "Capacitor Android — in production"] },
        { t: "kv",    s: ["3D web    ", "Three.js + Blender — CVT configurator shipped"] },
      ];

    case "cd": {
      if (!args) return [
        { t: "error", s: "cd: missing operand" },
        { t: "dim",   s: `available sections: ${SECTIONS.join(", ")}` },
      ];
      const sec = args.toLowerCase();
      const el  = document.getElementById(sec);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 160);
        return [{ t: "ok", s: `navigating to #${sec}…` }];
      }
      return [
        { t: "error", s: `cd: ${args}: section not found` },
        { t: "dim",   s: `available: ${SECTIONS.join(", ")}` },
      ];
    }

    case "open": {
      const n    = parseInt(args, 10);
      const proj = PROJECTS.find(p => p.n === n);
      if (proj) {
        if (!proj.url) return [{ t: "warn", s: `${proj.label} — no public URL yet (mobile app in dev)` }];
        setTimeout(() => window.open(proj.url, "_blank", "noopener,noreferrer"), 240);
        return [{ t: "ok", s: `opening ${proj.label}…` }];
      }
      return [
        { t: "error", s: `open: '${args || "(none)"}' not found` },
        { t: "dim",   s: "use: open 1…4" },
      ];
    }

    case "git": {
      if (!args || args === "log" || args === "log --oneline") {
        return [
          { t: "git", s: ["87a09e4", "polish design: editorial zine touches"] },
          { t: "git", s: ["6a7d7df", "fixed some stuff"] },
          { t: "git", s: ["7d8d71f", "minor changes"] },
          { t: "git", s: ["50cef7c", "added textstack to existing projects"] },
          { t: "git", s: ["f3c1a2b", "add secret terminal easter egg  ← you found it"] },
          { t: "git", s: ["2e9b4d1", "three.js cvt configurator — shipped"] },
          { t: "git", s: ["9a4c3f0", "capacitor android build — production"] },
          { t: "git", s: ["1b2e5d8", "init: schema to deploy"] },
          { t: "dim", s: "─── end of log ───" },
        ];
      }
      if (args === "status") {
        return [
          { t: "ok",    s: "On branch main" },
          { t: "plain", s: "Your branch is up to date with 'origin/main'." },
          { t: "plain", s: "" },
          { t: "dim",   s: "nothing to commit, working tree clean" },
        ];
      }
      if (args.startsWith("push")) {
        return [{ t: "error", s: "fatal: you don't have push access. nice try." }];
      }
      if (args.startsWith("commit")) {
        return [{ t: "error", s: "error: you are not the developer." }];
      }
      return [{ t: "error", s: `git: '${args}' is not a git command. try 'git log' or 'git status'.` }];
    }

    case "neofetch":
      return [{ t: "neofetch" }];

    case "theme": {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      return [{ t: "ok", s: `theme → ${next}` }];
    }

    case "matrix":
      setTimeout(onMatrix, 60);
      return [{ t: "ok", s: "follow the white rabbit…" }];

    case "sudo":
      return [
        { t: "warn",  s: "[sudo] password for marc: " },
        { t: "error", s: "marc is not in the sudoers file. this incident will be reported." },
      ];

    case "rm":
      if (args.includes("-rf") || args.includes("-fr")) {
        return [{ t: "error", s: "rm: operation not permitted. (you really thought that'd work?)" }];
      }
      return [{ t: "error", s: `rm: ${args}: permission denied` }];

    case "vim": case "vi": case "nano": case "emacs":
      return [{ t: "warn", s: `${cmd}: editor unavailable. this is a portfolio, not a dev box.` }];

    case "node": case "php": case "python": case "python3": case "bun":
      return [{ t: "warn", s: `${cmd}: not here — check the actual projects, they run the real thing.` }];

    case "pwd":
      return [{ t: "plain", s: "/home/marc/portfolio" }];

    case "echo":
      return [{ t: "plain", s: args || "" }];

    case "date":
      return [{ t: "plain", s: new Date().toString() }];

    case "uname":
      return [{ t: "plain", s: "portfolio.jsx Darwin arm64" }];

    case "clear":
      return [{ t: "clear" }];

    case "exit":
      onClose();
      return null;

    default:
      return [
        { t: "error", s: `command not found: ${cmd}` },
        { t: "dim",   s: "type 'help' for available commands" },
      ];
  }
}

// ── line renderer ─────────────────────────────────────────────────────────

function TermLine({ line, theme }) {
  const { t, s } = line;

  if (t === "neofetch") {
    const info = NF_INFO(theme);
    return (
      <div className="t-nf">
        <div className="t-nf-logo">
          {NF_LOGO.map((row, i) => <div key={i}>{row}</div>)}
        </div>
        <div className="t-nf-info">
          {info.map(([k, v], i) => (
            <div key={i} className="t-nf-row">
              {k
                ? <><span className="t-nf-key">{k}</span><span className="t-dim">: </span><span className="t-nf-val">{v}</span></>
                : <span className={i < 2 ? "t-nf-head" : "t-nf-colors"}>{v}</span>
              }
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (t === "json" || t === "json-g") {
    const [key, val] = s;
    return (
      <div>
        <span className="t-json-key">{key}</span>
        <span className="t-dim">: </span>
        <span className={t === "json-g" ? "t-ok" : "t-json-val"}>{val}</span>
        <span className="t-dim">,</span>
      </div>
    );
  }
  if (t === "json-b") return <div className="t-json-key">{s}</div>;

  if (t === "kv" || t === "kv-ok" || t === "kv-url") {
    const [key, val] = s;
    return (
      <div>
        <span className="t-dim">{key}</span>
        <span>{"  "}</span>
        <span className={t === "kv-ok" ? "t-ok" : t === "kv-url" ? "t-url" : "t-val"}>{val}</span>
      </div>
    );
  }

  if (t === "git") {
    const [hash, msg] = s;
    return (
      <div>
        <span className="t-git-hash">{hash}</span>
        <span className="t-dim">  </span>
        <span className="t-val">{msg}</span>
      </div>
    );
  }

  const cls = {
    plain: "t-val",
    dim:   "t-dim",
    accent:"t-accent",
    ok:    "t-ok",
    error: "t-error",
    warn:  "t-warn",
    dir:   "t-dir",
    exec:  "t-exec",
  }[t] || "t-val";

  return <div className={cls} style={{ whiteSpace: "pre" }}>{s}</div>;
}

// ── matrix rain ───────────────────────────────────────────────────────────

function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const FONT_SIZE = 13;
    const cols  = Math.floor(W / FONT_SIZE);
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -40));
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
    let frame = 0;

    const id = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, W, H);

      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const isHead = drops[i] * FONT_SIZE > 0 && Math.random() > 0.85;
        ctx.fillStyle = isHead ? "#ffffff" : "#00ff41";
        ctx.fillText(ch, i * FONT_SIZE, y * FONT_SIZE);
        if (y * FONT_SIZE > H && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      });

      frame++;
      if (frame > 220) { clearInterval(id); onDone(); }
    }, 33);

    return () => clearInterval(id);
  }, []);

  return <canvas ref={canvasRef} className="t-matrix" />;
}

// ── terminal window ───────────────────────────────────────────────────────

function Terminal({ theme, setTheme }) {
  const [open,    setOpen]    = useState(false);
  const [lines,   setLines]   = useState([]);
  const [input,   setInput]   = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [matrix,  setMatrix]  = useState(false);
  const [pos,     setPos]     = useState(null); // null = centered via CSS

  const inputRef  = useRef(null);
  const bodyRef   = useRef(null);
  const windowRef = useRef(null);
  const dragRef   = useRef(null);

  // toggle on backtick, always close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "`") { e.preventDefault(); setOpen(v => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // focus + boot message on first open
  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 80);
    setLines(prev => prev.length ? prev : [{ type: "boot" }]);
  }, [open]);

  // auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, matrix]);

  // drag
  const startDrag = useCallback((e) => {
    if (e.button !== 0) return;
    const win  = windowRef.current;
    if (!win) return;
    const rect = win.getBoundingClientRect();
    dragRef.current = { ox: e.clientX - rect.left, oy: e.clientY - rect.top };

    const onMove = (ev) => {
      if (!dragRef.current) return;
      setPos({
        x: Math.max(0, Math.min(ev.clientX - dragRef.current.ox, window.innerWidth  - win.offsetWidth)),
        y: Math.max(0, Math.min(ev.clientY - dragRef.current.oy, window.innerHeight - win.offsetHeight)),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
  }, []);

  const pushLines = (newLines) => setLines(prev => [...prev, ...newLines]);

  const submit = () => {
    const raw = input.trim();
    const inputEntry = { type: "input", text: raw };

    if (raw) {
      setHistory(h => [raw, ...h.filter(x => x !== raw)].slice(0, 60));
      setHistIdx(-1);
    }

    const result = exec(raw, {
      theme,
      setTheme,
      onClose:  () => setOpen(false),
      onMatrix: () => {
        setLines(prev => [...prev, inputEntry]);
        setMatrix(true);
        setInput("");
      },
    });

    if (result === null)               { setLines(prev => [...prev, inputEntry]); setInput(""); return; }
    if (!result)                       { setLines(prev => [...prev, inputEntry]); setInput(""); return; }
    if (result[0]?.t === "clear")      { setLines([]);                            setInput(""); return; }

    setLines(prev => [...prev, inputEntry, { type: "output", data: result }]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") { submit(); return; }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : (history[idx] ?? ""));
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const match = CMD_NAMES.find(c => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setLines(prev => [...prev, { type: "input", text: input + "^C" }]);
      setInput("");
    }
  };

  const winStyle = pos
    ? { position: "fixed", left: pos.x, top: pos.y, transform: "none", bottom: "auto" }
    : {};

  return (
    <>
      {!open && (
        <div className="t-hint" aria-label="press backtick to open terminal">
          press <kbd className="t-kbd">`</kbd> for terminal
        </div>
      )}

      {open && (
        <div
          className="t-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          aria-modal="true"
          role="dialog"
          aria-label="Developer terminal"
        >
          <div className="t-window" ref={windowRef} style={winStyle}>

            {/* title bar */}
            <div className="t-chrome" onMouseDown={startDrag}>
              <div className="t-dots">
                <span className="t-dot t-dot-r" onClick={() => setOpen(false)} title="close"    />
                <span className="t-dot t-dot-y" onClick={() => setOpen(false)} title="minimize" />
                <span className="t-dot t-dot-g"                                title="full screen (nope)" />
              </div>
              <span className="t-chrome-title">marc@portfolio — terminal</span>
              <span className="t-chrome-right" />
            </div>

            {/* body */}
            <div
              className="t-body"
              ref={bodyRef}
              onClick={() => inputRef.current?.focus()}
            >
              {matrix ? (
                <MatrixRain onDone={() => {
                  setMatrix(false);
                  setLines(prev => [...prev, {
                    type: "output",
                    data: [{ t: "ok", s: "simulation ended. you are still in the portfolio." }],
                  }]);
                }} />
              ) : (
                <>
                  {lines.map((line, i) => {
                    if (line.type === "boot") return (
                      <div key={i} className="t-boot">
                        <span className="t-accent">marc daniel · portfolio terminal</span> v1.0<br />
                        type <span className="t-dim">'help'</span> for commands ·{" "}
                        <span className="t-dim">↑↓</span> history ·{" "}
                        <span className="t-dim">tab</span> complete ·{" "}
                        <span className="t-dim">esc</span> to close
                      </div>
                    );
                    if (line.type === "input") return (
                      <div key={i} className="t-row-input">
                        <span className="t-ps1">marc@portfolio:~$</span>
                        <span className="t-val"> {line.text}</span>
                      </div>
                    );
                    if (line.type === "output") return (
                      <div key={i} className="t-output">
                        {line.data.map((l, j) => <TermLine key={j} line={l} theme={theme} />)}
                      </div>
                    );
                    return null;
                  })}

                  <div className="t-row-live">
                    <span className="t-ps1">marc@portfolio:~$</span>
                    <input
                      ref={inputRef}
                      className="t-input"
                      value={input}
                      onChange={e => { setInput(e.target.value); setHistIdx(-1); }}
                      onKeyDown={onKeyDown}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      aria-label="terminal input"
                    />
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

window.Terminal = Terminal;

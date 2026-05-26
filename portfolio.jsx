/* portfolio app — wires cursor, theme, tweaks, sections */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#ff8a65"
}/*EDITMODE-END*/;

function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    };
    let raf = 0;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    const overable = "a, button, [data-cursor-hover], .stack-chip, .project-row, .tl-item";
    const onOver = (e) => {
      if (e.target.closest(overable)) document.body.classList.add("cursor-hover");
      if (e.target.matches("input, textarea")) document.body.classList.add("cursor-text");
    };
    const onOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest?.(overable)) document.body.classList.remove("cursor-hover");
      document.body.classList.remove("cursor-text");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

function CursorAura() {
  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia("(max-width: 720px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setAura = (x, y) => {
      root.style.setProperty("--aura-x", `${(x / window.innerWidth) * 100}%`);
      root.style.setProperty("--aura-y", `${(y / window.innerHeight) * 100}%`);
      root.style.setProperty("--aura-x-2", `${50 + ((x / window.innerWidth) - 0.5) * 18}%`);
      root.style.setProperty("--aura-y-2", `${58 + ((y / window.innerHeight) - 0.5) * 14}%`);
    };

    const center = () => setAura(window.innerWidth * 0.5, window.innerHeight * 0.28);
    center();

    if (mobile.matches || reduced.matches) return;

    let tx = window.innerWidth * 0.5;
    let ty = window.innerHeight * 0.28;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const onLeave = () => {
      tx = window.innerWidth * 0.5;
      ty = window.innerHeight * 0.28;
    };

    const onResize = () => {
      tx = Math.min(tx, window.innerWidth);
      ty = Math.min(ty, window.innerHeight);
      x = tx;
      y = ty;
      setAura(x, y);
    };

    const tick = () => {
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      setAura(x, y);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      center();
    };
  }, []);

  return null;
}

const ACCENT_MAP = {
  "#ff8a65": { g1: "linear-gradient(135deg, #ff8a65 0%, #f472b6 45%, #a78bfa 100%)", coral: "#f56565" },
  "#5eead4": { g1: "linear-gradient(135deg, #5eead4 0%, #6ee7b7 45%, #818cf8 100%)", coral: "#10b981" },
  "#a78bfa": { g1: "linear-gradient(135deg, #a78bfa 0%, #c084fc 45%, #f472b6 100%)", coral: "#8b5cf6" },
  "#fcd34d": { g1: "linear-gradient(135deg, #fcd34d 0%, #fb923c 45%, #f43f5e 100%)", coral: "#f59e0b" },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = t.theme;
  const setTheme = (v) => setTweak("theme", v);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  /* accent swap — rewrites --grad-1 + --peach via :root override */
  useEffect(() => {
    const a = ACCENT_MAP[t.accent] || ACCENT_MAP["#ff8a65"];
    document.documentElement.style.setProperty("--grad-1", a.g1);
    document.documentElement.style.setProperty("--peach", t.accent);
    document.documentElement.style.setProperty("--coral", a.coral);
  }, [t.accent]);

  return (
    <>
      <CursorAura />
      <CustomCursor />
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Stack />
      <Projects />
      <Journey />
      <Contact />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Mode"
            value={theme}
            onChange={(v) => setTheme(v)}
            options={["light", "dark"]}
          />
        </TweakSection>
        <TweakSection label="Accent">
          <TweakColor
            label="Color"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#ff8a65", "#5eead4", "#a78bfa", "#fcd34d"]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

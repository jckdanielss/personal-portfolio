/* portfolio app — wires cursor, theme, tweaks, sections */

import React, { useEffect } from "react";
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from "./tweaks-panel.jsx";
import { Nav, Hero, About, Stack, TechSkills, Projects, Journey, Contact } from "./sections.jsx";
import { Terminal } from "./terminal.jsx";
import { Gallery } from "./gallery.jsx";
import "./styles.css";

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#7c6fef"
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


/* lenis smooth scroll — no-op if the CDN script didn't load */
function SmoothScroll() {
  useEffect(() => {
    if (!window.Lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      const target = href === "#top" ? 0 : document.querySelector(href);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: href === "#top" ? 0 : -76, duration: 1.2 });
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}

/* gradient hairline at the very top showing scroll progress */
function ScrollProgress() {
  const ref = React.useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

/* magnetic pull on [data-magnet] elements (desktop, motion-ok only) */
function MagnetEffect() {
  useEffect(() => {
    if (window.matchMedia("(max-width: 720px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = null;
    const release = () => {
      if (current) { current.style.transform = ""; current = null; }
    };
    const onMove = (e) => {
      const m = e.target.closest?.("[data-magnet]");
      if (current && current !== m) release();
      if (!m) return;
      current = m;
      const r = m.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", release);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", release);
      release();
    };
  }, []);
  return null;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const theme = t.theme;
  const setTheme = (v) => setTweak("theme", v);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  /* view counter — fire-and-forget hit, read back via terminal `views` command */
  useEffect(() => {
    fetch("https://abacus.jasoncameron.dev/hit/marc-daniel-portfolio/site-views").catch(() => {});
  }, []);

  /* accent swap — single CSS var, no gradient derivation needed */
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  return (
    <>
      <CustomCursor />
      <SmoothScroll />
      <MagnetEffect />
      <ScrollProgress />
      <Nav theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Stack />
      <TechSkills />
      <Projects />
      <Journey />
      <Contact />

      <Gallery />
      <Terminal theme={theme} setTheme={setTheme} />
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
            options={["#7c6fef", "#4dd8e0", "#f5b942", "#f2545b"]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

export default App;

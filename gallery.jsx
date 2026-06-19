/* gallery.jsx — fullscreen GSAP seamless-loop card gallery
   navigate by: drag · mouse wheel · arrow / page keys · prev-next buttons
   images: drop files at  gallery/<slug>/<name>.png
   to add a project: add slug to GALLERY_DATA and gallery:"slug" in sections.jsx */

const { useEffect, useRef, useState } = React;

const GALLERY_DATA = {
  klori: {
    title: "Klori",
    blurb: "A calorie & macro tracker I'm building in Flutter — log meals, track water, build recipes, and hit a daily goal.",
    url: null,
    slides: [
      { bg: "gallery/klori/login.png",    label: "Sign In",        desc: "Email + password or one-tap social login with Google, Facebook, and Apple." },
      { bg: "gallery/klori/home.png",     label: "Home",           desc: "Daily calorie progress, macro ring, AI credits, and hydration all on one screen." },
      { bg: "gallery/klori/meal_log.png", label: "Meal Log",       desc: "Log by meal type — Breakfast, Lunch, Merienda, Dinner — with brand, weight, and kcal." },
      { bg: "gallery/klori/profile.png",  label: "Profile",        desc: "Set your daily calorie goal, meal budget, height, and weight to personalise your targets." },
      { bg: "gallery/klori/recipe.png",   label: "Recipe Builder", desc: "Add ingredients, set servings, and watch live nutrition totals update as you type." },
    ],
  },
};

function buildSeamlessLoop(items, spacing, animateFunc) {
  const gsap      = window.gsap;
  const overlap   = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime  = (items.length + overlap) * spacing + 1;
  const l         = items.length + overlap * 2;
  const rawSequence  = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true, repeat: -1,
    onRepeat() { this._time === this._dur && (this._tTime += this._dur - 0.01); },
  });
  for (let i = 0; i < l; i++) {
    const index = i % items.length;
    const time  = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
    if (i <= items.length) seamlessLoop.add("label" + i, time);
  }
  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: "none" })
    .fromTo(rawSequence,
      { time: overlap * spacing + 1 },
      { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: "none" }
    );
  return seamlessLoop;
}

function Gallery() {
  const [slug, setSlug]  = useState(null);
  const containerRef     = useRef(null);
  const dragProxyRef     = useRef(null);
  const cleanupRef       = useRef(null);

  useEffect(() => {
    const open = (e) => setSlug(e.detail.slug);
    window.addEventListener("open-gallery", open);
    return () => window.removeEventListener("open-gallery", open);
  }, []);

  useEffect(() => {
    if (!slug) return;
    document.body.style.overflow = "hidden";

    const tid = setTimeout(() => {
      const { gsap, Draggable } = window;
      if (!gsap || !containerRef.current) return;

      const container = containerRef.current;
      const cards     = Array.from(container.querySelectorAll(".gsap-cards li"));
      const spacing   = 0.1;
      const snapTime  = gsap.utils.snap(spacing);

      gsap.set(cards, { xPercent: 300, opacity: 0, scale: 0 });

      const animateFunc = (el) => {
        const tl = gsap.timeline();
        tl.fromTo(el,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }
        ).fromTo(el, { xPercent: 300 }, { xPercent: -300, duration: 1, ease: "none", immediateRender: false }, 0);
        return tl;
      };

      const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
      const playhead     = { offset: 0 };
      const wrapTime     = gsap.utils.wrap(0, seamlessLoop.duration());

      const scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
        duration: 0.5,
        ease: "power3",
        paused: true,
      });

      const scrollToOffset = (offset) => {
        scrub.vars.offset = snapTime(offset);
        scrub.invalidate().restart();
      };

      scrollToOffset(0);

      // prev / next buttons
      const prevBtn = container.querySelector(".gallery-prev");
      const nextBtn = container.querySelector(".gallery-next");
      const onPrev  = () => scrollToOffset(scrub.vars.offset - spacing);
      const onNext  = () => scrollToOffset(scrub.vars.offset + spacing);
      prevBtn.addEventListener("click", onPrev);
      nextBtn.addEventListener("click", onNext);

      // mouse wheel — scrub freely, snap when it settles
      let wheelTO = null;
      const onWheel = (e) => {
        e.preventDefault();
        scrub.vars.offset += e.deltaY * 0.0009;
        scrub.invalidate().restart();
        clearTimeout(wheelTO);
        wheelTO = setTimeout(() => scrollToOffset(scrub.vars.offset), 120);
      };
      container.addEventListener("wheel", onWheel, { passive: false });

      // arrow / page keys
      const onKey = (e) => {
        if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); onNext(); }
        else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); onPrev(); }
      };
      window.addEventListener("keydown", onKey);

      // drag (mouse + touch)
      let draggableInst = null;
      if (Draggable && dragProxyRef.current) {
        draggableInst = Draggable.create(dragProxyRef.current, {
          type: "x",
          trigger: container.querySelector(".gsap-cards"),
          onPress() { this.startOffset = scrub.vars.offset; },
          onDrag() {
            scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
            scrub.invalidate().restart();
          },
          onDragEnd() { scrollToOffset(scrub.vars.offset); },
        })[0];
      }

      cleanupRef.current = () => {
        clearTimeout(wheelTO);
        prevBtn.removeEventListener("click", onPrev);
        nextBtn.removeEventListener("click", onNext);
        container.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        scrub.kill();
        seamlessLoop.kill();
        draggableInst?.kill();
        gsap.killTweensOf(cards);
      };
    }, 50);

    return () => {
      clearTimeout(tid);
      cleanupRef.current?.();
      cleanupRef.current = null;
      document.body.style.overflow = "";
    };
  }, [slug]);

  // Escape — capture phase so it fires before other listeners
  useEffect(() => {
    if (!slug) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); setSlug(null); }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [slug]);

  if (!slug) return null;
  const data = GALLERY_DATA[slug];
  if (!data) return null;

  // the seamless loop needs enough cards to work — repeat the screens to fill
  const repeat = Math.max(3, Math.ceil(20 / data.slides.length));
  const cards  = Array.from({ length: repeat }).flatMap(() => data.slides);

  return (
    <div
      className="gallery-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) setSlug(null); }}
    >
      <button className="gallery-close" onClick={() => setSlug(null)} aria-label="Close gallery">×</button>

      <div className="gallery-info">
        <h3 className="gallery-info-title">{data.title}</h3>
        {data.blurb && <p className="gallery-info-blurb">{data.blurb}</p>}
        <ul className="gallery-info-hints">
          <li>drag the cards</li>
          <li>scroll / mouse wheel</li>
          <li>← → arrow keys</li>
          <li>prev · next buttons</li>
        </ul>
        {data.url && (
          <a className="gallery-info-link" href={data.url} target="_blank" rel="noopener noreferrer">
            visit site ↗
          </a>
        )}
      </div>

      <div className="gsap-gallery" ref={containerRef}>
        <ul className="gsap-cards">
          {cards.map((s, i) => (
            <li key={i} style={{ backgroundImage: `url('${s.bg}')` }}>
              {(s.label || s.desc) && (
                <div className="gsap-card-caption">
                  {s.label && <span className="gsap-card-label">{s.label}</span>}
                  {s.desc  && <p className="gsap-card-desc">{s.desc}</p>}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="gsap-actions">
          <button className="gallery-prev">◀ Prev</button>
          <button className="gallery-next">Next ▶</button>
        </div>
      </div>

      <div className="drag-proxy" ref={dragProxyRef} />
    </div>
  );
}

Object.assign(window, { Gallery, GALLERY_DATA });

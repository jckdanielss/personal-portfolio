/* gallery.jsx — fullscreen gallery
   two modes: gsap seamless-loop card stack (klori) · thumbnail carousel (cavitemototech)
   images: gallery/<slug>/<name>.png
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
  cavitemototech: {
    title: "Cavite Moto-Tech Hub",
    blurb: "ERP for motorcycle shops in the Philippines. Booking, inventory, billing, a 3D CVT configurator, and seven roles from customer to super admin — all in one system.",
    url: "https://cavitemototech.ogm1.com",
    type: "thumbnail",
    slides: [
      { bg: "gallery/cavite_mototech/dashboard.png",           label: "Home",              desc: "Landing page for the platform. Shows the CVT customizer pitch, shop listings teaser, and quick CTAs for new users." },
      { bg: "gallery/cavite_mototech/dashboard_2.png",         label: "Shop Suggestions",  desc: "Landing page shop section. Shows nearby shops with ratings, distance, offered services, and quick links to parts and booking." },
      { bg: "gallery/cavite_mototech/shops_page.png",          label: "Shop Directory",    desc: "All registered shops listed with ratings, distance, and available service types. Filterable by location and specialty." },
      { bg: "gallery/cavite_mototech/shops_inspect.png",       label: "Shop Profile",      desc: "Single shop page: hours, offered services, contact details, and customer reviews. Customers book directly from here." },
      { bg: "gallery/cavite_mototech/shops_get_direction.png", label: "Get Directions",    desc: "Leaflet map with a route drawn to the selected shop. No Google Maps API needed — runs on OpenStreetMap tiles." },
      { bg: "gallery/cavite_mototech/parts_page.png",          label: "Parts Catalog",     desc: "Full parts inventory with live stock counts, pricing, and compatibility tags per bike model." },
      { bg: "gallery/cavite_mototech/parts_page2.png",         label: "Parts — Filtered",  desc: "Category drill-down view. Bulk-select parts to build a purchase order or do a stock adjustment in one shot." },
      { bg: "gallery/cavite_mototech/parts_page3.png",         label: "Parts — By Model",  desc: "Model-specific lookup. Type a bike model and the catalog narrows to only compatible parts." },
      { bg: "gallery/cavite_mototech/parts_page4.png",         label: "Parts — Stock View","desc": "Stock status at a glance: green for available, red for critical. One click adds to a purchase order." },
      { bg: "gallery/cavite_mototech/parts_inspect.png",       label: "Part Detail",       desc: "Single part page: specs, compatible models, supplier info, and a full history of stock movements." },
      { bg: "gallery/cavite_mototech/services_page.png",       label: "Services",          desc: "Public service menu with base pricing and estimated job time. Customers see this when choosing what to book." },
      { bg: "gallery/cavite_mototech/services_page2.png",      label: "Services — Admin",  desc: "Shop admin panel for services. Add jobs, set pricing, and toggle whether a service is currently offered." },
      { bg: "gallery/cavite_mototech/about_page.png",          label: "About",             desc: "Platform overview page. Explains what Moto-Tech Hub does, who it's for, and how the role system works." },
      { bg: "gallery/cavite_mototech/about_page2.png",         label: "About — Stack",     desc: "Tech credits section. Lists Vue 3, Laravel, Three.js, Capacitor, and the people behind the build." },
      { bg: "gallery/cavite_mototech/3d_customization.png",    label: "3D CVT Customizer", desc: "Three.js CVT configurator. Pick roller weight, belt, and pulley components and see the assembly rotate in 3D before adding to cart." },
    ],
  },
  dctranspo: {
    title: "D.C. Transport Services",
    blurb: "Van-rental booking platform for Cavite. OTP-verified guest bookings, Leaflet map pinning with address auto-fill, route-aware pricing across 27 distance bands, and a full admin dashboard for quotes and scheduling.",
    url: "https://dctransport.ogm1.com",
    type: "thumbnail",
    slides: [
      { bg: "gallery/dc_transpo/dashboard.png",   label: "Home",             desc: "Landing page for the platform. Pitches a single 13–15 seat executive van with custom leather, wood finish, onboard TV, and Cavite-based routes." },
      { bg: "gallery/dc_transpo/dashboard2.png",  label: "Vehicle Details",  desc: "Foton Transvan Highroof spec sheet. Lists every interior amenity — TV, speaker system, leather seats, custom roofing, wood flooring — with photo albums tabbed by exterior and interior." },
      { bg: "gallery/dc_transpo/dashboard3.png",  label: "Vehicle Photos",   desc: "Exterior photo album of the van. Customers see actual shots of the body and finish before they book." },
      { bg: "gallery/dc_transpo/dashboard4.png",  label: "Services",         desc: "Trip types and service coverage. Airport transfers, family and barkada trips, and corporate runs across Cavite, Metro Manila, Tagaytay, Batangas, Laguna, and airport routes." },
      { bg: "gallery/dc_transpo/dashboard5.png",  label: "Quote Process",    desc: "Quote flow overview. Submit route and dates, verify email so the request hits the admin queue, then receive a reviewed price by email, Messenger, call, or SMS." },
      { bg: "gallery/dc_transpo/booking.png",     label: "Booking",          desc: "Booking intro page. Explains the 3-step OTP flow and opens the 4-step trip form — Contact, Schedule, Route, and Verify." },
      { bg: "gallery/dc_transpo/booking2.png",    label: "Booking Form",     desc: "Trip details form. Full name, email, PH mobile, dates, departure time, and pickup address — with Pin on Map or Use Current Location for auto-fill." },
      { bg: "gallery/dc_transpo/loc_preview.png", label: "Location Preview", desc: "Map preview after both pins are set. Shows pickup in General Trias, Cavite and destination in Angeles, Pampanga on OpenStreetMap before submitting." },
      { bg: "gallery/dc_transpo/pin1.png",        label: "Pin on Map",       desc: "Map modal for dropping a location pin. Quick-select uses device GPS; search narrows to any place name across the Philippines." },
    ],
  },
  rmo: {
    title: "R Mo Global Diversity Solutions",
    blurb: "Marketing site for a US diversity certification consulting firm. Multi-page build covering services, blog, FAQ, team, milestones, and a contact form with captcha — deployed on Vercel.",
    url: "https://rmo-seven.vercel.app",
    type: "thumbnail",
    slides: [
      { bg: "gallery/rmo/landing_page_hero.png", label: "Home",       desc: "Landing page hero pitching diversity certification consulting, with a Learn More CTA and a logo strip of recognized certification bodies — HUBZone, WBENC, SBA 8(a), GSA, and more." },
      { bg: "gallery/rmo/blog.png",              label: "Blog",       desc: "Blog landing page. Green hero introduces the publication, then breaks content into categories — client wins, networking events, and milestone stories." },
      { bg: "gallery/rmo/faq.png",               label: "FAQ",        desc: "Frequently Asked Questions page. Topics filter by General, Certifications, and Process. Questions expand as accordions for quick scanning." },
      { bg: "gallery/rmo/history.png",           label: "Milestones", desc: "Key Milestones timeline. Tracks the firm's awards and community contributions year by year, starting from 2014 with the WBE Who Rocks award." },
      { bg: "gallery/rmo/team.png",              label: "Team",       desc: "Leadership and certification team page. Lists the CEO, advisors, and certification specialists with headshots and LinkedIn links." },
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

/* ── GSAP card-stack gallery (klori) ── */
function GsapGallery({ data, onClose }) {
  const containerRef = useRef(null);
  const dragProxyRef = useRef(null);
  const cleanupRef   = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.galleryOpen = "1";
    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.galleryOpen;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  useEffect(() => {
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

      const prevBtn = container.querySelector(".gallery-prev");
      const nextBtn = container.querySelector(".gallery-next");
      const onPrev  = () => scrollToOffset(scrub.vars.offset - spacing);
      const onNext  = () => scrollToOffset(scrub.vars.offset + spacing);
      prevBtn.addEventListener("click", onPrev);
      nextBtn.addEventListener("click", onNext);

      let wheelTO = null;
      const onWheel = (e) => {
        e.preventDefault();
        scrub.vars.offset += e.deltaY * 0.0009;
        scrub.invalidate().restart();
        clearTimeout(wheelTO);
        wheelTO = setTimeout(() => scrollToOffset(scrub.vars.offset), 120);
      };
      container.addEventListener("wheel", onWheel, { passive: false });

      const onKey = (e) => {
        if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); onNext(); }
        else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); onPrev(); }
      };
      window.addEventListener("keydown", onKey);

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
    };
  }, []);

  const repeat = Math.max(3, Math.ceil(20 / data.slides.length));
  const cards  = Array.from({ length: repeat }).flatMap(() => data.slides);

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="gallery-close" onClick={onClose} aria-label="Close gallery">×</button>
      {data.url && (
        <a className="gallery-visit" href={data.url} target="_blank" rel="noopener noreferrer">↗ visit site</a>
      )}

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
          <a className="gallery-info-link" href={data.url} target="_blank" rel="noopener noreferrer">visit site ↗</a>
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

/* ── Thumbnail carousel gallery (cavitemototech) ── */
function ThumbnailGallery({ data, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.galleryOpen = "1";
    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.galleryOpen;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (fullscreen) { setFullscreen(false); } else { onClose(); }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose, fullscreen]);

  useEffect(() => {
    const total = data.slides.length;
    const onKey = (e) => {
      if      (e.key === "ArrowLeft")  { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setActiveIdx(i => Math.min(total - 1, i + 1)); }
      else if (e.key === "Home")       { e.preventDefault(); setActiveIdx(0); }
      else if (e.key === "End")        { e.preventDefault(); setActiveIdx(total - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data.slides.length]);

  useEffect(() => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const slide  = slider.children[activeIdx];
    if (!slide) return;
    slider.scrollTo({
      left: slide.offsetLeft - slider.clientWidth / 2 + slide.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [activeIdx]);

  const slide   = data.slides[activeIdx];
  const isFirst = activeIdx === 0;
  const isLast  = activeIdx === data.slides.length - 1;

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="thumb-gallery-wrap">

        {/* Header: title · visit link · close */}
        <div className="thumb-header">
          <h3 className="thumb-gallery-title">{data.title}</h3>
          <div className="thumb-header-actions">
            {data.url && (
              <a className="thumb-visit-btn" href={data.url} target="_blank" rel="noopener noreferrer">
                ↗ visit site
              </a>
            )}
            <button className="thumb-close-btn" onClick={onClose} aria-label="Close gallery">×</button>
          </div>
        </div>

        <div className="image-thumbnail-carousel">
          <section className="image-display" onClick={() => setFullscreen(true)} title="Click to expand">
            <div className="tgscreen">
              <img src={slide.bg} alt={slide.label || ""} />
            </div>
            <div className="tg-zoom-hint">⤢</div>
          </section>

          {/* Caption: label + description sits between image and thumbnails */}
          <div className="thumb-slide-info">
            {slide.label && <span className="thumb-gallery-label">{slide.label}</span>}
            {slide.desc  && <p className="thumb-gallery-desc">{slide.desc}</p>}
          </div>

          <section className="thumbnail-carousel">
            <button
              type="button"
              className="carousel__btn prev"
              aria-label="Previous slide"
              disabled={isFirst}
              onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
            >
              <svg width="16" height="16" fill="currentColor" className="tg-arrow-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
            </button>
            <ul className="carousel__slider" ref={sliderRef}>
              {data.slides.map((s, i) => (
                <li
                  key={i}
                  className={`carousel__slide${i === activeIdx ? " active" : ""}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <div className="tg-thumbnail">
                    <img loading="lazy" src={s.bg} alt={s.label || ""} />
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="carousel__btn next"
              aria-label="Next slide"
              disabled={isLast}
              onClick={() => setActiveIdx(i => Math.min(data.slides.length - 1, i + 1))}
            >
              <svg width="16" height="16" fill="currentColor" className="tg-arrow-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
              </svg>
            </button>
          </section>
        </div>
      </div>

      {fullscreen && (
        <div className="tg-fullscreen" onClick={() => setFullscreen(false)}>
          <img src={slide.bg} alt={slide.label || ""} />
          <button className="tg-fullscreen-close" onClick={() => setFullscreen(false)} aria-label="Close fullscreen">×</button>
        </div>
      )}
    </div>
  );
}

/* ── Router ── */
function Gallery() {
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const open = (e) => setSlug(e.detail.slug);
    window.addEventListener("open-gallery", open);
    return () => window.removeEventListener("open-gallery", open);
  }, []);

  if (!slug) return null;
  const data = GALLERY_DATA[slug];
  if (!data) return null;

  if (data.type === "thumbnail") {
    return <ThumbnailGallery data={data} onClose={() => setSlug(null)} />;
  }
  return <GsapGallery data={data} onClose={() => setSlug(null)} />;
}

Object.assign(window, { Gallery, GALLERY_DATA });

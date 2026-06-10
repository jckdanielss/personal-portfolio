/* sections: hero, about, stack, projects, timeline, contact */

const { useEffect, useRef, useState, useMemo } = React;

/* ─── Reveal on scroll wrapper ─── */
function Reveal({ children, delay = 0, as: As = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("in"), delay);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "-50px 0px -100px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <As ref={ref} className={`reveal ${className}`} {...rest}>{children}</As>;
}

/* ─── Nav ─── */
const NAV_LINKS = [
  ["about", "01"], ["stack", "02"], ["skills", "03"],
  ["work", "04"], ["journey", "05"], ["contact", "06"],
];

function Nav({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const els = NAV_LINKS.map(([id]) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="logo" data-cursor-hover>
          <span className="logo-mark">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 2h5.5C11 2 13 4 13 7s-2 5-4.5 5H3V2z" fill="white"/>
              <path d="M9.5 2L13 7l-3.5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>marc daniel</span>
        </a>
        <div className="nav-links">
          {NAV_LINKS.map(([id, n]) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              <span className="num">{n}</span>{id}
            </a>
          ))}
        </div>
        <button className="theme-btn" data-cursor-hover onClick={toggleTheme} aria-label="toggle theme">
          {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
        </button>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const roles = useMemo(
    () => ["full-stack dev", "spreadsheet murderer", "level grinder", "playlist curator", "BSIT student"],
    []
  );
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[roleIdx];
    if (!deleting && typed === word) {
      const t = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(t);
    }
    if (deleting && typed === "") {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
      return;
    }
    const t = setTimeout(() => {
      setTyped((s) => (deleting ? s.slice(0, -1) : word.slice(0, s.length + 1)));
    }, deleting ? 45 : 75);
    return () => clearTimeout(t);
  }, [typed, deleting, roleIdx, roles]);

  // parallax blob
  const b1 = useRef(null), b2 = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (b1.current) b1.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (b2.current) b2.current.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className="hero" id="top">
      <div className="hero-blob b1" ref={b1}></div>
      <div className="hero-blob b2" ref={b2}></div>

      <div className="wrap hero-content">
        <div className="hero-layout">
          <div className="hero-copy">
            <Reveal>
              <p className="hello-tag"><span className="status-dot" aria-hidden="true"></span>available for freelance — Q3 2026</p>
            </Reveal>

            <Reveal delay={100}>
              <h1>
                <span className="line-mask"><span className="line">hey, i&rsquo;m <span className="grad">Marc Daniel</span>—</span></span>
                <span className="line-mask"><span className="line">
                  a <span className="role-rotator" style={{ fontSize: ".7em" }}>
                    <span className="role-word">{typed}</span>
                    <span className="caret"></span>
                  </span>
                </span></span>
                <span className="line-mask"><span className="line">who actually{" "}
                  <span className="scribble-wrap">
                    <span className="grad-2">ships</span>
                    <svg className="scribble" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="scrib-g" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="#5eead4" />
                          <stop offset="1" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                      <path d="M2 8 C 18 2, 36 11, 52 6 S 84 3, 98 7" pathLength="1" fill="none" stroke="url(#scrib-g)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                    </svg>
                  </span>.</span></span>
              </h1>
            </Reveal>

            <div className="hero-meta">
              <Reveal delay={200} className="lead">
                <p style={{ margin: 0 }}>
                  4th-year BSIT student building full-stack systems through thesis projects, client work, and a lot of late-night debugging. i like clean UX, practical features, and shipping things people can actually use.
                </p>
              </Reveal>
              <Reveal delay={280} className="meta-block">
                <div className="k">◉ based in</div>
                <div className="v">Cavite, Philippines<br/>UTC+8</div>
              </Reveal>
              <Reveal delay={340} className="meta-block">
                <div className="k">◉ currently</div>
                <div className="v">finishing thesis<br/>+ freelance builds</div>
              </Reveal>
            </div>

            <Reveal delay={400} className="hero-cta">
              <a className="btn primary" href="#work" data-cursor-hover data-magnet>
                see selected work <Icon.arrow className="arrow" width={14} height={14} />
              </a>
              <a className="btn ghost" href="#contact" data-cursor-hover data-magnet>
                <Icon.mail width={14} height={14} /> get in touch
              </a>
            </Reveal>
          </div>

          <Reveal delay={220} className="hero-photo-wrap">
            <figure className="polaroid" data-cursor-hover>
              <span className="tape" aria-hidden="true"></span>
              <img src="pfp.jpg" alt="Marc Daniel portrait" className="hero-photo" />
              <figcaption className="polaroid-cap">
                <span>marc_daniel.jpg</span>
                <span>cavite · utc+8</span>
              </figcaption>
            </figure>
            <div className="orbit-badge" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                </defs>
                <text>
                  <textPath href="#badge-circle" textLength="224" lengthAdjust="spacingAndGlyphs">open for freelance ✦ actually ships ✦</textPath>
                </text>
              </svg>
              <span className="orbit-star">✺</span>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
}

/* ─── Marquee ticker ─── */
function Ticker() {
  const words = [
    ["schema → api → ui → deploy", false],
    ["ships on time", true],
    ["laravel × vue", false],
    ["pixel-careful", true],
    ["no lorem ipsum", false],
    ["3d side-quests", true],
    ["cavite, ph", false],
    ["full-stack, actually", true],
  ];
  const chunk = (key) => (
    <div className="ticker-chunk" key={key}>
      {words.map(([w, serif], i) => (
        <React.Fragment key={i}>
          <span className={`ticker-word${serif ? " serif" : ""}`}>{w}</span>
          <span className="ticker-star">✺</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">{[0, 1, 2].map(chunk)}</div>
    </div>
  );
}

/* ─── About ─── */
function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="section-num">01 — About</div>
            <h2 className="section-title">
              I build the boring parts so the <em>fun parts</em> can ship.
            </h2>
          </div>
          <div className="right">
            ships full products<br/>
            not just prototypes<br/>
            available Q3 2026
          </div>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-text" delay={100}>
            <p>
              I taught myself how to build things properly by breaking them first. School gave me the foundation  but the real growth came from thesis deadlines, actual clients, and the kind of pressure that makes you rewrite a feature at 2am because it <em>has</em> to work by morning.
            </p>
            <p>
              If you work with me, you get someone who handles the full picture. I&rsquo;ve built an <strong>Integrated Management Platform for Motorcycle Shops that is scalable</strong>, a <strong>booking platform for a transport business</strong>, and smaller sites in between  each one shipped, live, and used by real people. I don&rsquo;t hand things off halfway. I do the schema, the API, the UI, and the deploy. The stuff clients notice without knowing why the button that feels right, the price that calculates correctly, the page that loads fast that&rsquo;s the part I care about most.
            </p>
            <p>
              When I&rsquo;m not shipping: I&rsquo;m probably 300 hours deep into a game I&rsquo;ve already finished, shuffling through playlists I&rsquo;ll never stop curating, or convincing myself that learning <span className="highlight">Blender</span> totally counts as work. BSIT 4th year. Based in Cavite. Runs on coffee and a questionable sleep schedule.
            </p>
          </Reveal>

          <Reveal className="about-card" delay={220} as="aside">
            <div className="card-head">
              <span className="dots"><i></i><i></i><i></i></span>
              about.json
            </div>
            <div className="row"><span className="k">name</span><span className="v">"Marc Daniel U. Dela Cruz"</span></div>
            <div className="row"><span className="k">role</span><span className="v">"full-stack dev"</span></div>
            <div className="row"><span className="k">edu</span><span className="v">"BSIT · 4th yr"</span></div>
            <div className="row"><span className="k">stack</span><span className="v">[vue, react, laravel, php, ts, postgres]</span></div>
            <div className="row"><span className="k">status</span>
              <span className="v"><span className="pill">● open</span>freelance + collabs</span>
            </div>
            <div className="row"><span className="k">vices</span><span className="v">"gaming, music, blender fails"</span></div>
            <div className="comment">// last updated · May 2026</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Stack ─── */
function Stack() {
  const groups = [
    {
      id: "frontend",
      label: "Frontend",
      tag: "client side",
      hint: "what users actually see",
      grad: "1",
      items: [
        { name: "Vue 3",   cat: "ui",      icon: "vue"      },
        { name: "Vite",    cat: "build",   icon: "vite"     },
        { name: "Tailwind",cat: "styling", icon: "tailwind" },
        { name: "Figma",   cat: "design",  icon: "figma"    },
        { name: "React",      cat: "ui",       icon: "react"      },
        { name: "TypeScript", cat: "lang",     icon: "ts"         },
        { name: "JavaScript", cat: "lang",     icon: "javascript" },
        { name: "Bootstrap",  cat: "styling",  icon: "bootstrap"  },
        { name: "shadcn/ui",  cat: "components", icon: "shadcnui" },
        { name: "Vue Router", cat: "routing",  icon: "vuerouter"  },
      ],
    },
    {
      id: "backend",
      label: "Backend",
      tag: "server side",
      hint: "framework, lang & db",
      grad: "2",
      items: [
        { name: "Laravel", cat: "framework", icon: "laravel" },
        { name: "PHP",     cat: "lang",      icon: "php"     },
        { name: "MySQL",   cat: "database",  icon: "mysql"   },
        { name: "Pusher",  cat: "realtime",  icon: "pusher"  },
        { name: "PostgreSQL",        cat: "database", icon: "postgres" },
        { name: "Supabase",          cat: "backend",  icon: "supabase" },
        { name: "Firebase",          cat: "backend",  icon: "firebase" },
        { name: "MongoDB",           cat: "database", icon: "mongodb"  },
      ],
    },
    {
      id: "tools",
      label: "Tools & Services",
      tag: "everything else",
      hint: "3d · mobile · maps · vcs",
      grad: "3",
      items: [
        { name: "Three.js",  cat: "3d",     icon: "three"     },
        { name: "Capacitor", cat: "mobile", icon: "capacitor" },
        { name: "Leaflet",   cat: "maps",   icon: "leaflet"   },
        { name: "Git",       cat: "vcs",    icon: "git"       },
        { name: "GitHub",        cat: "repo",       icon: "github"   },
        { name: "Vercel",        cat: "deploy",     icon: "vercel"   },
        { name: "Blender",       cat: "3d",         icon: "blender"  },
      ],
    },
  ];
  const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section id="stack">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="section-num">02 — Stack</div>
            <h2 className="section-title">
              Tools I reach for <em>without thinking</em>.
            </h2>
          </div>
          <div className="right">
            {totalItems} things I trust,<br/>
            split across 3 layers.
          </div>
        </Reveal>

        <div className="stack-groups">
          {groups.map((g, gi) => (
            <Reveal key={g.id} delay={gi * 80} className="stack-group" data-grad={g.grad}>
              <header className="stack-group-head">
                <div className="stack-group-label">
                  <span className="stack-group-dot" />
                  <span className="stack-group-name">{g.label}</span>
                  <span className="stack-group-tag">{g.tag}</span>
                </div>
                <div className="stack-group-hint">{g.hint}</div>
                <div className="stack-group-count">
                  <span>{String(g.items.length).padStart(2, "0")}</span>
                  <span className="stack-group-count-label">tools</span>
                </div>
              </header>
              <div className="stack-grid">
                {g.items.map((it, i) => (
                  <div className="stack-chip" data-grad={g.grad} data-cursor-hover key={it.name}
                    style={{ transitionDelay: `${i * 20}ms` }}>
                    <div className="icon"><TechIcon name={it.icon} /></div>
                    <div className="name">{it.name}</div>
                    <div className="cat">{it.cat}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Technical Skills ─── */
function TechSkills() {
  const skills = [
    {
      name: "Role-Based Access Control",
      short: "RBAC",
      desc: "Multi-role user systems with granular permission gates. Built with Spatie Permissions on Laravel — 7 roles in production.",
      tags: ["Laravel", "Spatie", "middleware"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
    {
      name: "REST API Design",
      short: "APIs",
      desc: "Resource-oriented endpoints, auth middleware, versioning, and consistent response structures consumed by web + mobile clients.",
      tags: ["Laravel", "JSON", "Sanctum"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
    {
      name: "Automated Email",
      short: "mail",
      desc: "Queued notifications, templated SMTP mail (quotations, OTP, confirmations) with Laravel Queues + Mail facades.",
      tags: ["Laravel", "SMTP", "queues"],
      usedIn: { label: "DC Transport", href: "https://dctransport.ogm1.com" },
    },
    {
      name: "Real-time Events",
      short: "live",
      desc: "WebSocket broadcasting via Pusher for live dashboards, instant notifications, and collaborative UX.",
      tags: ["Pusher", "Laravel Echo", "WebSockets"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
    {
      name: "OTP & Auth Flows",
      short: "auth",
      desc: "Guest OTP verification via SMS/email, session management, Sanctum token auth for SPA + mobile.",
      tags: ["Sanctum", "OTP", "sessions"],
      usedIn: { label: "DC Transport", href: "https://dctransport.ogm1.com" },
    },
    {
      name: "Database Design",
      short: "schema",
      desc: "Relational schema modeling, migrations, normalization, and query optimization across MySQL and PostgreSQL.",
      tags: ["MySQL", "PostgreSQL", "migrations"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
    {
      name: "Frontend Architecture",
      short: "UI",
      desc: "Component-driven UIs with Vue 3 + React. State management with Pinia, routing, reusable design systems, and Tailwind-based layouts that work on every screen size.",
      tags: ["Vue 3", "React", "Pinia", "Tailwind"],
      usedIn: { label: "DC Transport", href: "https://dctransport.ogm1.com" },
    },
    {
      name: "Mobile App Deployment",
      short: "iOS/Android",
      desc: "Web apps packaged as native mobile apps via Capacitor — handles device APIs, build pipeline, and deployment to Android. The Moto-Tech companion app runs this way in production.",
      tags: ["Capacitor", "Android", "Vue 3"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
    {
      name: "3D on the Web",
      short: "3D",
      desc: "Three.js-powered interactive experiences inside the browser. Built a live CVT part configurator for a motorcycle ERP — users pick and preview real components in 3D.",
      tags: ["Three.js", "WebGL", "Blender"],
      usedIn: { label: "Moto-Tech Hub", href: "https://cavitemototech.ogm1.com" },
    },
  ];

  return (
    <section id="skills">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="section-num">03 — Skills</div>
            <h2 className="section-title">
              What I know how to <em>actually do</em>.
            </h2>
          </div>
          <div className="right">
            cross-cutting capabilities,<br/>
            not just tool names.
          </div>
        </Reveal>

        <div className="skills-grid">
          {skills.map((s, i) => (
            <Reveal key={s.name} delay={i * 60} className="skill-card" data-cursor-hover>
              <span className="skill-idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div className="skill-card-head">
                <span className="skill-short">{s.short}</span>
                <span className="skill-name">{s.name}</span>
              </div>
              <p className="skill-desc">{s.desc}</p>
              <div className="skill-footer">
                <div className="skill-tags">
                  {s.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
                {s.usedIn && (
                  <a className="skill-used-in" href={s.usedIn.href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                    used in → {s.usedIn.label}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Project preview art (placeholder for live screenshots) ─── */
function ProjectArt({ kind }) {
  if (kind === "moto") {
    return (
      <div className="placeholder-art" style={{
        background: "linear-gradient(135deg, #ff8a65, #a78bfa)",
        color: "white",
      }}>
        <svg viewBox="0 0 200 100" width="80%" height="80%" fill="none" stroke="white" strokeWidth="2">
          <circle cx="50" cy="70" r="20" />
          <circle cx="150" cy="70" r="20" />
          <path d="M50 70 L90 40 L130 40 L150 70" />
          <path d="M85 40 L70 25 L100 25" />
          <circle cx="50" cy="70" r="6" fill="white" />
          <circle cx="150" cy="70" r="6" fill="white" />
        </svg>
      </div>
    );
  }
  if (kind === "van") {
    return (
      <div className="placeholder-art" style={{
        background: "linear-gradient(135deg, #5eead4, #818cf8)",
        color: "white",
      }}>
        <svg viewBox="0 0 200 100" width="80%" height="80%" fill="none" stroke="white" strokeWidth="2">
          <path d="M20 70 L20 40 L60 30 L160 30 L180 50 L180 70" />
          <circle cx="55" cy="75" r="10" />
          <circle cx="145" cy="75" r="10" />
          <line x1="65" y1="40" x2="65" y2="65" />
          <line x1="100" y1="40" x2="100" y2="65" />
          <line x1="135" y1="40" x2="135" y2="65" />
        </svg>
      </div>
    );
  }
  if (kind === "portfolio") {
    return (
      <div className="placeholder-art" style={{
        background: "linear-gradient(135deg, #fcd34d, #f472b6)",
        color: "white",
      }}>
        <svg viewBox="0 0 200 100" width="70%" height="70%" fill="white">
          <rect x="20" y="20" width="160" height="60" rx="8" fill="none" stroke="white" strokeWidth="2" />
          <rect x="32" y="34" width="40" height="8" rx="2" />
          <rect x="32" y="48" width="80" height="4" rx="2" opacity=".7" />
          <rect x="32" y="58" width="60" height="4" rx="2" opacity=".5" />
          <circle cx="155" cy="50" r="14" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
    );
  }
  return null;
}

/* ─── Projects ─── */
function Projects() {
  const items = [
    {
      num: "01",
      title: "Cavite Moto-Tech Hub",
      desc: "Full-stack ERP for motorcycle shops — 7 user roles, complete business lifecycle from booking to finance &amp; staff management, 3D CVT customizer, and a companion Android app",
      stack: "Vue 3 · Laravel · PHP · MySQL · Tailwind · shadcn/ui · Three.js · Capacitor",
      year: "2025 — now",
      href: "https://cavitemototech.ogm1.com",
      art: "moto",
    },
    {
      num: "02",
      title: "D.C. Transport Services",
      desc: "Van-rental booking platform — OTP-verified guest bookings, interactive map pinning with auto-fill, route-aware pricing across 27 distance bands, and admin quote + calendar dashboard",
      stack: "Vue 3 · Laravel · PHP · MySQL · Leaflet",
      year: "2026",
      href: "https://dctransport.ogm1.com",
      art: "van",
    },
    {
      num: "03",
      title: "Den · VA Portfolio",
      desc: "Sister&rsquo;s virtual-assistant portfolio site — design, build, and deploy",
      stack: "HTML · CSS · JavaScript · Vercel · Figma",
      year: "2026",
      href: "https://den-portfolio-plum.vercel.app",
      art: "portfolio",
    },
  ];

  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="section-num">04 — Work</div>
            <h2 className="section-title">
              Selected things I&rsquo;ve <em>actually shipped</em>.
            </h2>
          </div>
          <div className="right">
            3 projects.<br/>
            live + revenue-touching.
          </div>
        </Reveal>

        <Reveal>
          <div className="project-list">
            {items.map((p, i) => {
              return (
                <a
                  className="project-row"
                  data-cursor-hover
                  key={i}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseMove={(e) => {
                    const row = e.currentTarget;
                    const rect = row.getBoundingClientRect();
                    const pv = row.querySelector(".preview");
                    if (pv) {
                      pv.style.left = (e.clientX - rect.left) + "px";
                      pv.style.top = (e.clientY - rect.top) + "px";
                    }
                  }}
                >
                  <span className="num">{p.num}</span>
                  <span className="title">{p.title}</span>
                  <div className="meta">
                    <span className="desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    <span className="stack-used">{p.stack}</span>
                  </div>
                  <span className="year">{p.year}</span>
                  <span className="go">
                    <Icon.arrow width={14} height={14} />
                  </span>
                  <div className="preview">
                    <ProjectArt kind={p.art} />
                  </div>
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Timeline ─── */
function Journey() {
  const items = [
    {
      when: "2026 · NOW",
      what: "Final-year thesis + freelance",
      where: "BSIT · finishing strong",
      detail: "Wrapping up senior-year capstone while taking on small client work. Open to junior / intern roles starting Q3.",
      tags: ["thesis", "freelance", "open to work"],
    },
    {
      when: "2026",
      what: "DC Transport — booking MVP",
      where: "family business",
      detail: "Designed + built the booking portal for our family&rsquo;s van-rental business. Guest OTP, distance-based price estimator, admin dashboard with email quotations.",
      tags: ["laravel", "vue.js", "leaflet", "mysql"],
    },
    {
      when: "2025 — now",
      what: "CaviteMotoTech — shop ERP",
      where: "client platform",
      detail: "Solo-built ERP for a local motorcycle shop. Five role-based dashboards, supplier ↔ inventory ↔ POS flow, and a Three.js-powered CVT configurator.",
      tags: ["laravel", "vue.js", "three.js", "tailwind"],
    },
    {
      when: "2026",
      what: "Den · VA Portfolio",
      where: "personal client",
      detail: "Designed and shipped a portfolio site for my sister&rsquo;s virtual-assistant work. First fully-deployed project I ran end-to-end.",
      tags: ["next.js", "vercel", "design"],
    },
    {
      when: "2023",
      what: "Started BSIT",
      where: "National College of Science and Technology",
      detail: "Picked up the basics, then went off-syllabus. First real apps, first deployment, first paying client.",
      tags: ["beginnings"],
    },
  ];

  return (
    <section id="journey">
      <div className="wrap">
        <Reveal className="section-head">
          <div>
            <div className="section-num">05 — Journey</div>
            <h2 className="section-title">
              From <em>fixing spreadsheets</em> to shipping platforms.
            </h2>
          </div>
          <div className="right">
            chronological.<br/>
            mostly truthful.
          </div>
        </Reveal>

        <Reveal>
          <div className="timeline">
            {items.map((t, i) => (
              <div className="tl-item" key={i} data-cursor-hover>
                <div className="when">{t.when}</div>
                <h3 className="what">{t.what}</h3>
                <div className="where">{t.where}</div>
                <p className="detail" dangerouslySetInnerHTML={{ __html: t.detail }} />
                <div className="tags">{t.tags.map((tag, j) => <span key={j}>{tag}</span>)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "marcdanieldelacruz599@gmail.com";
  const phone = "09602020493";
  const copy = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-blob"></div>
      <div className="wrap contact-inner">
        <Reveal>
          <div className="eyebrow">06 — Let&rsquo;s build</div>
          <h2>
            got something <em>weird</em><br/>to build?
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 18, maxWidth: 540, margin: "0 auto", textWrap: "pretty" }}>
            I&rsquo;m taking on a few freelance projects after thesis. Custom platforms, internal tools, and very specific 3D side-quests welcome.
          </p>
          <button className="email-btn" onClick={copy} data-cursor-hover data-magnet>
            <Icon.mail width={16} height={16} />
            {copied ? "copied to clipboard ✓" : email}
            {!copied && <Icon.copy width={14} height={14} />}
          </button>
          <div className="socials">
            <a href="https://www.facebook.com/daniel.502270/" target="_blank" rel="noopener noreferrer me" data-cursor-hover>facebook</a>
            <a href={`tel:+63${phone.slice(1)}`} data-cursor-hover>{phone}</a>
            <a href="https://github.com/jckdanielss" target="_blank" rel="noopener noreferrer me" data-cursor-hover><Icon.github width={14} height={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />github</a>
            <a href="https://www.linkedin.com/in/marc-daniel-dela-cruz-8a16b43b9/" target="_blank" rel="noopener noreferrer me" data-cursor-hover><Icon.linkedin width={14} height={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />linkedin</a>
          </div>
        </Reveal>

        <div className="name-marquee" aria-hidden="true">
          <div className="name-marquee-track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>marc daniel <em>✺</em> </span>
            ))}
          </div>
        </div>

        <footer className="foot">
          <div>© 2026 Marc Daniel Dela Cruz. handcoded with caffeine.</div>
        </footer>
      </div>
    </section>
  );
}

Object.assign(window, { Reveal, Nav, Hero, Ticker, About, Stack, TechSkills, Projects, Journey, Contact });

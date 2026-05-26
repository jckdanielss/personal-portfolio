/* icons + stack tile art — kept simple, glyph-style SVGs */

const Icon = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  ),
  sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  ),
  github: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.64-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05.8-.23 1.65-.34 2.5-.34s1.7.11 2.5.34c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>
    </svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.22 8h4.54v14H.22V8zm7.5 0h4.36v1.93h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v8.43h-4.55v-7.47c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.94-2.86 3.94V22H7.72V8z"/>
    </svg>
  ),
  copy: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
};

/* tech logos — real brand marks via simple-icons CDN */
const BRANDS = {
  vue:       { slug: "vuedotjs",    color: "4FC08D", mono: false },
  vite:      { slug: "vite",        color: "646CFF", mono: false },
  tailwind:  { slug: "tailwindcss", color: "06B6D4", mono: false },
  figma:     { slug: "figma",       color: "F24E1E", mono: false },
  laravel:   { slug: "laravel",     color: "FF2D20", mono: false },
  php:       { slug: "php",         color: "777BB4", mono: false },
  mysql:     { slug: "mysql",       color: "4479A1", mono: false },
  pusher:    { slug: "pusher",      color: "300D4F", mono: true  },
  three:     { slug: "threedotjs",  color: "000000", mono: true  },
  capacitor: { slug: "capacitor",   color: "119EFF", mono: false },
  leaflet:   { slug: "leaflet",     color: "199900", mono: false },
  git:       { slug: "git",         color: "F05032", mono: false },
  react:     { slug: "react",       color: "61DAFB", mono: false },
  next:      { slug: "nextdotjs",   color: "000000", mono: true  },
  ts:        { slug: "typescript",  color: "3178C6", mono: false },
  node:      { slug: "nodedotjs",   color: "5FA04E", mono: false },
  express:   { slug: "express",     color: "000000", mono: true  },
  postgres:  { slug: "postgresql",  color: "4169E1", mono: false },
  prisma:    { slug: "prisma",      color: "2D3748", mono: true  },
  supabase:  { slug: "supabase",    color: "3FCF8E", mono: false },
  github:    { slug: "github",      color: "181717", mono: true  },
  vercel:    { slug: "vercel",      color: "000000", mono: true  },
  docker:    { slug: "docker",      color: "2496ED", mono: false },
  blender:   { slug: "blender",     color: "E87D0D", mono: false },
};

const TechIcon = ({ name }) => {
  const brand = BRANDS[name];
  if (brand) {
    return (
      <img
        className="tech-logo"
        data-mono={brand.mono ? "true" : "false"}
        src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color}`}
        alt={name}
        width="28"
        height="28"
        loading="lazy"
        draggable="false"
      />
    );
  }
  const common = { width: 28, height: 28, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return <svg {...common}><rect x="4" y="4" width="24" height="24" rx="6" /></svg>;
};

window.Icon = Icon;
window.TechIcon = TechIcon;

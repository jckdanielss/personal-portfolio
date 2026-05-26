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

/* tech icons rendered as small minimal SVG glyphs */
const TechIcon = ({ name }) => {
  const common = { width: 28, height: 28, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "react":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="2.2" fill="currentColor" stroke="none" />
          <ellipse cx="16" cy="16" rx="11" ry="4.4" />
          <ellipse cx="16" cy="16" rx="11" ry="4.4" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="11" ry="4.4" transform="rotate(120 16 16)" />
        </svg>
      );
    case "next":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" />
          <path d="M11 11v10M11 11l10 12" />
        </svg>
      );
    case "node":
      return (
        <svg {...common}>
          <path d="M16 3l11 6.5v13L16 29 5 22.5v-13L16 3z" />
          <path d="M11 18c0 2 1.4 3 3.5 3s3.5-1 3.5-2.6c0-1.4-1-2-3-2.4-2-.3-3-.8-3-2.2 0-1.6 1.4-2.6 3.5-2.6 1.6 0 2.8.7 3.3 2" />
        </svg>
      );
    case "ts":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="24" height="24" rx="3" />
          <path d="M9 14h7M12.5 14v9M18 21.5c.5 1 1.5 1.5 3 1.5 2 0 3-1 3-2.2 0-1-.7-1.6-2.4-2.2-1.7-.5-2.5-1-2.5-2.2 0-1.2 1-2 2.6-2 1.3 0 2.2.5 2.7 1.4" />
        </svg>
      );
    case "tailwind":
      return (
        <svg {...common}>
          <path d="M5 17c1.5-4 4-6 7.5-6 5 0 5 4 8.5 4 1.7 0 3-.6 4-1.8-1.5 4-4 6-7.5 6-5 0-5-4-8.5-4-1.7 0-3 .6-4 1.8z" />
        </svg>
      );
    case "postgres":
      return (
        <svg {...common}>
          <ellipse cx="16" cy="9" rx="11" ry="4" />
          <path d="M5 9v7c0 2.2 4.9 4 11 4s11-1.8 11-4V9" />
          <path d="M5 16v7c0 2.2 4.9 4 11 4s11-1.8 11-4v-7" />
        </svg>
      );
    case "prisma":
      return (
        <svg {...common}>
          <path d="M11 4l-6 18 14 6 8-22-16-2z" />
          <path d="M11 4l8 24" />
        </svg>
      );
    case "three":
      return (
        <svg {...common}>
          <path d="M16 4L6 9v14l10 5 10-5V9L16 4z" />
          <path d="M6 9l10 5 10-5M16 14v14" />
        </svg>
      );
    case "figma":
      return (
        <svg {...common}>
          <path d="M11 4h5v8h-5a4 4 0 010-8z" />
          <path d="M16 4h5a4 4 0 010 8h-5V4z" />
          <path d="M16 12h5a4 4 0 010 8h-5v-8z" />
          <path d="M11 12h5v8h-5a4 4 0 010-8z" />
          <circle cx="11" cy="24" r="4" />
        </svg>
      );
    case "git":
      return (
        <svg {...common}>
          <path d="M28 14.5L17.5 4a2 2 0 00-3 0L12 6.5l3 3a2.4 2.4 0 013 3l3 3a2.4 2.4 0 11-1.5 1.5l-3-3v8a2.4 2.4 0 11-1.5-.5V13a2.4 2.4 0 01-1.5-1.5L8 14.5a2 2 0 000 3L18.5 28a2 2 0 003 0L28 17.5a2 2 0 000-3z" />
        </svg>
      );
    case "docker":
      return (
        <svg {...common}>
          <rect x="4" y="13" width="4" height="4" />
          <rect x="9" y="13" width="4" height="4" />
          <rect x="14" y="13" width="4" height="4" />
          <rect x="9" y="8" width="4" height="4" />
          <rect x="14" y="8" width="4" height="4" />
          <rect x="14" y="3" width="4" height="4" />
          <path d="M2 17h22c0 4-3 7-8 7-7 0-13-3-14-7z" />
        </svg>
      );
    case "vercel":
      return (
        <svg {...common}>
          <path d="M16 5l13 22H3L16 5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "supabase":
      return (
        <svg {...common}>
          <path d="M17 3v14h11L15 29V15H4L17 3z" />
        </svg>
      );
    case "tauri":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="10" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" />
          <circle cx="20" cy="19" r="1.5" fill="currentColor" />
        </svg>
      );
    case "express":
      return (
        <svg {...common}>
          <path d="M3 11l8 10L3 21M21 11l-8 10 8 0M8 21h16" />
        </svg>
      );
    case "blender":
      return (
        <svg {...common}>
          <circle cx="16" cy="18" r="6" />
          <path d="M10 22l6-12 6 8" />
        </svg>
      );
    case "vue":
      return (
        <svg {...common}>
          <path d="M4 5h6l6 11 6-11h6L16 27 4 5z" />
          <path d="M10 5h12L16 14 10 5z" />
        </svg>
      );
    case "vite":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M18 3L8 18h7l-4 11 14-17h-8z" />
        </svg>
      );
    case "laravel":
      return (
        <svg {...common}>
          <path d="M6 8l5 2.5v12l11 5-1.5 2.5L5 23V9.5L6 8z" />
          <path d="M11 10.5l11 5.5-11 5.5" />
        </svg>
      );
    case "php":
      return (
        <svg {...common}>
          <ellipse cx="16" cy="16" rx="13" ry="9" />
          <path d="M9 12.5v7M9 12.5h3.5c1.8 0 2.8 1 2.8 2.3s-1 2.2-2.8 2.2H9" />
          <path d="M18 19.5l1.5-7M19.5 12.5h3c1.5 0 2.5.8 2.5 2s-1 2-2.5 2h-3l-1.5 3" />
        </svg>
      );
    case "mysql":
      return (
        <svg {...common}>
          <ellipse cx="16" cy="8" rx="11" ry="4" />
          <path d="M5 8v16c0 2.2 4.9 4 11 4s11-1.8 11-4V8" />
          <path d="M5 16c0 2.2 4.9 4 11 4s11-1.8 11-4" />
        </svg>
      );
    case "capacitor":
      return (
        <svg {...common}>
          <line x1="4" y1="16" x2="13" y2="16" />
          <line x1="19" y1="16" x2="28" y2="16" />
          <line x1="13" y1="7" x2="13" y2="25" />
          <line x1="19" y1="7" x2="19" y2="25" />
        </svg>
      );
    case "pusher":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
          <path d="M10 10a8.5 8.5 0 000 12" />
          <path d="M22 10a8.5 8.5 0 010 12" />
          <path d="M6.5 6.5a14 14 0 000 19" />
          <path d="M25.5 6.5a14 14 0 010 19" />
        </svg>
      );
    case "leaflet":
      return (
        <svg {...common}>
          <path d="M16 4c0 0-11 5-11 14 0 5.5 4.5 9.5 11 10 6.5-.5 11-4.5 11-10C27 9 16 4 16 4z" />
          <path d="M16 4v24" />
          <path d="M9 13c3-1.5 5.5-4 7-9" />
        </svg>
      );
    default:
      return (
        <svg {...common}><rect x="4" y="4" width="24" height="24" rx="6" /></svg>
      );
  }
};

window.Icon = Icon;
window.TechIcon = TechIcon;

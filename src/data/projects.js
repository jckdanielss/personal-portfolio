export const PROJECTS = [
  {
    slug: "cavite-moto-tech",
    title: "Cavite Moto-Tech Hub",
    desc: "Full-stack ERP for motorcycle shops — 7 user roles, complete business lifecycle from booking to finance &amp; staff management, 3D CVT customizer, and a companion Android app",
    stack: "Vue 3 · Laravel · PHP · MySQL · Tailwind · shadcn/ui · Three.js · Capacitor",
    year: "2025 — now",
    href: "https://cavitemototech.ogm1.com",
    art: "img",
    imgSrc: "gallery/cavite_mototech/dashboard.png",
    gallery: "cavitemototech",
  },
  {
    slug: "dc-transport",
    title: "D.C. Transport Services",
    desc: "Van-rental booking platform — OTP-verified guest bookings, interactive map pinning with auto-fill, route-aware pricing across 27 distance bands, and admin quote + calendar dashboard",
    stack: "Vue 3 · Laravel · PHP · MySQL · Leaflet",
    year: "2026",
    href: "https://dctransport.ogm1.com",
    art: "img",
    imgSrc: "gallery/dc_transpo/dashboard.png",
    gallery: "dctranspo",
  },
  {
    slug: "den-portfolio",
    title: "Den · VA Portfolio",
    desc: "Sister&rsquo;s virtual-assistant portfolio site — design, build, and deploy",
    stack: "HTML · CSS · JavaScript · Vercel · Figma",
    year: "2026",
    href: "https://den-portfolio-plum.vercel.app",
    art: "portfolio",
    imgSrc: null,
    gallery: null,
  },
  // R Mo Global temporarily removed from the public list.
  // Re-enable by moving this object back into the array above Klori:
  // {
  //   slug: "rmo-global",
  //   title: "R Mo Global Diversity Solutions",
  //   desc: "Website for a US diversity certification consulting firm. Multi-page: services, blog, FAQ, team, networking events, contact form with captcha, and an animated client showcase (Meta · Google · CBRE · CDW).",
  //   stack: "React · HTML · CSS · JavaScript · Vercel",
  //   year: "2026",
  //   href: "https://rmo-seven.vercel.app",
  //   art: "img",
  //   imgSrc: "gallery/rmo/landing_page_hero.png",
  //   gallery: "rmo",
  // },
  {
    slug: "klori",
    title: "Klori · Calorie Tracker",
    desc: "Cross-platform nutrition app — daily kcal &amp; macro tracking (protein · carbs · fat), categorized meal logging, recipe builder with live nutrition totals, AI credits system, hydration tracking, and Google / Facebook / Apple auth",
    stack: "Flutter · Dart · Riverpod · Laravel · MySQL",
    year: "2026",
    href: null,
    art: "img",
    imgSrc: "klori_logo.png",
    gallery: "klori",
  },
];

export const shippedCount = PROJECTS.length;
export const liveCount = PROJECTS.filter((p) => Boolean(p.href)).length;

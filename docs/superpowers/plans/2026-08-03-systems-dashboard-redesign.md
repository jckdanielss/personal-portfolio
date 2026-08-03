# Systems Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio off its no-build CDN setup onto Vite, and redesign it from the current warm-cream/gradient/marquee look into a dark-native "systems dashboard" identity, with a live-data hero status board as the signature element.

**Architecture:** Same single-page React app, same component grouping (`sections.jsx`, `terminal.jsx`, `gallery.jsx`, `tweaks-panel.jsx`, `icons.jsx`), converted from global-script/Babel-standalone to real ES modules built by Vite. Two new small modules (`src/data/projects.js`, `src/lib/viewCounter.js` + `useViewCount.js`) become the single source of truth for project data and the live view counter, consumed by the Hero, Nav, Work section, and terminal alike.

**Tech Stack:** React 18, Vite, Framer Motion (new), GSAP (kept, now via npm), Vitest + @testing-library/react (new, for the two logic modules).

**Full design rationale:** `docs/superpowers/specs/2026-08-03-systems-dashboard-redesign-design.md` — read it once before starting; this plan implements it and doesn't re-derive the "why."

## Global Constraints

- Dark theme is the default (`:root` holds dark values; `html[data-theme="light"]` overrides). Toggle behavior unchanged.
- Color tokens (exact values, from spec): `--bg:#0b0d10` (light `#f7f7f9`), `--surface:#12151a` (light `#ffffff`), `--ink:#e8eaed` (light `#14161a`), `--ink-soft:#9aa1ab` (light `#54596a`), `--ink-mute:#5b6470` (light `#8b90a0`), `--line:rgba(255,255,255,.08)` (light `rgba(20,22,26,.08)`), `--accent:#7c6fef` (light `#6a5cf0`), `--ok:#34d399` (light `#16a673`), `--warn:#f5b942` (light `#c98a1a`), `--danger:#f2545b` (light `#d43b42`).
- One brand accent (`--accent`) replaces all of `--peach`/`--coral`/`--lilac`/`--indigo`/`--mint`/`--butter`/`--grad-1`/`--grad-2`/`--grad-3`. `--emerald` is renamed `--ok` (kept, same job: live/available status).
- `--font-serif` (Instrument Serif) is cut entirely — remove the Google Fonts import and every CSS rule that sets `font-family: var(--font-serif)`.
- No new backend. The view counter stays the existing free `abacus.jasoncameron.dev` hit-counter API, no server of our own.
- Keep existing per-domain file grouping (`sections.jsx`, `terminal.jsx`, `gallery.jsx`, `tweaks-panel.jsx`, `icons.jsx`) — do not split into one-component-per-file; that's a separate refactor this plan doesn't do.
- `prefers-reduced-motion` handling must keep working for every animated element, new or old.

## File Structure

```
myPortfolio/
├── index.html                 # Vite entry HTML (rewritten in Task 1)
├── package.json                # new
├── vite.config.js              # new
├── src/
│   ├── main.jsx                 # new — replaces the ReactDOM.createRoot call
│   ├── App.jsx                  # renamed from portfolio.jsx, minus the render call
│   ├── sections.jsx              # moved as-is, converted to ES modules
│   ├── terminal.jsx              # moved as-is, converted to ES modules
│   ├── gallery.jsx               # moved as-is, converted to ES modules
│   ├── tweaks-panel.jsx          # moved as-is, converted to ES modules
│   ├── icons.jsx                 # moved as-is, converted to ES modules
│   ├── styles.css                # moved as-is
│   ├── data/
│   │   └── projects.js            # new — single source of truth for project list
│   └── lib/
│       ├── viewCounter.js         # new — shared hit-counter URLs
│       └── useViewCount.js        # new — hook wrapping the get-endpoint
├── docs/                        # unchanged
├── gallery/, pfp.jpg, resume.pdf, *.png  # static assets, unchanged, stay at repo root, referenced with root-relative paths (Vite serves repo-root `public/`-style assets fine from root when copied — see Task 1 step for exact handling)
```

---

### Task 1: Vite migration (ES modules, no behavior change)

**Files:**
- Create: `package.json`, `vite.config.js`
- Create: `src/main.jsx`
- Modify → move: `portfolio.jsx` → `src/App.jsx`
- Modify → move: `sections.jsx`, `terminal.jsx`, `gallery.jsx`, `tweaks-panel.jsx`, `icons.jsx`, `styles.css` → `src/`
- Modify: `index.html`
- Move static assets referenced by `<img src="...">`/`fetch`: `pfp.jpg`, `resume.pdf`, `klori_logo.png`, `rmo_logo.png`, `gallery/**` → `public/` (Vite convention: anything in `public/` is served at the site root unchanged)

**Interfaces:**
- Produces: every module below exports named bindings instead of assigning to `window`. This is the shape every later task's imports rely on:
  - `src/icons.jsx` exports `Icon`, `TechIcon`
  - `src/tweaks-panel.jsx` exports `useTweaks`, `TweaksPanel`, `TweakSection`, `TweakRow`, `TweakSlider`, `TweakToggle`, `TweakRadio`, `TweakSelect`, `TweakText`, `TweakNumber`, `TweakColor`, `TweakButton`
  - `src/sections.jsx` exports `Reveal`, `Nav`, `Hero`, `About`, `Stack`, `TechSkills`, `Projects`, `Journey`, `Contact` (no `Ticker` — cut in Task 3)
  - `src/gallery.jsx` exports `Gallery`, `GALLERY_DATA`
  - `src/terminal.jsx` exports `Terminal`
  - `src/App.jsx` exports `App` (default export)

- [ ] **Step 1: Move static assets into `public/`**

```bash
git mv pfp.jpg resume.pdf klori_logo.png rmo_logo.png gallery public/
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "marc-daniel-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^11.11.0",
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.2",
    "jsdom": "^25.0.1",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 3: Create `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: false,
  },
});
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 5: Move source files into `src/`, create `src/data/` and `src/lib/`**

```bash
mkdir src src/data src/lib
git mv sections.jsx terminal.jsx gallery.jsx tweaks-panel.jsx icons.jsx styles.css src/
git mv portfolio.jsx src/App.jsx
```

- [ ] **Step 6: Convert `src/icons.jsx` to ES module exports**

Replace the file's final two lines:

```js
window.Icon = Icon;
window.TechIcon = TechIcon;
```

with:

```js
export { Icon, TechIcon };
```

- [ ] **Step 7: Convert `src/tweaks-panel.jsx` to ES module**

At the top of the file, add:

```js
import React from "react";
```

Replace the trailing `Object.assign(window, {...})` block:

```js
Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});
```

with:

```js
export {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
};
```

(All `React.useState`/`React.useEffect`/`React.useRef`/`React.useCallback` call sites in this file stay unchanged — the default import above makes `React.x` resolve correctly.)

- [ ] **Step 8: Convert `src/sections.jsx` to ES module**

Replace line 3:

```js
const { useEffect, useRef, useState, useMemo } = React;
```

with:

```js
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Icon, TechIcon } from "./icons.jsx";
```

Replace the trailing export line:

```js
Object.assign(window, { Reveal, Nav, Hero, Ticker, About, Stack, TechSkills, Projects, Journey, Contact });
```

with:

```js
export { Reveal, Nav, Hero, About, Stack, TechSkills, Projects, Journey, Contact };
```

(Dropping `Ticker` from the export list here is fine even though the function definition still exists in the file at this point — Task 3 deletes the function body. The bare `React.Fragment` usage inside `Ticker()` is why the default `React` import is needed alongside the named hook imports.)

- [ ] **Step 9: Convert `src/gallery.jsx` to ES module**

Replace line 6:

```js
const { useEffect, useRef, useState } = React;
```

with:

```js
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
```

Find the line `const { gsap, Draggable } = window;` inside `GsapGallery` and delete it (the imports above now provide both names directly in module scope).

Replace the trailing export line:

```js
Object.assign(window, { Gallery, GALLERY_DATA });
```

with:

```js
export { Gallery, GALLERY_DATA };
```

- [ ] **Step 10: Convert `src/terminal.jsx` to ES module**

Replace line 3:

```js
const { useEffect, useRef, useState, useCallback } = React;
```

with:

```js
import React, { useEffect, useRef, useState, useCallback } from "react";
```

Replace the trailing line:

```js
window.Terminal = Terminal;
```

with:

```js
export { Terminal };
```

- [ ] **Step 11: Convert `src/App.jsx` (was `portfolio.jsx`)**

Add near the top of the file:

```js
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from "./tweaks-panel.jsx";
import { Nav, Hero, About, Stack, TechSkills, Projects, Journey, Contact } from "./sections.jsx";
import { Terminal } from "./terminal.jsx";
import { Gallery } from "./gallery.jsx";
import "./styles.css";
```

Remove the old `useEffect` reference from `const { useEffect, useRef, useState, useMemo } = React;` if present in this file — `portfolio.jsx` didn't destructure from a bare `React` for hooks (it used `React.useRef` at one spot and bare `useEffect` via JSX scope), so check for any remaining undefined-identifier hook calls (`useRef`, `useState`) used without qualification and add them to the named-import list above if found.

Delete the last line of the file:

```js
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Add at the end of the file instead:

```js
export default App;
```

Remove the `<Ticker />` JSX usage from inside `App()`'s returned tree (it will otherwise reference an undefined identifier once `Ticker` is dropped from `sections.jsx`'s exports in Step 8) — delete the line `<Ticker />`.

- [ ] **Step 12: Create `src/main.jsx`**

```js
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
```

- [ ] **Step 13: Rewrite `index.html` for Vite**

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>marc daniel · fullstack dev</title>

<meta name="description" content="Full-stack developer based in Cavite, Philippines. I build complete web systems — schema to deploy. Available for freelance  2026." />
<meta name="author" content="Marc Daniel Dela Cruz" />

<meta property="og:type" content="website" />
<meta property="og:title" content="Marc Daniel — Full-Stack Dev" />
<meta property="og:description" content="I build complete web systems — schema to deploy. ERP, booking platforms, mobile apps. Available for freelance  2026." />
<meta property="og:image" content="/pfp.jpg" />
<meta property="og:locale" content="en_PH" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Marc Daniel — Full-Stack Dev" />
<meta name="twitter:description" content="Full-stack developer based in Cavite. Builds things that ship." />
<meta name="twitter:image" content="/pfp.jpg" />
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%237c6fef'/%3E%3Cstop offset='100%25' stop-color='%234dd8e0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M7 6h10C21.5 6 26 10.5 26 16s-4.5 10-9 10H7V6z' fill='white'/%3E%3Cpath d='M20 6L26 16l-6 10' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="cursor-ring"></div>
  <div class="cursor-dot"></div>

  <div id="root">
    <div class="init-loader">
      <div class="init-spinner"></div>
    </div>
  </div>

  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

Note what's gone from `<head>`/`<body>` versus the old file: the Instrument Serif font family in the fonts link (cut per Global Constraints), the pinned CDN `<script>` tags for React/ReactDOM/Babel/Lenis/GSAP/Draggable (now npm deps bundled by Vite), the `.cursor-aura` and `.grain` divs (cut in Task 3 — removed here already since they're dead markup the moment `CustomCursor`/`CursorAura` components stop rendering into them, and this task is the one rewriting `index.html` anyway).

- [ ] **Step 14: Smoke-test the migration**

Run: `npm run dev`, open the printed local URL in a browser.

Expected, with zero visual/behavioral change from before this task (the redesign itself hasn't started yet):
- Page renders with hero, about, stack, skills, work, journey, contact sections and footer.
- Theme toggle in nav switches light/dark.
- Pressing `` ` `` opens the terminal; `help`, `whoami`, `views` all respond.
- The tweaks panel (gear/settings trigger) opens and changing the accent swatch changes the gradient colors.
- Clicking a gallery-enabled project row opens the GSAP screenshot gallery and it's draggable.
- No console errors.

- [ ] **Step 15: Remove the old root-level duplicates and commit**

```bash
git rm index.html.orig 2>/dev/null || true
git add -A
git commit -m "Migrate build tooling from CDN/Babel-standalone to Vite + npm"
```

(There is no `index.html.orig` — that `git rm` is a no-op guard in case of a stray backup; the real `index.html` was already moved/rewritten in place via `git mv`-tracked history from Step 13's edit.)

---

### Task 2: Design tokens — color, typography, global chrome

**Files:**
- Modify: `src/styles.css:1-38` (`:root` and `html[data-theme="dark"]` blocks)
- Modify: `src/styles.css:87` (`::selection`)
- Modify: `src/styles.css:108` (`.init-spinner`)
- Modify: `src/styles.css:240` (`.nav-links a.active .num`) — superseded by Task 7's Nav rewrite, skip if Task 7 lands first
- Modify: `src/styles.css:305,312` (`.status-dot`, `.status-dot::after`)
- Modify: `src/styles.css:589` (`.section-title em`)
- Modify: `src/styles.css:678-679` (`.about-card .row .v .pill`)
- Modify: `src/styles.css:1281` (`.scroll-progress`)
- Modify: `src/styles.css:1525,1538,1551,1561,1574,1581` (terminal color fallbacks)
- Modify: `src/App.jsx` (`TWEAK_DEFAULTS`, `ACCENT_MAP`, accent `useEffect`)
- Modify: `src/App.jsx` (the `<TweakColor options={...}>` call)

**Interfaces:**
- Produces: `--bg`, `--surface`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`, `--line-strong`, `--accent`, `--ok`, `--warn`, `--danger` as the only color tokens the rest of this plan's tasks may reference. `--card`/`--card-hover` are kept (rename their *values* to derive from `--surface`, keep the *names* — many later tasks still use `var(--card)`).
- Consumes: nothing (this is the base layer everything else in the plan builds on — do this task before 3, 4, and 7–15).

- [ ] **Step 1: Rewrite the `:root` and dark/light blocks in `src/styles.css`**

Replace lines 1-38 (the original `:root { ... }` block) with:

```css

  :root {
    /* dark is the default theme */
    --bg: #0b0d10;
    --bg-2: #101319;
    --ink: #e8eaed;
    --ink-soft: #9aa1ab;
    --ink-mute: #5b6470;
    --line: rgba(255,255,255,.08);
    --line-strong: rgba(255,255,255,.16);
    --card: #12151a;
    --card-hover: #171b22;

    --accent: #7c6fef;
    --ok: #34d399;
    --warn: #f5b942;
    --danger: #f2545b;

    --aura-x: 50%;
    --aura-y: 28%;
    --aura-x-2: 54%;
    --aura-y-2: 58%;

    --radius: 18px;
    --radius-sm: 10px;

    --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
    --font-body: "DM Sans", ui-sans-serif, system-ui, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;
  }

  html[data-theme="light"] {
    --bg: #f7f7f9;
    --bg-2: #f0f1f4;
    --ink: #14161a;
    --ink-soft: #54596a;
    --ink-mute: #8b90a0;
    --line: rgba(20,22,26,.08);
    --line-strong: rgba(20,22,26,.16);
    --card: #ffffff;
    --card-hover: #f7f7fb;

    --accent: #6a5cf0;
    --ok: #16a673;
    --warn: #c98a1a;
    --danger: #d43b42;
  }
```

- [ ] **Step 2: Global base rules — selection, spinner, focus-visible, scroll-progress**

Replace line 87:

```css
  ::selection { background: var(--lilac); color: #fff; }
```

with:

```css
  ::selection { background: var(--accent); color: #fff; }
```

Replace line 108:

```css
    border-top-color: var(--peach);
```

with:

```css
    border-top-color: var(--accent);
```

Add a new rule right after the `button, a { cursor: pointer; }` mobile-cursor rule (around line 91 in the original file — the exact anchor is the block containing `@media (max-width: 720px) { button, a { cursor: pointer; } }`):

```css
  a:focus-visible, button:focus-visible, [tabindex]:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 4px;
  }
```

Replace line 1281 (`.scroll-progress { ... background: var(--grad-1); ... }`):

```css
    background: var(--grad-1);
```

with:

```css
    background: var(--accent);
```

- [ ] **Step 3: Status dot uses `--ok` instead of `--emerald`**

Replace lines 305 and 312:

```css
    background: var(--emerald);
```
```css
    border: 1px solid var(--emerald);
```

with:

```css
    background: var(--ok);
```
```css
    border: 1px solid var(--ok);
```

- [ ] **Step 4: Add the shared `.accent-word` utility, replacing the gradient `<em>` pattern**

Replace line 588-594 (the `.section-title em { ... }` rule):

```css
  .section-title em {
    font-family: var(--font-serif);
    font-style: italic;
    background: var(--grad-1);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    font-weight: 400;
  }
```

with:

```css
  .section-title em,
  .accent-word {
    font-style: normal;
    font-weight: 600;
    color: var(--accent);
  }
```

- [ ] **Step 5: `about-card` status pill uses `--ok`**

Replace lines 678-679:

```css
    background: color-mix(in oklab, var(--emerald) 18%, transparent);
    color: var(--emerald);
```

with:

```css
    background: color-mix(in oklab, var(--ok) 18%, transparent);
    color: var(--ok);
```

- [ ] **Step 6: Terminal CSS — swap fallback tokens**

Replace each of the following (lines 1525, 1538, 1551, 1574, 1581 — all the same substring):

```css
var(--peach, #ff8a65)
```

with:

```css
var(--accent, #7c6fef)
```

Replace line 1561:

```css
  .t-git-hash { color: var(--butter, #fcd34d); }
```

with:

```css
  .t-git-hash { color: var(--warn, #f5b942); }
```

- [ ] **Step 7: Simplify the accent system in `src/App.jsx`**

Replace the `TWEAK_DEFAULTS` declaration:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#ff8a65"
}/*EDITMODE-END*/;
```

with:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#7c6fef"
}/*EDITMODE-END*/;
```

Delete the `ACCENT_MAP` constant entirely:

```js
const ACCENT_MAP = {
  "#ff8a65": { g1: "linear-gradient(135deg, #ff8a65 0%, #f472b6 45%, #a78bfa 100%)", coral: "#f56565" },
  "#5eead4": { g1: "linear-gradient(135deg, #5eead4 0%, #6ee7b7 45%, #818cf8 100%)", coral: "#10b981" },
  "#a78bfa": { g1: "linear-gradient(135deg, #a78bfa 0%, #c084fc 45%, #f472b6 100%)", coral: "#8b5cf6" },
  "#fcd34d": { g1: "linear-gradient(135deg, #fcd34d 0%, #fb923c 45%, #f43f5e 100%)", coral: "#f59e0b" },
};
```

Replace the accent-swap `useEffect` inside `App()`:

```js
  /* accent swap — rewrites --grad-1 + --peach via :root override */
  useEffect(() => {
    const a = ACCENT_MAP[t.accent] || ACCENT_MAP["#ff8a65"];
    document.documentElement.style.setProperty("--grad-1", a.g1);
    document.documentElement.style.setProperty("--peach", t.accent);
    document.documentElement.style.setProperty("--coral", a.coral);
  }, [t.accent]);
```

with:

```js
  /* accent swap — single CSS var, no gradient derivation needed */
  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);
```

Find the `<TweakColor>` element inside the `<TweaksPanel>` JSX and replace its `options` prop:

```js
          <TweakColor
            label="Color"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#ff8a65", "#5eead4", "#a78bfa", "#fcd34d"]}
          />
```

with:

```js
          <TweakColor
            label="Color"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#7c6fef", "#4dd8e0", "#f5b942", "#f2545b"]}
          />
```

- [ ] **Step 8: Visual smoke test**

Run: `npm run dev`.

Expected: page background is now near-black by default (dark-first), text is legible, the terminal's accent-colored text (prompt, `whoami` status line, `views` output) still renders in the new violet accent instead of peach, and the tweaks panel's 4 accent swatches show violet/cyan/amber/rose instead of the old warm palette. Sections not yet touched by later tasks (hero blobs, tape, gradients on stack/skills/work/journey/contact) will still look like the old design in those specific spots — that's expected and gets resolved in Tasks 3 and 8–15.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Replace warm-cream/gradient palette with dark-native systems-dashboard tokens"
```

---

### Task 3: Cut decorative elements

**Files:**
- Modify: `src/App.jsx` (`CursorAura` component, its render call)
- Modify: `src/sections.jsx` (`Ticker` function body, `Hero`'s blob refs/divs, `.tape` span, polaroid tilt, `.orbit-badge`, name-marquee block in `Contact`)
- Modify: `src/styles.css` (all CSS blocks named in the removals below)
- Modify: `index.html` if any `.grain`/`.cursor-aura` markup remains (it shouldn't — Task 1 Step 13 already omitted them)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Hero()` and `Contact()` in `src/sections.jsx` with their decorative-only markup removed, ready for Tasks 8 and 14 to build the new content into the same functions.

- [ ] **Step 1: Remove `CursorAura` from `src/App.jsx`**

Delete the entire `CursorAura` function (the block starting `function CursorAura() {` through its closing `}`), and delete the `<CursorAura />` line from `App()`'s returned JSX.

- [ ] **Step 2: Remove the cursor-aura CSS block**

Delete lines 114-131 in `src/styles.css` (the `/* ───── custom cursor ───── */` comment through the end of the `.cursor-aura` rule and its dark-theme override) — i.e. delete:

```css
  /* ───── custom cursor ───── */
  .cursor-aura {
    position: fixed;
    inset: -18%;
    pointer-events: none;
    z-index: 0;
    opacity: .8;
    background:
      radial-gradient(34rem circle at var(--aura-x) var(--aura-y), color-mix(in oklab, var(--peach) 28%, transparent) 0%, transparent 60%),
      radial-gradient(28rem circle at var(--aura-x-2) var(--aura-y-2), color-mix(in oklab, var(--mint) 22%, transparent) 0%, transparent 58%),
      radial-gradient(36rem circle at 50% 10%, color-mix(in oklab, var(--lilac) 14%, transparent) 0%, transparent 72%);
    filter: blur(26px) saturate(120%);
    will-change: background;
    transition: opacity .3s ease;
  }
  html[data-theme="dark"] .cursor-aura {
    opacity: .58;
    filter: blur(32px) saturate(135%);
  }
```

Leave a single `/* ───── custom cursor ───── */` comment line in its place so Task 4's crosshair rules have a home.

Also remove the now-dead `--aura-x`/`--aura-y`/`--aura-x-2`/`--aura-y-2` custom properties from the `:root` block (Task 2 Step 1 already produced a version of `:root` without them — if doing Task 3 before Task 2, just leave them, Task 2 will remove them; if after, they're already gone).

- [ ] **Step 3: Delete the `Ticker` component and its markup**

In `src/sections.jsx`, delete the entire `Ticker` function (from `/* ─── Marquee ticker ─── */` through its closing `}`), and delete the `<Ticker />` line from `App()` in `src/App.jsx`.

- [ ] **Step 4: Delete the ticker CSS block**

In `src/styles.css`, delete the `/* ───── marquee ticker ───── */` comment and every rule under it: `.ticker`, `.ticker-track`, `.ticker:hover .ticker-track`, `.ticker-chunk`, `.ticker-word`, `.ticker-word.serif`, `.ticker-star`, and the `@keyframes ticker-scroll` rule.

- [ ] **Step 5: Remove hero blobs from `Hero()`**

In `src/sections.jsx`, delete these lines from inside `Hero()`:

```jsx
      <div className="hero-blob b1" ref={b1}></div>
      <div className="hero-blob b2" ref={b2}></div>
```

Delete the `b1`/`b2` ref declarations and the parallax `useEffect` that moves them:

```jsx
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
```

- [ ] **Step 6: Delete hero-blob CSS**

In `src/styles.css`, delete `.hero-blob`, `html[data-theme="dark"] .hero-blob`, `.hero-blob.b1`, `.hero-blob.b2`, `html[data-theme="dark"] .hero-blob.b2`.

- [ ] **Step 7: Remove the polaroid tape and tilt**

In `src/sections.jsx`, inside the hero photo markup, delete:

```jsx
              <span className="tape" aria-hidden="true"></span>
```

In `src/styles.css`, delete the `.tape` rule and its dark-theme override:

```css
  .tape {
    position: absolute;
    top: -13px; left: 50%;
    width: 98px; height: 27px;
    transform: translateX(-50%) rotate(-3deg);
    background: color-mix(in oklab, var(--butter) 42%, transparent);
    border: 1px dashed color-mix(in oklab, var(--ink) 12%, transparent);
    border-radius: 2px;
    backdrop-filter: blur(1px);
    z-index: 2;
  }
  html[data-theme="dark"] .tape { background: color-mix(in oklab, var(--butter) 26%, transparent); }
```

Replace the `.polaroid` rule's tilt/transition and its hover override:

```css
  .polaroid {
    position: relative;
    margin: 0;
    padding: 12px 12px 12px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    transform: rotate(2.4deg);
    transition: transform .5s cubic-bezier(.2, .8, .2, 1);
    box-shadow: 0 26px 50px -28px color-mix(in oklab, var(--ink) 45%, transparent);
  }
  .hero-photo-wrap:hover .polaroid { transform: rotate(0deg) translateY(-4px); }
```

with:

```css
  .polaroid {
    position: relative;
    margin: 0;
    padding: 12px 12px 12px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 14px;
    box-shadow: 0 26px 50px -28px color-mix(in oklab, var(--ink) 45%, transparent);
  }
```

Also delete the mobile-breakpoint override `.polaroid { transform: rotate(1.6deg); }` inside the `@media (max-width: 840px)` block.

- [ ] **Step 8: Remove the orbit badge**

In `src/sections.jsx`, delete the whole `<div className="orbit-badge" ...>...</div>` block from inside the hero photo markup.

In `src/styles.css`, delete `.orbit-badge`, `.orbit-badge svg`, `.orbit-badge text`, `.orbit-star`, `@keyframes orbit-spin`, and the mobile-breakpoint `.orbit-badge`/`.orbit-star` overrides inside `@media (max-width: 840px)`.

- [ ] **Step 9: Remove the grain overlay**

`index.html` no longer has the `.grain` div (removed in Task 1 Step 13). Delete its CSS in `src/styles.css`: the `/* ───── film grain overlay ───── */` comment, `.grain`, and `html[data-theme="dark"] .grain`.

- [ ] **Step 10: Remove the giant name marquee from `Contact()`**

In `src/sections.jsx`, delete this block from inside `Contact()`:

```jsx
        <div className="name-marquee" aria-hidden="true">
          <div className="name-marquee-track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i}>marc daniel <em>✺</em> </span>
            ))}
          </div>
        </div>
```

In `src/styles.css`, delete the `/* ───── giant outlined name marquee (footer) ───── */` comment and every rule under it: `.name-marquee`, `.name-marquee-track`, `.name-marquee-track span`, `.name-marquee-track span em`, `@keyframes name-scroll`.

Also remove `.name-marquee-track,` from the `prefers-reduced-motion` animation-disable selector list further down the file (it's listed alongside `.ticker-track` — remove both names from that selector, keep the rule for the others).

- [ ] **Step 11: Smoke test**

Run: `npm run dev`. Expected: no console errors about undefined refs/components; hero no longer shows blurred color blobs, tape, or the spinning circular badge; the phrase ticker below the hero is gone; the footer no longer shows the giant scrolling outlined name. Layout gaps where these elements used to be are expected and get filled by Tasks 8 and 15 — don't try to make spacing look finished yet.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Remove decorative elements that don't fit the dashboard identity"
```

---

### Task 4: Simplify cursor to a crosshair reticle

**Files:**
- Modify: `src/styles.css` (`.cursor-dot`, `.cursor-ring`, and hover/text state rules)

**Interfaces:**
- Consumes: nothing (the tracking logic in `CustomCursor` inside `src/App.jsx` is unchanged — this task is CSS-only).

- [ ] **Step 1: Restyle the ring into a reticle**

Replace the `.cursor-dot`/`.cursor-ring` rules and their hover/text-state variants with:

```css
  .cursor-dot, .cursor-ring {
    position: fixed; top: 0; left: 0;
    pointer-events: none;
    z-index: 9999;
    transform: translate3d(-100px, -100px, 0);
    will-change: transform;
  }
  .cursor-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--accent);
    transition: transform .08s linear, opacity .2s;
  }
  .cursor-ring {
    width: 28px; height: 28px;
    border: 1.5px solid var(--ink-mute);
    border-radius: 4px;
    transition: transform .18s cubic-bezier(.2,.8,.2,1), width .15s, height .15s, border-color .2s, opacity .25s;
    background: transparent;
  }
  .cursor-ring::before, .cursor-ring::after {
    content: "";
    position: absolute;
    background: var(--ink-mute);
    transition: background-color .2s;
  }
  .cursor-ring::before { top: 50%; left: -6px; right: -6px; height: 1px; transform: translateY(-50%); }
  .cursor-ring::after  { left: 50%; top: -6px; bottom: -6px; width: 1px; transform: translateX(-50%); }

  html[data-gallery-open] .cursor-ring { border-color: rgba(255,255,255,.6) !important; }
  html[data-gallery-open] .cursor-ring::before,
  html[data-gallery-open] .cursor-ring::after { background: rgba(255,255,255,.6); }

  body.cursor-hover .cursor-ring {
    width: 40px; height: 40px;
    border-color: var(--accent);
  }
  body.cursor-hover .cursor-ring::before,
  body.cursor-hover .cursor-ring::after { background: var(--accent); }
  body.cursor-text .cursor-ring {
    width: 4px; height: 28px;
    border-radius: 2px;
    background: var(--accent);
    border: 0;
  }
  body.cursor-text .cursor-ring::before,
  body.cursor-text .cursor-ring::after { display: none; }
  body.cursor-text .cursor-dot { opacity: 0; }
  @media (max-width: 720px) { .cursor-dot, .cursor-ring { display: none; } }
```

This replaces (delete them, they're superseded by the block above): the old `.cursor-dot, .cursor-ring` base rule, `.cursor-dot`, `.cursor-ring`, `html[data-theme="light"] .cursor-ring`, `html[data-theme="dark"] .cursor-ring`, `html[data-gallery-open] .cursor-ring`, `html[data-gallery-open] .cursor-dot`, `html[data-gallery-open] body.cursor-hover .cursor-ring`, `body.cursor-hover .cursor-ring`, `body.cursor-text .cursor-ring`, `body.cursor-text .cursor-dot`, and the `@media (max-width: 720px)` cursor-hide rule (all replaced 1:1 by the equivalent rule above with the reticle shape instead of the filled-circle blob).

- [ ] **Step 2: Visual check**

Run: `npm run dev`. Move the mouse around the page: expect a small violet dot with a thin crosshair-bracket square trailing it (not a soft filled blob), growing slightly and turning solid violet over links/buttons, collapsing into a text-caret shape over inputs. On mobile width (or narrow viewport), the custom cursor disappears and the normal system pointer/cursor shows.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Simplify custom cursor from soft blob to crosshair reticle"
```

---

### Task 5: Consolidate project data into a shared module

**Files:**
- Create: `src/data/projects.js`
- Create: `src/data/projects.test.js`
- Modify: `src/sections.jsx` (`Projects()`)
- Modify: `src/terminal.jsx` (delete local `PROJECTS`, update `ls`/`cat`/`open` cases)

**Interfaces:**
- Produces: `PROJECTS` (array), `shippedCount` (number), `liveCount` (number) from `src/data/projects.js`. Shape per item: `{ slug, title, desc, stack, year, href, art, imgSrc, gallery }` (`href`/`imgSrc`/`gallery` may be `null`).
- Consumes: nothing new. This fixes a pre-existing inconsistency where `terminal.jsx`'s `open 4` command pointed at the R Mo Global project even though it's commented out of the public Work section — after this task both surfaces read from the same 3-project-plus-Klori list.

- [ ] **Step 1: Write the failing test**

Create `src/data/projects.test.js`:

```js
import { describe, it, expect } from "vitest";
import { PROJECTS, shippedCount, liveCount } from "./projects.js";

describe("projects data", () => {
  it("shippedCount matches the number of listed projects", () => {
    expect(shippedCount).toBe(PROJECTS.length);
  });

  it("liveCount only counts projects with a real href", () => {
    const expected = PROJECTS.filter((p) => p.href).length;
    expect(liveCount).toBe(expected);
  });

  it("every project has a unique slug", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/data/projects.test.js`
Expected: FAIL — `Cannot find module './projects.js'` (the module doesn't exist yet).

- [ ] **Step 3: Create `src/data/projects.js`**

```js
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/data/projects.test.js`
Expected: 3 tests PASS.

- [ ] **Step 5: Update `Projects()` in `src/sections.jsx` to use the shared data**

Add near the top of `src/sections.jsx`:

```js
import { PROJECTS } from "./data/projects.js";
```

Inside `Projects()`, delete the inline `items` array literal (the `const items = [ ... ];` block with the 4 hardcoded objects and the commented-out R Mo entry) and replace it with:

```js
  const items = PROJECTS.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }));
```

(This keeps every existing render reference — `p.num`, `p.title`, `p.desc`, `p.stack`, `p.year`, `p.href`, `p.art`, `p.imgSrc`, `p.gallery` — working unchanged; Task 12 replaces the `num`-based rendering with a status pill.)

- [ ] **Step 6: Update `src/terminal.jsx` to use the shared data**

Add near the top of the file:

```js
import { PROJECTS } from "./data/projects.js";
```

Delete the local `const PROJECTS = [ ... ];` array (the 5-entry list including `n`, `slug`, `label`, `stack`, `year`, `url` fields).

In the `ls` command's `projects`/`projects/` branch, replace:

```js
      if (args === "projects" || args === "projects/") {
        return PROJECTS.map(p => ({
          t: "plain",
          s: `  [${p.n}]  ${p.slug.padEnd(22)}  ${p.year}`,
        })).concat([
          { t: "dim", s: "" },
          { t: "dim", s: "use: open <n> to launch · cat projects/<slug> for details" },
        ]);
      }
```

with:

```js
      if (args === "projects" || args === "projects/") {
        return PROJECTS.map((p, i) => ({
          t: "plain",
          s: `  [${i + 1}]  ${p.slug.padEnd(22)}  ${p.year}`,
        })).concat([
          { t: "dim", s: "" },
          { t: "dim", s: "use: open <n> to launch · cat projects/<slug> for details" },
        ]);
      }
```

In the `cat` command's `projects/<slug>` branch, replace:

```js
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
```

with:

```js
      if (args.startsWith("projects/")) {
        const slug = args.slice(9);
        const p = PROJECTS.find(x => x.slug === slug);
        if (p) {
          return [
            { t: "accent", s: p.title },
            { t: "dim",    s: "─".repeat(p.title.length) },
            { t: "kv",     s: ["stack", p.stack] },
            { t: "kv",     s: ["year ", p.year] },
            p.href
              ? { t: "kv-url", s: ["url  ", p.href] }
              : { t: "dim",    s: "  url   · mobile app — no public URL yet" },
          ];
        }
```

In the `open` command, replace:

```js
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
```

with:

```js
    case "open": {
      const n    = parseInt(args, 10);
      const proj = PROJECTS[n - 1];
      if (proj) {
        if (!proj.href) return [{ t: "warn", s: `${proj.title} — no public URL yet (mobile app in dev)` }];
        setTimeout(() => window.open(proj.href, "_blank", "noopener,noreferrer"), 240);
        return [{ t: "ok", s: `opening ${proj.title}…` }];
      }
      return [
        { t: "error", s: `open: '${args || "(none)"}' not found` },
        { t: "dim",   s: `use: open 1…${PROJECTS.length}` },
      ];
    }
```

- [ ] **Step 7: Smoke test**

Run: `npm run dev`. Open the terminal, run `ls projects/`, `cat projects/cavite-moto-tech`, `open 1`. Expected: same output shape as before, correct project opens, `open 4` now reports "not found" (R Mo is no longer in the list — matches what's shown in the Work section). Check the Work section on the page still renders all 4 projects identically to before this task.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Consolidate project data into src/data/projects.js, fix terminal/Work drift"
```

---

### Task 6: Shared live view-count hook

**Files:**
- Create: `src/lib/viewCounter.js`
- Create: `src/lib/useViewCount.js`
- Create: `src/lib/useViewCount.test.js`
- Modify: `src/App.jsx` (the view-count increment effect)
- Modify: `src/terminal.jsx` (the `views` command's URL constant)

**Interfaces:**
- Produces: `VIEWS_HIT_URL`, `VIEWS_GET_URL` from `src/lib/viewCounter.js`; `useViewCount()` from `src/lib/useViewCount.js` — returns `number | null` (`null` while loading or on failure).
- Consumes: nothing new.

- [ ] **Step 1: Create `src/lib/viewCounter.js`**

```js
const NAMESPACE = "marc-daniel-portfolio";
const KEY = "site-views";

export const VIEWS_HIT_URL = `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`;
export const VIEWS_GET_URL = `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`;
```

- [ ] **Step 2: Write the failing test for the hook**

Create `src/lib/useViewCount.test.js`:

```js
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useViewCount } from "./useViewCount.js";

describe("useViewCount", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the fetched count on success", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ value: 42 }),
    });
    const { result } = renderHook(() => useViewCount());
    await waitFor(() => expect(result.current).toBe(42));
  });

  it("stays null when the request fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useViewCount());
    await waitFor(() => expect(result.current).toBeNull());
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/lib/useViewCount.test.js`
Expected: FAIL — `Cannot find module './useViewCount.js'`.

- [ ] **Step 4: Create `src/lib/useViewCount.js`**

```js
import { useEffect, useState } from "react";
import { VIEWS_GET_URL } from "./viewCounter.js";

export function useViewCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(VIEWS_GET_URL)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setCount(Number(d.value ?? 0)); })
      .catch(() => { if (!cancelled) setCount(null); });
    return () => { cancelled = true; };
  }, []);

  return count;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/lib/useViewCount.test.js`
Expected: 2 tests PASS.

- [ ] **Step 6: Point the existing increment call and terminal command at the shared constants**

In `src/App.jsx`, replace:

```js
  /* view counter — fire-and-forget hit, read back via terminal `views` command */
  useEffect(() => {
    fetch("https://abacus.jasoncameron.dev/hit/marc-daniel-portfolio/site-views").catch(() => {});
  }, []);
```

with:

```js
  /* view counter — fire-and-forget hit, read back via terminal `views` command and the Nav/Hero live tiles */
  useEffect(() => {
    fetch(VIEWS_HIT_URL).catch(() => {});
  }, []);
```

and add to the top-of-file imports:

```js
import { VIEWS_HIT_URL } from "./lib/viewCounter.js";
```

In `src/terminal.jsx`, replace:

```js
// free, signup-free hit counter — incremented once per page load in portfolio.jsx
const VIEWS_NS  = "marc-daniel-portfolio";
const VIEWS_KEY = "site-views";
const VIEWS_GET_URL = `https://abacus.jasoncameron.dev/get/${VIEWS_NS}/${VIEWS_KEY}`;
```

with:

```js
import { VIEWS_GET_URL } from "./lib/viewCounter.js";
```

(move this `import` line up next to the file's other imports at the top — it can't sit where the deleted constant block was if that spot is mid-file after other statements; place all `import`s together at the top per standard ES module convention).

- [ ] **Step 7: Smoke test**

Run: `npm run dev`. Open the terminal and run `views` — expect the same "N total visits" output as before. No behavior change yet in the Nav/Hero (that's Tasks 7 and 8).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Extract shared view-counter constants and a useViewCount hook"
```

---

### Task 7: Nav — dashboard header bar

**Files:**
- Modify: `src/sections.jsx` (`NAV_LINKS`, `Nav`)
- Modify: `src/styles.css` (`.logo-mark`, `.nav-links a`, `.nav-links a.active .num`, add `.nav-status`)

**Interfaces:**
- Consumes: `useViewCount` from `./lib/useViewCount.js`.
- Produces: no new exports — `Nav` keeps its existing `{ theme, toggleTheme }` prop signature.

- [ ] **Step 1: Update `NAV_LINKS` to drop numbering, add dashboard-style labels**

Replace:

```js
const NAV_LINKS = [
  ["about", "01"], ["stack", "02"], ["skills", "03"],
  ["work", "04"], ["journey", "05"], ["contact", "06"],
];
```

with:

```js
const NAV_LINKS = [
  ["about", "profile"], ["stack", "modules"], ["skills", "capabilities"],
  ["work", "deployments"], ["journey", "changelog"], ["contact", "contact"],
];
```

- [ ] **Step 2: Rewrite `Nav()` to add the live status/view-count corner tile and drop the numeral span**

Add to the top of `src/sections.jsx`:

```js
import { useViewCount } from "./lib/useViewCount.js";
```

Replace the `Nav` function body's `nav-links` map and the closing status/theme-button wrapper:

```jsx
        <div className="nav-links">
          {NAV_LINKS.map(([id, n]) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              <span className="num">{n}</span>{id}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            className="theme-btn terminal-btn"
            data-cursor-hover
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "`", bubbles: true }))}
            aria-label="open terminal"
            title="open terminal (or press `)"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M2 4l4 3.5L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="theme-btn" data-cursor-hover onClick={toggleTheme} aria-label="toggle theme">
            {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
          </button>
        </div>
```

with:

```jsx
        <div className="nav-links">
          {NAV_LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>{label}</a>
          ))}
        </div>
        <div className="nav-status">
          <span className="status-dot" aria-hidden="true"></span>
          <span className="nav-views">{views == null ? "···" : views.toLocaleString()} views</span>
          <button
            className="theme-btn terminal-btn"
            data-cursor-hover
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "`", bubbles: true }))}
            aria-label="open terminal"
            title="open terminal (or press `)"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M2 4l4 3.5L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="theme-btn" data-cursor-hover onClick={toggleTheme} aria-label="toggle theme">
            {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
          </button>
        </div>
```

Add `const views = useViewCount();` as the first line inside `Nav()`'s body (alongside the existing `scrolled`/`active` state declarations).

Also update the logo text from `<span>marc daniel</span>` to `<span>marc-daniel.sys</span>` to match the dashboard/system-name voice used in the Hero (Task 8).

- [ ] **Step 3: Restyle the nav CSS**

Replace `.logo-mark`'s background and box-shadow:

```css
  .logo-mark {
    width: 26px; height: 26px;
    border-radius: 8px;
    background: var(--grad-1);
    display: grid; place-items: center;
    color: white;
    font-weight: 700;
    font-size: 13px;
    box-shadow: 0 4px 14px -4px color-mix(in oklab, var(--peach) 50%, transparent);
  }
```

with:

```css
  .logo-mark {
    width: 26px; height: 26px;
    border-radius: 8px;
    background: var(--accent);
    display: grid; place-items: center;
    color: white;
    font-weight: 700;
    font-size: 13px;
  }
```

Replace the `.nav-links a`/`.nav-links a:hover`/`.nav-links a.active`/`.nav-links a.active .num`/`.nav-links .num` rules:

```css
  .nav-links a {
    padding: 8px 14px;
    border-radius: 999px;
    color: var(--ink-soft);
    transition: color .2s, background .2s;
  }
  .nav-links a:hover { color: var(--ink); background: var(--line); }
  .nav-links a.active { color: var(--ink); background: var(--line); }
  .nav-links a.active .num { color: var(--peach); }
  .nav-links .num { color: var(--ink-mute); margin-right: 6px; }
```

with:

```css
  .nav-links a {
    padding: 6px 2px;
    margin: 0 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: .02em;
    color: var(--ink-mute);
    border-bottom: 2px solid transparent;
    transition: color .15s, border-color .15s;
  }
  .nav-links a:hover { color: var(--ink); }
  .nav-links a.active { color: var(--ink); border-bottom-color: var(--accent); }

  .nav-status {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .nav-views {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-mute);
    white-space: nowrap;
  }
  @media (max-width: 900px) { .nav-views { display: none; } }
```

(Note the `font-size: 13px;` rule that used to live on `.nav-links` as a group selector already covers the mono sizing baseline — leave that parent rule as-is.)

- [ ] **Step 4: Visual check**

Run: `npm run dev`. Expected: nav shows "marc-daniel.sys", tab labels read profile/modules/capabilities/deployments/changelog/contact with an accent underline on the active one (no more pill background), and a small pinging status dot + live view count sits before the terminal/theme buttons (hidden below 900px width to avoid crowding).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Nav as a dashboard header bar with live status/view tiles"
```

---

### Task 8: Hero — the live status-board signature element

**Files:**
- Modify: `src/sections.jsx` (`Hero`)
- Modify: `src/styles.css` (`.hero`, `.hero-layout`, `.hero-copy`, `.hello-tag`, hero `h1`/typewriter/scribble rules, `.hero-meta`, `.hero-cta`, `.hero-photo-wrap`; add `.status-panel`, `.status-grid`, `.status-tile`)

**Interfaces:**
- Consumes: `useViewCount` (Task 6), `shippedCount`/`liveCount` from `src/data/projects.js` (Task 5), `motion`/`useMotionValue`/`useTransform`/`animate` from `framer-motion`.
- Produces: no new exports.

- [ ] **Step 1: Replace `Hero()` entirely**

The current `Hero()` (after Task 3 removed the blobs, tape, and orbit badge) still has the typewriter role-rotator, the 3-line animated headline, and the `hero-meta` grid. Replace the whole function with:

```jsx
function StatTile({ label, value, suffix = "" }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString() + suffix);

  useEffect(() => {
    if (value == null) return;
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 0.84, 0.28, 1] });
    return () => controls.stop();
  }, [value]);

  return (
    <div className="status-tile">
      <span className="status-tile-label">{label}</span>
      {value == null
        ? <span className="status-tile-value">···</span>
        : <motion.span className="status-tile-value">{rounded}</motion.span>}
    </div>
  );
}

function Hero() {
  const views = useViewCount();

  return (
    <header className="hero" id="top">
      <div className="wrap hero-content">
        <Reveal className="status-panel">
          <div className="status-panel-head">
            <span className="status-panel-title">marc-daniel.sys</span>
            <span className="status-panel-live">
              <span className="status-dot" aria-hidden="true"></span>operational
            </span>
          </div>

          <div className="status-panel-body">
            <div className="status-panel-id">
              <h1>marc daniel dela cruz</h1>
              <p className="status-panel-role">full-stack developer · cavite, ph</p>
              <p className="status-panel-lead">
                4th-year BSIT student building full-stack systems through thesis projects, client work, and a lot of late-night debugging. i like clean UX, practical features, and shipping things people can actually use.
              </p>
              <div className="status-panel-meta">
                <div className="meta-block">
                  <span className="k">status</span>
                  <span className="v"><span className="status-dot" aria-hidden="true"></span>open for freelance · q3 2026</span>
                </div>
                <div className="meta-block">
                  <span className="k">uptime</span>
                  <span className="v">since 2023</span>
                </div>
              </div>
              <div className="hero-cta">
                <a className="btn primary" href="#work" data-cursor-hover>
                  see work <Icon.arrow className="arrow" width={14} height={14} />
                </a>
                <a className="btn ghost" href="#contact" data-cursor-hover>
                  <Icon.mail width={14} height={14} /> get in touch
                </a>
                <a className="btn ghost" href="/resume.pdf" download="Marc_Daniel_Dela_Cruz_Resume.pdf" data-cursor-hover>
                  <Icon.download width={14} height={14} /> download cv
                </a>
              </div>
            </div>

            <div className="status-grid">
              <StatTile label="views" value={views} />
              <StatTile label="shipped" value={shippedCount} />
              <StatTile label="live now" value={liveCount} />
              <figure className="polaroid status-tile--photo" data-cursor-hover>
                <img src="/pfp.jpg" alt="Marc Daniel portrait" className="hero-photo" />
                <figcaption className="polaroid-cap">
                  <span>feed: cavite, ph</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </Reveal>
      </div>
    </header>
  );
}
```

Add to the top-of-file imports in `src/sections.jsx`:

```js
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { shippedCount, liveCount } from "./data/projects.js";
```

(`useViewCount` was already imported in Task 7 — keep that single import line, don't duplicate it.)

- [ ] **Step 2: Delete the now-unused hero CSS**

Delete these rules entirely from `src/styles.css` (all superseded by the markup above): `.hero-layout`, `.hero-copy`, `.hello-tag`, `.status-dot` is KEPT (reused by the new markup — do not delete it), `@keyframes ping` is KEPT (still used by `.status-dot::after`), `.hero h1` and every nested rule under it (`.hero h1 .line-mask`, `.hero h1 .line`, `.reveal.in h1 .line`, the `nth-child` transition-delay rules, `.scribble-wrap`, `.scribble`, `.scribble path`, `.reveal.in .scribble path`, `.hero h1 .grad`, `.hero h1 .grad-2`), `.role-rotator` and its children (`.role-rotator .role-word`, `.role-rotator .caret`, `@keyframes blink`), `.hero-meta` and its children (`.hero-meta .lead`, `.hero-meta .lead strong`, `.hero-meta .meta-block`, `.hero-meta .meta-block .k`, `.hero-meta .meta-block .v`), `.hero-cta` margin-top rule is KEPT but see Step 3 below, `.hero-photo-wrap` (old absolute-positioning version).

Also delete the `caret` entry from the `prefers-reduced-motion` animation-disable selector list, and delete the two now-dead lines in that same block: `.hero h1 .line { transform: none; transition: none; }` and `.scribble path { stroke-dashoffset: 0; transition: none; }`.

- [ ] **Step 3: Add the new hero/status-panel CSS**

Replace the `.hero` rule and add the new panel rules in its place:

```css
  .hero {
    position: relative;
    padding: 124px 0 64px;
  }

  .status-panel {
    border: 1px solid var(--line-strong);
    border-radius: var(--radius);
    background: var(--card);
    overflow: hidden;
  }
  .status-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    border-bottom: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .status-panel-title { color: var(--ink-soft); letter-spacing: .04em; }
  .status-panel-live {
    display: flex; align-items: center; gap: 8px;
    color: var(--ok);
    text-transform: uppercase;
    letter-spacing: .06em;
    font-size: 11px;
  }

  .status-panel-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(220px, 28vw, 320px);
    gap: clamp(24px, 4vw, 48px);
    padding: clamp(24px, 4vw, 40px);
    align-items: start;
  }
  @media (max-width: 840px) {
    .status-panel-body { grid-template-columns: 1fr; }
  }

  .status-panel-id h1 {
    font-family: var(--font-display);
    font-size: clamp(30px, 4.2vw, 52px);
    letter-spacing: -.03em;
    line-height: 1.05;
    font-weight: 500;
    margin: 0 0 6px;
  }
  .status-panel-role {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--ink-soft);
    margin: 0 0 20px;
  }
  .status-panel-lead {
    font-size: 17px;
    line-height: 1.6;
    color: var(--ink-soft);
    max-width: 560px;
    margin: 0 0 28px;
    text-wrap: pretty;
  }
  .status-panel-meta {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .status-panel-meta .k {
    display: block;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-mute);
    text-transform: uppercase;
    letter-spacing: .08em;
    margin-bottom: 6px;
  }
  .status-panel-meta .v {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--ink);
  }

  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .status-tile {
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--bg-2);
  }
  .status-tile-label {
    display: block;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-mute);
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 8px;
  }
  .status-tile-value {
    font-family: var(--font-mono);
    font-size: 26px;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: -.02em;
  }
  .status-tile--photo {
    margin: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
  }
  .status-tile--photo .hero-photo {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 6px;
  }
  .status-tile--photo .polaroid-cap {
    padding-top: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-mute);
  }
  @media (max-width: 480px) { .status-grid { grid-template-columns: 1fr 1fr; } }
```

Delete the old `@media (max-width: 840px)` hero block (the one that set `min-height: auto`, `.hero-layout { grid-template-columns: 1fr; }`, `.hero-photo-wrap`, `.polaroid`, `.orbit-badge`, `.hero h1`, `.hero-meta .lead`, `.hero-cta` overrides) — the new `.status-panel-body` media query above replaces its job.

- [ ] **Step 4: Visual + reduced-motion check**

Run: `npm run dev`. Expected: hero renders as a bordered panel with an "operational" live-dot header row, name/role/lead copy and CTAs on the left, a 2×2 grid of stat tiles (views, shipped, live now, photo) on the right — views counts up from 0 once the fetch resolves, shipped/live-now count up immediately on mount. Toggle OS-level reduced-motion and reload: the count-up should still land on the correct final number even if instantaneous (Framer Motion's `animate()` respects reduced motion by default via its own internal check — if it doesn't visibly respect it, wrap the `animate()` call in the `StatTile` effect with a `window.matchMedia("(prefers-reduced-motion: reduce)").matches` check and set the value directly via `mv.set(value)` instead of animating when true).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Rebuild Hero as a live status-board — the redesign's signature element"
```

---

### Task 9: About → profile panel

**Files:**
- Modify: `src/sections.jsx` (`About`)
- Modify: `src/styles.css` (`.about-text > p:first-child::first-letter`, `.about-text .highlight`, `.about-card.reveal.in` tilt)

**Interfaces:**
- Consumes: `.accent-word` utility (Task 2).
- Produces: no new exports.

- [ ] **Step 1: Update the section heading markup**

In `About()`, replace:

```jsx
            <h2 className="section-title">
              I build the boring parts so the <em>fun parts</em> can ship.
            </h2>
```

with:

```jsx
            <h2 className="section-title">
              I build the boring parts so the <span className="accent-word">fun parts</span> can ship.
            </h2>
```

(Same visual job — accent-colored emphasis — now via the plain-weight `.accent-word` utility instead of the italic-serif-gradient `<em>`. Do this same `<em>` → `<span className="accent-word">` swap for every remaining section heading that still has an `<em>` — Stack, Skills, Work, Contact all have one; Journey's heading also has one. Task 2 already retargeted the CSS selector `.section-title em` to double as `.accent-word`, so leaving any stray `<em>` as-is also still renders correctly — but prefer the explicit span for clarity going forward.)

- [ ] **Step 2: Remove the gradient drop-cap**

Replace:

```css
  .about-text > p:first-child::first-letter {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 3.1em;
    line-height: .78;
    float: left;
    padding: .06em .14em 0 0;
    background: var(--grad-1);
    -webkit-background-clip: text; background-clip: text;
    color: transparent;
  }
```

with:

```css
  .about-text > p:first-child::first-letter {
    font-family: var(--font-mono);
    font-size: 2.4em;
    line-height: .78;
    float: left;
    padding: .06em .14em 0 0;
    color: var(--accent);
  }
```

- [ ] **Step 3: Recolor the highlight marker**

Replace:

```css
  .about-text .highlight {
    background: linear-gradient(120deg, transparent 0% 50%, color-mix(in oklab, var(--butter) 55%, transparent) 50% 95%, transparent 95%);
    padding: 0 2px;
  }
  html[data-theme="dark"] .about-text .highlight {
    background: linear-gradient(120deg, transparent 0% 50%, color-mix(in oklab, var(--lilac) 35%, transparent) 50% 95%, transparent 95%);
  }
```

with:

```css
  .about-text .highlight {
    background: linear-gradient(120deg, transparent 0% 50%, color-mix(in oklab, var(--accent) 30%, transparent) 50% 95%, transparent 95%);
    padding: 0 2px;
  }
```

- [ ] **Step 4: Drop the about-card tilt**

Replace:

```css
  .about-card.reveal.in { transform: rotate(.7deg); }
  .about-card.reveal.in:hover { transform: rotate(0deg); }
  @media (max-width: 920px) { .about-card.reveal.in, .about-card.reveal.in:hover { transform: none; } }
```

with nothing (delete all three rules — the card sits flat now, matching the rest of the dashboard's disciplined, un-tilted panels). Also delete the now-unreachable `@media (max-width: 920px)` block above since its only rule was the tilt override.

- [ ] **Step 5: Visual check**

Run: `npm run dev`, scroll to About. Expected: drop-cap is now a plain violet-mono letter (not italic serif gradient), the "Blender" highlight uses a violet-tinted marker instead of butter/lilac, and the `about.json` card no longer tilts on scroll-reveal or hover.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Restyle About as a flat profile panel, swap em-gradient emphasis for accent-word"
```

---

### Task 10: Stack → modules

**Files:**
- Modify: `src/sections.jsx` (`Stack`)
- Modify: `src/styles.css` (`.stack-group-dot`, `data-grad` variants, `.stack-chip::before` hover fill)

**Interfaces:**
- Consumes: `.accent-word`.
- Produces: no new exports.

- [ ] **Step 1: Update heading and drop the `data-grad` category coloring**

In `Stack()`, replace the `<em>` in the heading the same way as Task 9 (`<em>without thinking</em>` → `<span className="accent-word">without thinking</span>`).

Each `groups` entry currently sets `grad: "1" | "2" | "3"` and the JSX spreads `data-grad={g.grad}` onto both the `<Reveal>` wrapper and each `.stack-chip`. Delete the `grad` field from all three group objects and remove `data-grad={g.grad}` from both the `<Reveal className="stack-group" ...>` element and the `<div className="stack-chip" data-grad={g.grad} ...>` element (the chips no longer need per-group color-coding — one accent color for all of them, per the design decision that the group label text already conveys the category).

- [ ] **Step 2: Add the hover "active" indicator markup**

Replace the chip's inner markup:

```jsx
                  <div className="stack-chip" data-grad={g.grad} data-cursor-hover key={it.name}
                    style={{ transitionDelay: `${i * 20}ms` }}>
                    <div className="icon"><TechIcon name={it.icon} /></div>
                    <div className="name">{it.name}</div>
                    <div className="cat">{it.cat}</div>
                  </div>
```

with:

```jsx
                  <div className="stack-chip" data-cursor-hover key={it.name}
                    style={{ transitionDelay: `${i * 20}ms` }}>
                    <span className="stack-chip-active" aria-hidden="true">
                      <span className="status-dot" />active
                    </span>
                    <div className="icon"><TechIcon name={it.icon} /></div>
                    <div className="name">{it.name}</div>
                    <div className="cat">{it.cat}</div>
                  </div>
```

- [ ] **Step 3: Restyle group dots and chip hover**

Replace:

```css
  .stack-group-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--grad-1);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--peach) 18%, transparent);
  }
  .stack-group[data-grad="2"] .stack-group-dot { background: var(--grad-2); box-shadow: 0 0 0 4px color-mix(in oklab, var(--mint) 18%, transparent); }
  .stack-group[data-grad="3"] .stack-group-dot { background: var(--grad-3); box-shadow: 0 0 0 4px color-mix(in oklab, var(--butter) 22%, transparent); }
```

with:

```css
  .stack-group-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent);
  }
```

Replace the chip hover-fill rules:

```css
  .stack-chip::before {
    content: "";
    position: absolute; inset: -1px;
    background: var(--grad-1);
    opacity: 0;
    z-index: 0;
    border-radius: var(--radius-sm);
    transition: opacity .3s;
  }
  .stack-chip:hover { transform: translateY(-4px); border-color: transparent; }
  .stack-chip:hover::before { opacity: 1; }
  .stack-chip > * { position: relative; z-index: 1; transition: color .25s; }
  .stack-chip:hover > * { color: white; }
```

with:

```css
  .stack-chip:hover { transform: translateY(-4px); border-color: var(--ok); }
  .stack-chip-active {
    position: absolute;
    top: 10px; right: 10px;
    display: flex; align-items: center; gap: 5px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--ok);
    text-transform: uppercase;
    letter-spacing: .04em;
    opacity: 0;
    transition: opacity .2s;
  }
  .stack-chip:hover .stack-chip-active { opacity: 1; }
  .stack-chip { position: relative; }
```

(The `position: relative;` re-declaration at the end is safe/idempotent — `.stack-chip` already had `position: relative;` in its base rule earlier in the file; this addition is only needed if that base rule is ever simplified later. Leave the existing base rule as-is; this step's real work is the three rules above it.)

Delete the now-unused group-color variant rules further down:

```css
  .stack-chip[data-grad="2"]::before { background: var(--grad-2); }
  .stack-chip[data-grad="3"]::before { background: var(--grad-3); }
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, scroll to Stack. Expected: all three group dots (Frontend/Backend/Tools) are the same violet accent color, and hovering a tool chip shows a small green "● active" tag in the corner with a subtle border-color change — no more full-chip rainbow gradient fill with white text.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Stack as modules — single accent color, active-state hover tag"
```

---

### Task 11: Skills → capabilities

**Files:**
- Modify: `src/sections.jsx` (`TechSkills`)
- Modify: `src/styles.css` (`.skill-card::before`, `.skill-idx`, `.skill-short`)

**Interfaces:**
- Consumes: `.accent-word`.
- Produces: no new exports.

- [ ] **Step 1: Update the heading**

Same `<em>` → `<span className="accent-word">` swap as Task 9, for `<em>actually do</em>`.

- [ ] **Step 2: Restyle the top-bar reveal and index numeral**

Replace:

```css
  .skill-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--grad-1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .4s cubic-bezier(.2, .8, .2, 1);
  }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-idx {
    position: absolute;
    top: 20px; right: 20px;
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -.02em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px var(--line-strong);
    pointer-events: none;
    transition: -webkit-text-stroke-color .3s;
  }
  .skill-card:hover .skill-idx { -webkit-text-stroke-color: color-mix(in oklab, var(--peach) 60%, transparent); }
```

with:

```css
  .skill-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .25s cubic-bezier(.2, .8, .2, 1);
  }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-idx {
    position: absolute;
    top: 20px; right: 20px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: .04em;
    color: var(--ink-mute);
    pointer-events: none;
  }
```

Replace `.skill-short`'s background/border (still peach-tinted):

```css
  .skill-short {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--peach) 22%, transparent);
    color: var(--ink);
    border: 1px solid color-mix(in oklab, var(--peach) 40%, transparent);
    white-space: nowrap;
  }
```

with:

```css
  .skill-short {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--accent) 18%, transparent);
    color: var(--ink);
    border: 1px solid color-mix(in oklab, var(--accent) 36%, transparent);
    white-space: nowrap;
  }
```

- [ ] **Step 3: Update the index label markup**

In `TechSkills()`, replace:

```jsx
              <span className="skill-idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
```

with:

```jsx
              <span className="skill-idx" aria-hidden="true">#{String(i + 1).padStart(2, "0")}</span>
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, scroll to Skills. Expected: each card shows a small mono `#01`-style tag top-right (not a giant outlined display numeral), a thin violet top-bar reveals on hover, and the short-code pill (RBAC, APIs, etc.) uses the violet tint.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Skills index numerals from display-outline to mono tags"
```

---

### Task 12: Work → deployments (live status pill)

**Files:**
- Modify: `src/sections.jsx` (`Projects`)
- Modify: `src/styles.css` (`.project-row` grid columns, `.project-row .num`, add `.status-pill`, mobile breakpoint)

**Interfaces:**
- Consumes: `PROJECTS` from `src/data/projects.js` directly (drops the Task 5 `num`-mapping shim, since numbering is removed here).

- [ ] **Step 1: Drop the `num` shim, render a status pill instead**

Replace the line Task 5 introduced:

```js
  const items = PROJECTS.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0") }));
```

with:

```js
  const items = PROJECTS;
```

Replace the row's leading span and heading text in the JSX:

```jsx
                  <span className="num">{p.num}</span>
                  <span className="title">{p.title}</span>
```

with:

```jsx
                  <span className={`status-pill${p.href ? " status-pill--live" : ""}`}>
                    <span className="status-dot" aria-hidden="true"></span>
                    <span className="status-pill-text">{p.href ? "live" : "in dev"}</span>
                  </span>
                  <span className="title">{p.title}</span>
```

Also update the section heading (`<em>actually shipped</em>` → `<span className="accent-word">actually shipped</span>`) and the section-head "right" copy, which currently hardcodes a count:

```jsx
          <div className="right">
            5 projects.<br/>
            live + revenue-touching.
          </div>
```

replace `5` with the real count so it can't drift again:

```jsx
          <div className="right">
            {items.length} projects.<br/>
            live + revenue-touching.
          </div>
```

- [ ] **Step 2: Restyle the row grid and status pill**

Replace:

```css
  .project-row {
    position: relative;
    display: grid;
    grid-template-columns: 60px 1.2fr 1fr 120px 40px;
    align-items: center;
    gap: 24px;
    padding: 28px 8px;
    border-top: 1px solid var(--line);
    transition: padding .3s;
  }
```

with (only the column widths change):

```css
  .project-row {
    position: relative;
    display: grid;
    grid-template-columns: 96px 1.2fr 1fr 120px 40px;
    align-items: center;
    gap: 24px;
    padding: 28px 8px;
    border-top: 1px solid var(--line);
    transition: padding .3s;
  }
```

Replace:

```css
  .project-row .num {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -.02em;
    color: transparent;
    -webkit-text-stroke: 1px var(--ink-mute);
    transition: -webkit-text-stroke-color .3s;
  }
  .project-row:hover .num { -webkit-text-stroke-color: var(--peach); }
```

with:

```css
  .status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--ink-mute);
  }
  .status-pill--live { color: var(--ok); }
```

Replace the hover title-gradient rule:

```css
  .project-row:hover .title { background: var(--grad-1); -webkit-background-clip: text; background-clip: text; color: transparent; }
```

with:

```css
  .project-row:hover .title { color: var(--accent); }
```

- [ ] **Step 3: Fix the mobile breakpoint's column width and hide the pill's text label**

Inside the existing `@media (max-width: 760px)` block, replace:

```css
    .project-row {
      grid-template-columns: 32px 1fr 32px;
      gap: 12px;
      padding: 22px 4px;
    }
```

with:

```css
    .project-row {
      grid-template-columns: 40px 1fr 32px;
      gap: 12px;
      padding: 22px 4px;
    }
    .status-pill-text { display: none; }
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, scroll to Work. Expected: each row's leading column shows a small pinging dot + "live"/"in dev" label instead of an outlined `01`/`02`/`03`/`04`; the label turns green for the 3 projects with a public URL and stays muted for Klori (no public URL). Hovering a row colors the title violet instead of clipping a gradient into the text. On narrow viewports, only the dot shows (no "live"/"in dev" text) to keep the row from cramming.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Work rows as deployments with a live/in-dev status pill"
```

---

### Task 13: Journey → changelog

**Files:**
- Modify: `src/sections.jsx` (`Journey`)
- Modify: `src/styles.css` (`.timeline::before`, `.tl-item::before`, `.tl-item:first-child::after`)

**Interfaces:**
- Consumes: none new.

- [ ] **Step 1: Add version tags and update the heading**

In `Journey()`, add a `version` field to each timeline entry and render it in the `when` line:

```js
  const items = [
    {
      when: "2026 · NOW",
      version: "v3.0.0",
      what: "Final year + open for work",
      where: "BSIT · finishing strong",
      detail: "Wrapping up my capstone while shipping client and personal projects on the side. Open to junior / intern roles from Q3 2026.",
      tags: ["thesis", "freelance", "open to work"],
    },
    {
      when: "2025",
      version: "v2.0.0",
      what: "Started freelancing + personal builds",
      where: "self-taught → real projects",
      detail: "Stopped just learning and started shipping. First paying client, first deployed app, first time someone outside my family actually used something I built.",
      tags: ["freelance", "laravel", "vue.js", "full-stack"],
    },
    {
      when: "2023",
      version: "v1.0.0",
      what: "Started BSIT",
      where: "National College of Science and Technology",
      detail: "Picked up the basics, then went off-syllabus fast. School gave me the foundation — everything else came from building things that had to actually work.",
      tags: ["beginnings"],
    },
  ];
```

Replace the rendered `when` line:

```jsx
                <div className="when">{t.when}</div>
```

with:

```jsx
                <div className="when"><span className="tl-version">{t.version}</span> · {t.when}</div>
```

Update the heading's `<em>` the same way as the other sections (`<em>fixing spreadsheets</em>` → `<span className="accent-word">fixing spreadsheets</span>`).

- [ ] **Step 2: Add a `.tl-version` style**

Add next to the existing `.tl-item .when` rule:

```css
  .tl-version {
    font-family: var(--font-mono);
    color: var(--ink);
    font-weight: 500;
  }
```

- [ ] **Step 3: Recolor the timeline line and dots**

Replace:

```css
  .timeline::before {
    content: "";
    position: absolute; left: 8px; top: 8px; bottom: 8px;
    width: 2px;
    background: linear-gradient(to bottom, var(--peach), var(--lilac), var(--mint));
    border-radius: 2px;
  }
```

with:

```css
  .timeline::before {
    content: "";
    position: absolute; left: 8px; top: 8px; bottom: 8px;
    width: 2px;
    background: var(--line-strong);
    border-radius: 2px;
  }
```

Replace:

```css
  .tl-item::before {
    content: "";
    position: absolute;
    left: -32px; top: 10px;
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid transparent;
    background:
      linear-gradient(var(--bg), var(--bg)) padding-box,
      var(--grad-1) border-box;
    transition: background .25s, transform .25s;
  }
  .tl-item:hover::before {
    background:
      var(--grad-1) padding-box,
      var(--grad-1) border-box;
    transform: scale(1.15);
  }
  .tl-item:first-child::after {
    content: "";
    position: absolute;
    left: -32px; top: 10px;
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid var(--peach);
    animation: ping 2.4s cubic-bezier(0, 0, .2, 1) infinite;
    pointer-events: none;
  }
```

with:

```css
  .tl-item::before {
    content: "";
    position: absolute;
    left: -32px; top: 10px;
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid var(--line-strong);
    background: var(--bg);
    transition: border-color .25s, transform .25s;
  }
  .tl-item:hover::before {
    border-color: var(--accent);
    transform: scale(1.15);
  }
  .tl-item:first-child::before { border-color: var(--ok); }
  .tl-item:first-child::after {
    content: "";
    position: absolute;
    left: -32px; top: 10px;
    width: 18px; height: 18px;
    border-radius: 50%;
    border: 2px solid var(--ok);
    animation: ping 2.4s cubic-bezier(0, 0, .2, 1) infinite;
    pointer-events: none;
  }
```

(The current/ongoing entry's marker now reads as the same "live" green as the Hero/Nav/Work status indicators — a small but deliberate consistency win, not just a recolor.)

- [ ] **Step 4: Visual check**

Run: `npm run dev`, scroll to Journey. Expected: each entry's date line reads e.g. "v3.0.0 · 2026 · NOW", the connecting line is a neutral gray instead of a 3-color gradient, and only the first (current) entry's dot pings green — the older two are neutral-outlined and turn violet on hover.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Journey as a changelog with version tags"
```

---

### Task 14: Contact → new-request panel

**Files:**
- Modify: `src/sections.jsx` (`Contact`)
- Modify: `src/styles.css` (`.contact-blob`, `.contact h2 em`, `.socials` → `.endpoints`)

**Interfaces:**
- Consumes: `.accent-word`.

- [ ] **Step 1: Update copy, drop the blob, restyle socials as an endpoint list**

Replace:

```jsx
    <section className="contact" id="contact">
      <div className="contact-blob"></div>
      <div className="wrap contact-inner">
        <Reveal>
          <div className="eyebrow">06 — Let&rsquo;s build</div>
          <h2>
            got something <em>weird</em><br/>to build?
          </h2>
```

with:

```jsx
    <section className="contact" id="contact">
      <div className="wrap contact-inner">
        <Reveal>
          <div className="eyebrow">new request</div>
          <h2>
            got something <span className="accent-word">weird</span><br/>to build?
          </h2>
```

Replace the `.socials` block:

```jsx
          <div className="socials">
            <a href="https://www.facebook.com/daniel.502270/" target="_blank" rel="noopener noreferrer me" data-cursor-hover>facebook</a>
            <a href={`tel:+63${phone.slice(1)}`} data-cursor-hover>{phone}</a>
            <a href="https://github.com/jckdanielss" target="_blank" rel="noopener noreferrer me" data-cursor-hover><Icon.github width={14} height={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />github</a>
            <a href="https://www.linkedin.com/in/marc-daniel-dela-cruz-8a16b43b9/" target="_blank" rel="noopener noreferrer me" data-cursor-hover><Icon.linkedin width={14} height={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />linkedin</a>
          </div>
```

with:

```jsx
          <div className="endpoints">
            <a href="https://www.facebook.com/daniel.502270/" target="_blank" rel="noopener noreferrer me" data-cursor-hover>→ facebook</a>
            <a href={`tel:+63${phone.slice(1)}`} data-cursor-hover>→ {phone}</a>
            <a href="https://github.com/jckdanielss" target="_blank" rel="noopener noreferrer me" data-cursor-hover>→ github</a>
            <a href="https://www.linkedin.com/in/marc-daniel-dela-cruz-8a16b43b9/" target="_blank" rel="noopener noreferrer me" data-cursor-hover>→ linkedin</a>
          </div>
```

Leave the `<footer className="foot">...</footer>` block right after this untouched — Task 15 rewrites it.

- [ ] **Step 2: Delete the contact blob**

Delete `.contact-blob` and `html[data-theme="dark"] .contact-blob` from `src/styles.css` (it renders with a now-nonexistent `--grad-3` token — cutting it is consistent with the rest of the redesign's "no soft decorative gradients" rule, even though it wasn't separately named in the design spec's cut list).

- [ ] **Step 3: Drop the h2 em gradient, restyle endpoints**

Delete:

```css
  .contact h2 em {
    font-family: var(--font-serif);
    font-style: italic;
    background: var(--grad-1);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    font-weight: 400;
  }
```

(`.accent-word` from Task 2 already covers this job sitewide, including here.)

Replace:

```css
  .socials {
    display: flex; gap: 8px;
    justify-content: center;
    margin-top: 40px;
    flex-wrap: wrap;
  }
  .socials a {
    padding: 10px 18px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--ink-soft);
    transition: background .2s, color .2s, transform .2s;
  }
  .socials a:hover { background: var(--card); color: var(--ink); transform: translateY(-2px); }
```

with:

```css
  .endpoints {
    display: flex; gap: 24px;
    justify-content: center;
    margin-top: 40px;
    flex-wrap: wrap;
    font-family: var(--font-mono);
  }
  .endpoints a {
    font-size: 13px;
    color: var(--ink-mute);
    transition: color .2s;
  }
  .endpoints a:hover { color: var(--accent); }
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, scroll to Contact. Expected: no soft blob behind the CTA, "new request" eyebrow instead of "06 — Let's build", the four contact links render as a plain `→ facebook  → 09602020493  → github  → linkedin` mono list instead of pill buttons.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Restyle Contact as a new-request panel with an endpoint-style link list"
```

---

### Task 15: Footer → status bar

**Files:**
- Modify: `src/sections.jsx` (`Contact`'s `<footer>`)

**Interfaces:**
- Consumes: none new. No CSS changes needed — `footer.foot`'s existing `display:flex; justify-content:space-between; flex-wrap:wrap;` layout already fits 3 items cleanly.

- [ ] **Step 1: Replace the footer content**

Replace:

```jsx
        <footer className="foot">
          <div>© 2026 Marc Daniel Dela Cruz. handcoded with caffeine.</div>
        </footer>
```

with:

```jsx
        <footer className="foot">
          <span>marc-daniel.sys · v2.0</span>
          <span>© 2026 Marc Daniel Dela Cruz</span>
          <span>uptime: since 2023</span>
        </footer>
```

- [ ] **Step 2: Visual check**

Run: `npm run dev`, scroll to the very bottom. Expected: a plain three-item status line where the giant scrolling outlined name used to be — no layout gap, no leftover blank space.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Replace footer name-marquee with a plain status bar"
```

---

### Task 16: Sitewide motion polish

**Files:**
- Modify: `src/styles.css` (`.reveal`, `.btn.primary:hover`, `.btn.ghost:hover`, `.theme-btn:hover`, `.email-btn:hover`)
- Modify: `src/sections.jsx` (`StatTile`, for a real `prefers-reduced-motion` guard instead of relying on Framer Motion's default behavior)

**Interfaces:**
- Consumes: none new.

- [ ] **Step 1: Tighten the scroll-reveal timing**

Replace:

```css
  .reveal {
    opacity: 0;
    transform: translateY(22px);
    filter: blur(5px);
    transition: opacity .8s cubic-bezier(.2,.8,.2,1), transform .8s cubic-bezier(.2,.8,.2,1), filter .8s cubic-bezier(.2,.8,.2,1);
  }
```

with:

```css
  .reveal {
    opacity: 0;
    transform: translateY(16px);
    filter: blur(4px);
    transition: opacity .5s cubic-bezier(.16,.84,.28,1), transform .5s cubic-bezier(.16,.84,.28,1), filter .5s cubic-bezier(.16,.84,.28,1);
  }
```

- [ ] **Step 2: Add `:active` press feedback next to each existing `:hover` rule**

Add immediately after `.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -10px var(--ink); }`:

```css
  .btn.primary:active { transform: translateY(-2px) scale(.97); }
```

Add immediately after `.btn.ghost:hover { background: var(--card); transform: translateY(-2px); }`:

```css
  .btn.ghost:active { background: var(--card); transform: translateY(-2px) scale(.97); }
```

Add immediately after `.theme-btn:hover { background: var(--card-hover); transform: rotate(-15deg); }`:

```css
  .theme-btn:active { background: var(--card-hover); transform: rotate(-15deg) scale(.94); }
```

Add immediately after `.contact .email-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -15px var(--ink); }`:

```css
  .contact .email-btn:active { transform: translateY(-3px) scale(.97); }
```

- [ ] **Step 3: Make the Hero stat count-up respect reduced motion explicitly**

In `src/sections.jsx`, replace the `StatTile` effect written in Task 8:

```jsx
  useEffect(() => {
    if (value == null) return;
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 0.84, 0.28, 1] });
    return () => controls.stop();
  }, [value]);
```

with:

```jsx
  useEffect(() => {
    if (value == null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { mv.set(value); return; }
    const controls = animate(mv, value, { duration: 0.8, ease: [0.16, 0.84, 0.28, 1] });
    return () => controls.stop();
  }, [value]);
```

- [ ] **Step 4: Re-verify the `prefers-reduced-motion` block has no dangling selectors**

Open `src/styles.css` and find the `@media (prefers-reduced-motion: reduce)` block near the end of the file. Replace its contents so it reads exactly this — the final, authoritative version — regardless of what it currently contains:

```css
  @media (prefers-reduced-motion: reduce) {
    .status-dot::after,
    .tl-item:first-child::after { animation: none !important; }
    .reveal, .reveal.in { transition: none; opacity: 1; transform: none; filter: none; }
  }
```

`.status-dot::after` (the ping on the Hero/Nav/Work "live" dots) and `.tl-item:first-child::after` (the Journey "current" marker, kept by Task 13) are the only two animations left sitewide that need disabling under reduced motion. Every other selector that might still be listed here from before this task — `.ticker-track`, `.name-marquee-track`, `.orbit-badge svg`, `.orbit-star`, `.caret`, `.hero h1 .line`, `.scribble path` — belonged to elements deleted in Tasks 3 and 8 and must not appear in the replacement above.

- [ ] **Step 5: Verify**

Run: `npm run dev`. Click any `.btn`/theme toggle/email-copy button and hold: expect a visible slight scale-down on press, on top of the existing hover lift. Enable OS reduced-motion, reload: hero stat tiles should show their final numbers immediately with no count-up, and the Journey "current" dot should stop pinging.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Tighten reveal timing, add press feedback, finalize reduced-motion coverage"
```

---

### Task 17: Full smoke test and production build verification

**Files:** none (verification only).

- [ ] **Step 1: Run the automated test suite**

Run: `npm test`
Expected: all Vitest suites pass — `src/data/projects.test.js` (3 tests) and `src/lib/useViewCount.test.js` (2 tests).

- [ ] **Step 2: Manual pass — theme and chrome**

Run: `npm run dev`. Toggle light/dark from the nav: background/ink/accent colors swap correctly in both, no unstyled flashes. Confirm the favicon renders (violet-to-cyan gradient mark). Confirm the scroll-progress hairline at the very top of the page fills in violet as you scroll.

- [ ] **Step 3: Manual pass — Hero, Nav, sections**

Confirm: Hero shows the bordered status panel with the "operational" live dot, name/role/lead/CTAs on the left, and the 2×2 stat grid (views/shipped/live now/photo) on the right, with views counting up once fetched. Nav shows "marc-daniel.sys", 6 tab labels with an accent underline on whichever section is currently in view, and a live dot + view count in the corner (above 900px width). Scroll through About/Stack/Skills/Work/Journey/Contact and confirm each matches its Task 9–14 description; confirm the footer shows the 3-item status bar.

- [ ] **Step 4: Manual pass — interactive features unaffected by the redesign**

Press `` ` `` to open the terminal: run `help`, `whoami`, `neofetch`, `views`, `ls projects/`, `cat projects/cavite-moto-tech`, `open 1`, `matrix`, `theme`, `exit`. All should behave exactly as before Task 1. Open the tweaks panel and change the accent swatch — confirm the new violet/cyan/amber/rose swatches all visibly change the Hero/Nav/Stack accent color. Click a gallery-enabled project row and confirm the GSAP screenshot carousel opens, drags, and closes.

- [ ] **Step 5: Manual pass — responsiveness and accessibility**

Resize to 375px width: confirm no horizontal scroll, the status-panel stacks to one column, nav links hide appropriately, project rows show the dot-only status pill. Tab through the page with the keyboard only: confirm every link/button shows the new violet `:focus-visible` ring (added in Task 2 Step 2) and that tab order matches visual order. Enable OS-level reduced motion and reload: confirm no transform-based motion plays (covered by Task 16).

- [ ] **Step 6: Production build**

Run: `npm run build`
Expected: builds successfully with no errors, produces a `dist/` folder.

Run: `npm run preview`, open the printed URL.
Expected: the production build renders and behaves identically to `npm run dev` — this catches any dev-only behavior (e.g. an import that only worked via Vite's dev-server resolution) before it ships.

- [ ] **Step 7: Final commit**

If Step 6 required any fixes, commit them now:

```bash
git add -A
git commit -m "Fix production build issues found during final verification"
```

If no fixes were needed, there's nothing to commit — the redesign is complete as of Task 16's commit.

---

## Self-Review

**Spec coverage:** every section of `docs/superpowers/specs/2026-08-03-systems-dashboard-redesign-design.md` maps to a task — Tooling → Task 1; Color/Typography tokens → Task 2; Hero/signature → Task 8; Nav → Task 7; the 7-row section-reframing table → Tasks 9–15 (About/Stack/Skills/Work/Journey/Contact/Footer, in that table's order); the cut list → Task 3 (plus the contact-blob addendum in Task 14, called out explicitly as a small deviation with its reasoning); Cursor → Task 4; Motion → Task 16. Out-of-scope items (no new pages, gallery visuals untouched, terminal commands unchanged, no backend) are respected — no task touches `gallery.jsx`'s GSAP animation logic or adds a server.

**Placeholder scan:** no "TBD"/"implement later" language; every code block is complete, copy-pasteable code, not a description of code.

**Type/name consistency check:** `PROJECTS` item shape (`slug`, `title`, `desc`, `stack`, `year`, `href`, `art`, `imgSrc`, `gallery`) defined in Task 5 is used identically in Task 5's own `terminal.jsx` edits, Task 8's `shippedCount`/`liveCount` imports, and Task 12's `p.href`/`p.title` usage — no task reintroduces the old `n`/`label`/`url` field names. `useViewCount()` returning `number | null` (Task 6) is consumed the same way (`views == null ? "···" : ...`) in both Task 7 (Nav) and Task 8 (Hero). `.accent-word` (Task 2) is referenced by name identically in Tasks 9, 10, 11, 13, 14. `--ok`/`--warn`/`--danger`/`--accent` token names are used consistently from Task 2 onward — no task reintroduces `--emerald`/`--peach`/`--butter`/`--grad-1`/`--grad-2`/`--grad-3`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-03-systems-dashboard-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?

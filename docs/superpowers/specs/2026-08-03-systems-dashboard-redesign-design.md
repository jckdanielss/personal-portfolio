# Systems Dashboard Redesign — Design Spec

## Context

The site currently reads as one of the default "AI portfolio" looks: warm cream background (`#f6f3ec`), a peach→pink→lilac gradient smeared across headings and hover states, numbered section markers (`01 —`, `02 —`…) on sections that aren't actually sequential, an italic-serif gradient accent word in every heading, and a stock toolkit of typewriter role-rotator, custom cursor, grain overlay, magnetic buttons, and a scrolling marquee — competent execution, but none of it derives from this subject specifically. A hidden terminal easter egg (press `` ` ``) and a live tweaks panel are the two genuinely distinctive things already on the page, and both are tucked away instead of being load-bearing.

Goal: redesign around an identity actually grounded in the subject — Marc Daniel ships real-time dashboards and ERPs for clients (motorcycle shop, van-rental booking) — by making the portfolio *itself* look and behave like one of those systems, instrumented with real data (a live view counter, real "shipped" counts, real project status).

Audience: freelance clients / recruiters and the dev community, roughly equally. One bold signature risk (the page as a live status board), disciplined/credible everywhere else.

## Scope

Visual redesign **and** content restructure. Same underlying content (About, Stack, Skills, Work, Journey, Contact, terminal easter egg, tweaks panel, screenshot gallery) — sections may be reordered, merged, retitled, or have elements added/cut where the new direction calls for it. No new pages; still a single-page portfolio.

## Direction: Systems Dashboard

The whole page is styled like an internal ops dashboard — status pills, uptime, monospace data, live tiles — rather than costume-terminal or editorial-blog defaults. This is deliberately distinct from both AI-portfolio clichés named during the design review: it is not warm-cream-with-terracotta-gradient, and it is not near-black-with-neon-green/vermilion. The one signature risk is a hero that renders as a live, real-data status board for a "system" called `marc-daniel` — an implicit demo of the exact skill (dashboards) the projects section sells.

## Tooling

Migrate off the current CDN-React + Babel-standalone (no build step) setup to **Vite + React**, keeping React as the framework. Adds:
- **Framer Motion** for spring/count-up interactions (stat tiles, hover states) per the emil-design-eng animation guidance already applied during design review.
- Keep **GSAP** for the existing screenshot gallery (`gallery.jsx`) — no reason to replace working code.
- Keep the terminal (`terminal.jsx`) and tweaks-panel (`tweaks-panel.jsx`) logic as-is structurally; restyle to match new tokens.
- Drop the `unpkg`-pinned React/ReactDOM/Babel `<script>` tags and `type="text/babel"` source files; `.jsx` files become real ES modules built by Vite.

## Design tokens

### Color

Dark-native by default (a dashboard reading as dark-first is honest to the metaphor); light/dark toggle stays. One confident brand accent (indigo-violet) replaces the 3-stop gradient used everywhere today. Status colors (`--ok`/`--warn`/`--danger`) are semantic-only — never decorative.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#0b0d10` | `#f7f7f9` | page background |
| `--surface` | `#12151a` | `#ffffff` | cards/panels |
| `--ink` | `#e8eaed` | `#14161a` | primary text |
| `--ink-soft` | `#9aa1ab` | `#54596a` | secondary text |
| `--ink-mute` | `#5b6470` | `#8b90a0` | tertiary/labels |
| `--line` | `rgba(255,255,255,.08)` | `rgba(20,22,26,.08)` | hairlines |
| `--accent` | `#7c6fef` | `#6a5cf0` | brand — links, active nav, cursor, focus rings |
| `--ok` | `#34d399` | `#16a673` | live/available status only |
| `--warn` | `#f5b942` | `#c98a1a` | in-progress status only |
| `--danger` | `#f2545b` | `#d43b42` | reserved, rarely used |

### Typography

- **Bricolage Grotesque** — display headings, used more sparingly than today.
- **DM Sans** — body prose (About paragraphs), unchanged.
- **JetBrains Mono** — promoted from "labels only" to the dominant voice: nav, stat values, project metadata, status pills, timestamps.
- **Instrument Serif (italic accent) — cut entirely.** Its job (decorative emphasis) is replaced by mono status-chips / highlighted spans. One fewer font load.

## Layout & signature

### Hero — the signature element

Renders as a live status panel instead of "photo + copy":

```
┌─ marc-daniel.sys ────────────────────────── ● operational ─┐
│  marc daniel dela cruz                    role   full-stack │
│  full-stack dev · cavite, ph              status ● open q3  │
│                                            uptime since 2023 │
│  [views: 1,204↑]  [shipped: 4]  [live now: 3]  [photo tile] │
│  [see work →]   [get in touch]                               │
└────────────────────────────────────────────────────────────┘
```

- `views` tile pulls from the same free hit-counter API (`abacus.jasoncameron.dev`, namespace `marc-daniel-portfolio` / key `site-views`) already wired up for the terminal `views` command — now also surfaced live on the page itself, not only behind the easter egg. Count-up animation via Framer Motion on scroll-into-view.
- `shipped` / `live now` are real counts derived from the projects list, not hand-typed copy that can drift.
- Photo becomes one small square tile in the grid (plain crop, mono caption like `feed: cavite, ph`) — the tape/polaroid/tilt whimsy is cut; it belongs to the old cream-editorial skin, not this one.

### Nav

Persistent app-header bar: wordmark + section tabs (not gradient pill links) + a small always-visible live status dot + view count in the corner.

### Section reframing

| Section | Becomes | Why |
|---|---|---|
| About | `profile` panel — prose kept verbatim (already good, specific writing), paired with the existing `about.json` card, restyled and de-tilted | already dashboard-shaped, re-skin only |
| Stack | `modules` — same grid; hover shows a small `--ok` green dot + "active" instead of a rainbow gradient fill | ties into the semantic status system instead of decorative per-group gradients |
| Skills | `capabilities` — kept mostly as-is; decorative outline numerals restyled to mono | already fine, minor restyle |
| Work | `deployments` — each project row gets a real `● live` status pill (these are genuinely live sites) | real information, replaces the purely decorative `01/02/03` numbering |
| Journey | `changelog` — timeline restyled with version/date-stamp tags like a release log | ties to the `git log` terminal command; this section is genuinely chronological, so a sequence device is justified here (unlike the other sections) |
| Contact | `new request` panel — same CTA/copy-email button; socials restyled as a `→ github` / `→ linkedin` endpoint list instead of pill buttons | matches the mono/systems voice |
| Footer | a real status bar: `v2.0 · last deploy: <date> · uptime` | replaces the giant scrolling outlined-name marquee |

### Cut list

- Grain overlay
- Two soft blurred gradient hero blobs
- Ambient cursor-aura glow
- Spinning orbit-badge sticker
- The phrase ticker below the hero (`schema → api → ui → deploy`, `ships on time`, etc. — italic-serif/gradient marquee)
- The giant outlined scrolling name marquee in the footer
- Polaroid tape/tilt whimsy on the hero photo
- Numbered section markers (`01 —` etc.) on non-sequential sections — kept only on Journey/changelog, where order is real information

### Cursor

Simplify the current soft dot+ring blend-mode blob into a small crosshair/reticle — reads precise/technical rather than playful, fits the identity.

### Motion

- Stat tiles count up on scroll-into-view (Framer Motion spring/count-up), replacing soft blur-reveal.
- Status dots ping the same way they already do today (`.status-dot::after` pattern) — reused, not reinvented.
- Transitions crisp up to 150–250ms range for UI interactions (buttons, hovers), down from today's ~800ms editorial fades.
- Section entrance reveal-on-scroll stays (`IntersectionObserver`-based), timing tightened to match.
- `prefers-reduced-motion` handling carries forward — the existing implementation already disables transform-based motion correctly and should be preserved for every new animated element.

## Out of scope

- No new pages/routes — still single-page.
- No change to the gallery (`gallery.jsx`) visuals/interaction — GSAP implementation kept as-is, only re-skinned with new tokens.
- No change to terminal *commands* — restyled to match new tokens, behavior (including the `views` command added earlier) unchanged.
- No backend added — the view counter remains the existing free, signup-free hit-counter API; no server of our own.

## Open questions

None outstanding — all resolved during design review (scope, tooling, audience, direction, marquees).

---
name: xoro-visual-direction
description: Apply the Xoro Visuals visual identity (immersive dark cinema, full-bleed moving image, wide heavy Archivo display type with hollow second lines, the logo's cyan→blue→violet gradient as the only accent) to any page, section or component in this repo. Use before designing or restyling UI here.
---

# Xoro Visuals — visual direction (v2: immersive cinematic)

The owner rejected a quiet editorial/serif version as boring. The site must feel like a film trailer: big moving images, big type, few words.

## Principles
- **Image first.** Every major section is carried by full-bleed or large moving media. If a section has no image, it should be one huge line of type.
- **Few words.** One line per idea. Detail lives on interior pages, not the homepage.
- **Brand accent = the logo.** Colours are sampled from `XoroVisuals.Logo.png`: `--c-cyan` #22d3ff, `--c-blue` #3b82ff, `--c-violet` #7c4dff, combined as `--grad`. Use the gradient for primary buttons, the recommended price tier, the "View" cursor, progress and `.grad-text`; `--c-signal` (#4f9bff) for text hovers. Never for large fills, and no other accent colours.
- **Logo files.** `public/brand/xv-mark.png` (header mark) and `xoro-visuals-logo.png` (full lockup) have transparent backgrounds (black converted to alpha from the source logo).

## Type
- Display: Archivo, weight 800, `font-stretch: 125%`, uppercase, tight leading (`--lh-tight`). Applied automatically to h1–h3.
- Second heading lines use `<span className="italic">` → rendered as hollow outlined type (see globals.css). Use it for the second half of a title only.
- Body: Archivo at normal width. Labels: IBM Plex Mono via `.label`.

## Homepage sequence (src/app/page.tsx)
Showreel hero → word-scrub statement → pinned horizontal gallery → zoom-to-fullscreen frame → service list with cursor-following preview → marquee → closing CTA. Don't add more sections; replace one instead.

## Rate card
Packages, INR prices and terms live in `src/content/pricing.ts` (from the studio's own rate card) and render through `PriceTiers` on /pricing and /price-list (one A4 sheet). Regenerate the PDF after edits: `npm run pricelist -- http://localhost:3000`.

## Media
- Work media lives in `public/media/work/`, built from stills in `raw/` by `npm run media` (camera-push loops + 16:9 reel montage). Real footage can replace any `.mp4` directly.
- Pieces keep their true delivery ratio (`aspect` in projects.ts).

## Honesty rules (non-negotiable)
- No invented clients, logos, testimonials, results, awards or prices.
- AI sample pieces stay labelled "AI sample" (`placeholder: true`) until replaced with real work.
- International prices stay `null` ("Quoted per project") until approved.

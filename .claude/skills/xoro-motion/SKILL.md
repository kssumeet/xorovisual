---
name: xoro-motion
description: Rules, APIs and motion-graphics patterns for the Xoro Visuals site — GSAP + ScrollTrigger + SplitText/ScrambleText/DrawSVG, the logo-X hero intro, AI "denoise" reveals, particle fields, HUD overlays, reduced motion and Next 16 Activity caveats. Use before adding or changing any animation or motion graphics.
---

# Xoro motion engineering

Xoro Visuals sells **AI-generated video**, so the site's motion should feel generative and cinematic: things *resolve*, *decode* and *render* rather than simply fade.

One orchestration system: **GSAP 3.15** (`src/lib/gsap.ts`) with ScrollTrigger, SplitText, ScrambleTextPlugin and DrawSVGPlugin registered. No second animation library. Canvas is used only for per-pixel effects GSAP can't do (particles, denoise).

## Declarative reveals (most sections)
Server components opt in with attributes; `MotionRoot` animates them:
- `data-reveal` fade and rise · `data-mask` line-by-line mask rise · `data-reveal-clip` image wipe
- `data-words` word-by-word brighten on scroll · `data-progress` scrubbed rule · `data-reveal-delay`

Render `<MotionRoot />` **inside each page** (last child), never in a layout/template — otherwise GSAP touches markup before the route segment hydrates.

## Motion-graphics patterns in use
| Pattern | Where | How |
|---|---|---|
| Logo-X intro: blades draw, black shatters along the X | `home/ShowreelHero.tsx` | DrawSVG on two paths, four `clip-path` triangle shards tweened outward |
| 3D letter flip | hero line 1 | `SplitText.create(el, { type: "words,chars", aria: "none" })` — always split words too, or letters wrap mid-word |
| Decode / scramble | hero line 2, HUD labels | `scrambleText: { text, chars, speed }` |
| Camera HUD | hero | corner brackets scale in, REC blink, timecode from `video.currentTime` via rAF |
| Light sweep through outline type | hero line 2 | CSS `background-clip: text` gradient animation (don't split this line) |
| Particle field | `home/HeroParticles.tsx` | canvas, ≤70 particles, pointer parallax, paused off-screen / hidden tab |
| Pointer tilt | hero title | `gsap.quickTo` on rotationX/Y, fine pointers only |
| AI denoise reveal (prompt → film) | `home/PromptToFilm.tsx` | canvas draws the video at shrinking block size + grain + latent tint, then hands off to the plain `<video>` |
| Pinned horizontal reel, zoom-to-fullscreen | `HorizontalGallery`, `ZoomFrame` | ScrollTrigger `pin` + `scrub: 0.25` (kept short; never pin more than ~1 screen of extra scroll) |

## Hard-won rules
- **Screen readers:** animated titles render a `visually-hidden` full sentence plus an `aria-hidden` visual copy; split/scramble only the visual copy.
- **Run-once decisions** (e.g. "intro already played") must live at module scope, not inside the effect: React runs effects twice in dev and Next re-runs them when a hidden route is shown again.
- **Next 16 keeps visited routes mounted but hidden.** Find elements from refs (`gsap.utils.selector(root)`), never `getElementById`; skip elements with no client rects.
- When a CSS pre-state uses a transform, reset it in `fromTo` (`{ yPercent: 105, y: 0 }`). Don't `clearProps` a property that has a CSS pre-state.
- `text-shadow` on text inside `overflow: clip` masks shows as dark boxes — shade the background instead.
- Remove every listener you add in the `useGSAP` cleanup.
- Footage already moving (camera push, real video) must not also be zoomed by code — one move at a time.

## Pre-states and failsafes
- `layout.tsx` adds `html.motion` only when JS runs and reduced motion is off; CSS pre-states hang off `.motion`.
- If the runtime hasn't started within 3 s, `html.motion-failsafe` reveals everything.
- Canvas overlays must be `display: none` without `.motion`, or they cover content.

## Accessibility & performance floor
- Reduced motion: no intro, no particles, no scramble; content static and fully visible. JS off: everything readable. Both are covered in `tests/site.spec.ts`.
- Background video is always pausable; previews play one at a time; canvases and loops stop when off-screen.
- Animate transform, opacity, clip-path. No CSS filters on large moving media (small SVG glows are fine).

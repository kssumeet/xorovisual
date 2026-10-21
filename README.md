# Xoro Visuals

Portfolio and lead-generation site for Xoro Visuals — *Ideas into images. Images into films.*

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Checks: `npm run check` (typecheck + zero-warning lint + production build) and `npm run test:e2e` (first run: `npx playwright install chromium`).

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional public email; also the fallback when inquiry delivery fails. |
| `CONTACT_WEBHOOK_URL` | Receives inquiries as JSON. **Without it, inquiries are not delivered** and visitors are told so. |

## Before launch

0. **Stock placeholders.** The portfolio and showreel currently use free stock footage from [Mixkit](https://mixkit.co/license/) (Mixkit Free License: commercial use allowed, no attribution required, not resellable as standalone files). Every piece is labelled "Stock placeholder" on the site and has no case study. Source clips live in `raw/stock/` (git-ignored); `npm run media:stock` rebuilds the loops and reel.
1. **Sharpen the sample visuals.** `raw/*.jpg` currently holds 200 px previews of AI images generated in Canva. Download the full-resolution versions (same filenames), then run `npm run media` to rebuild every loop and the showreel.
2. **Replace the portfolio with real work.** Entries in `src/content/projects.ts` are AI samples (`placeholder: true`, labelled "AI sample"). Drop real footage into `public/media/work/` (or stills into `raw/` and run `npm run media`), update the entry, and set `placeholder: false`. Then set `site.showPlaceholderNotice` to `false`.
3. **Replace the showreel** (`public/media/reel.mp4`) with a real reel; the hero and "Watch reel" player use it.
4. **Connect inquiries:** set `CONTACT_WEBHOOK_URL`. Payload fields: `name, email, company, country, projectType, budget, timeline, deliverables, description, references, submittedAt, source`.
5. **Rate card.** Packages, INR prices and terms live in `src/content/pricing.ts` (from the studio's rate card). After changing them, regenerate the PDF with the site running: `npm run pricelist -- http://localhost:3000` (writes `public/xoro-visuals-price-list.pdf`). Set `NEXT_PUBLIC_SITE_URL` first so the PDF prints your domain.
6. Set `NEXT_PUBLIC_SITE_URL` to the real domain.

## Media encoding

```bash
# Preview loop: muted, web-optimised
ffmpeg -i master.mov -t 12 -an -vf "scale=1600:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart preview.mp4
# Poster
ffmpeg -ss 2 -i preview.mp4 -frames:v 1 -q:v 3 poster.jpg
```

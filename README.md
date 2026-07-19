# SkidoEdits Portfolio

Work-first React/Vite portfolio for Skido, the video editor behind SkidoEdits.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Where To Edit Content

Most website content lives in `src/data/portfolio.js`.

- Drive/local videos: add optimized entries to `videos`, then assign a confirmed `categoryId`
- Hero video: update `hero.video.youtubeId` and `hero.video.posterId`
- Optional local hero reel: place an optimized MP4 in `public/media/`, then set `hero.video.mp4Source`
- Selected-work order: update `selectedWorkIds`
- Moving thumbnail rails: update `hero.railVideoIds` and `railVideoIds`
- Video categories: update `categories`
- Client names and trust copy: update `clients`
- Subscriber/view figures: update `stats`
- Services: update `services`
- Process steps: update `process`
- Testimonials: update `testimonials` only when real approved quotes exist; the section stays hidden while empty
- Email, Discord and social links: update `contact`
- X profile: update the `X / Twitter` item in `contact.socialLinks`
- LinkedIn profile: add the real URL to the `LinkedIn` item in `contact.socialLinks`
- SEO title, description and canonical URL: update `seo`, then mirror canonical values in `index.html`, `public/robots.txt` and `public/sitemap.xml`

## Current Public Sources

- Old Carrd portfolio: confirms SkidoEdits, Valekis, 790K+ subs, 100k+ views, GTA videos and X contact.
- YouTube playlist: `https://www.youtube.com/playlist?list=PLOf7zslF-bEI`
- Social links currently provided: Instagram, X/Twitter, YouTube playlist and Discord username.

## Placeholders To Replace

- `replace-with-real-email@example.com`
- LinkedIn URL, if Gangesh wants LinkedIn shown
- `https://example.com/` canonical, sitemap and robots URLs
- `https://example.com/og-placeholder.png` with a real Open Graph image URL
- Any manually confirmed categories for videos currently marked as `needsClassification`

## Deployment

This is a static Vite site. Suitable deployment targets include Vercel, Netlify, Cloudflare Pages, GitHub Pages or any static host.

Typical settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20.x`

Before deploying, replace placeholder contact and canonical URLs.

## Notes

Project players use `youtube-nocookie.com` and load only after interaction. The hero alone attempts muted autoplay, keeps a poster behind the player, pauses off-screen, and becomes static when reduced motion is requested.

See `agent.md` for strict future-editing rules.

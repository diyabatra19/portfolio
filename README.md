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
npm run lint
npm test
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Where To Edit Content

All public portfolio content lives in `src/data/portfolio.js`.

- Seven creator collections and client order: update `creatorProjects`
- Project videos: update the normalized `videos` list, using only a YouTube video ID
- Creator stacks: update each creator's `videoIds`; never repeat a video ID
- Five featured-client layouts: update `layout` on the primary creator
- Client avatars: place optimized square images in `public/assets/clients/` and update the matching `avatar` path
- Subscriber counts and channel links: update the matching creator after public verification
- Testimonials: replace the draft and change `testimonialStatus` to `verified`; placeholder copy is local-development only
- Moving rails: update each item in `rails`; the validation test requires all 23 featured videos exactly once across the rails
- Hero video: update `hero.video.youtubeId` and `hero.video.posterId`
- Optional local hero reel: place an optimized MP4 in `public/media/`, then set `hero.video.mp4Source`
- Project counters: calculated automatically from `videos` and `creatorProjects`
- Contact portrait and banner: update `brand.assets.contactProfile` and `brand.assets.contactBanner`
- Email, Discord and social links: update `contact`
- X profile: update the `X / Twitter` item in `contact.socialLinks`
- LinkedIn profile: add the real URL to the `LinkedIn` item in `contact.socialLinks`
- SEO title, description and canonical URL: update `seo`, then mirror canonical values in `index.html`, `public/robots.txt` and `public/sitemap.xml`

## Current Public Sources

- Old Carrd portfolio: confirms SkidoEdits, Valekis, 790K+ subs, 100k+ views, GTA videos and X contact.
- YouTube playlist: `https://www.youtube.com/playlist?list=PLOf7zslF-bEI`
- Social links currently provided: Instagram, X/Twitter, YouTube playlist and Discord username.
- Client names, channel links and subscriber counts in `creatorProjects` were publicly checked on 2026-07-24.
- Valekis & Ashley was verified at 13.6K subscribers and froze at 168K subscribers.
- `ubbDGcpvyuI` belongs to Kazed (`@StayKazed`); Froze is a separate collection containing the five supplied Shorts.
- Kazed is intentionally excluded from the creator strip and has no public subscriber count on this site.

## Placeholders To Replace

- Public email is currently blank; add a verified address in `contact.email`
- LinkedIn URL, if Gangesh wants LinkedIn shown
- `https://example.com/` canonical, sitemap and robots URLs
- `https://example.com/assets/brand/skido-banner.jpg` with the final absolute Open Graph image URL
- Five draft testimonials; replace with approved feedback and set `testimonialStatus: 'verified'`, or remove them

## Deployment

This is a static Vite site. Suitable deployment targets include Vercel, Netlify, Cloudflare Pages, GitHub Pages or any static host.

Typical settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20.x`

Before deploying, replace placeholder contact and canonical URLs.

## Notes

Project players use `youtube-nocookie.com`, remain inline, and load only after interaction. Starting another stack, rail, or Short unloads the previous project player. The hero alone attempts muted autoplay, keeps a poster behind the player, pauses off-screen, and becomes static when reduced motion is requested.

Brand artwork lives in `public/assets/brand/`; creator avatars live in `public/assets/clients/`. The green theme tokens are at the top of `src/styles.css`.

See `agent.md` for strict future-editing rules.

# SkidoEdits Website Editing Rules

Use these rules for future manual or AI-assisted edits.

1. Use `SkidoEdits` as the current public brand everywhere.
2. Do not present SkidoEdits as an old, former or replaced brand.
3. Keep factual content editable in `src/data/portfolio.js` whenever practical.
4. Do not invent clients, testimonials, subscriber counts, view counts, awards, software expertise, years of experience, location or guarantees.
5. Keep uncertain categories in `Other edits` or mark the video with `needsClassification` until Gangesh confirms it.
6. Preserve privacy-enhanced YouTube embeds using `youtube-nocookie.com`.
7. Do not download, duplicate or re-upload YouTube videos.
8. Keep videos lazy-loaded so iframes are created only after visitor interaction.
9. Keep every portfolio player inline. Do not add video modals, portals, popups or scroll locking.
10. Maintain keyboard access for navigation, video controls, the client strip and contact links.
11. Respect `prefers-reduced-motion`; the hero must remain free of decorative 3D objects.
12. Do not add a fake form success message unless a real backend service is connected.
13. Do not use official Roblox logos, characters, UI or downloadable game assets.
14. Update `README.md` when adding new editable content locations or deployment requirements.
15. Keep the public interface green-first; purple may remain inside approved client artwork but is not the primary UI color.
16. Preserve the numerical client/project `priority` fields and the Valekis hero project unless the client explicitly changes them.
17. Placeholder testimonials may render only in local development and must remain hidden from production builds.
18. Change `testimonialStatus` to `verified` only after the client approves the exact wording.
19. Keep Kazed separate from Froze, exclude Kazed from the creator strip, and never display a Kazed subscriber count.
20. Run `npm run lint`, `npm test`, and `npm run build` after portfolio data or component changes.

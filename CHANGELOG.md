# Changelog

All notable changes to this project. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-09-25

### Changed

- Less text on the page: the "Achievements" section is removed (it repeated experience and
  case studies), case studies are cut to the four strongest, and section leads are kept only
  where they add information.
- Case studies show the result up front; the challenge and solution open on demand.
- Experience shows the current roles; earlier ones fold into one accordion.
- Skill groups show a short preview and expand to the full list; six main groups are shown,
  the rest fold under "More skills".
- Contact cards are equal in size and slightly smaller; four in a row only from 1280px.

### Fixed

- Switching the language no longer resets the music and sound toggles while the old music loop
  kept playing (which allowed starting a second, overlapping loop).
- The email address in the contacts no longer breaks in the middle of a word.

## [1.0.2] — 2026-09-24

### Fixed

- Canonical, Open Graph, hreflang and the portfolio "demo" link pointed to `localhost` in the
  Cloudflare build — the production URL now comes from `.env.production`.

## [1.0.1] — 2026-09-24

### Changed

- Deployed to Cloudflare Workers as static assets (`wrangler.jsonc`) while GitHub Actions is
  unavailable; the portfolio "demo" link follows the host the site is built for.

## [1.0.0] — 2026-09-24

### Added

- Single-page retro 8-bit portfolio: hero with pixel scene, "why work with me", stats band,
  experience map, case studies, skills, achievements, projects, beyond code, contacts.
- English (default) and Ukrainian versions with a language switch that keeps the current section.
- Day and night themes following the OS, with a manual override.
- PDF CV in both languages generated from the site content at build time.
- Fixed contact rail, scroll-spy navigation, subtle stepped reveal animations.
- No analytics, cookies or third-party requests — no cookie banner needed.
- Optional 8-bit sound effects and procedural chiptune music (off by default).
- Bonus platformer at the end of the page and a Konami-code easter egg.
- Vitest unit tests, Playwright E2E tests (responsive layout on 8 widths), GitHub Actions
  quality gate and GitHub Pages deployment.

# oleksa-portfolio

Retro 8-bit portfolio and CV of **Oleksa Sarnatskyi** — Full-Stack Developer (React · Next.js ·
Node.js · TypeScript · AI).

A single-page, fully static Next.js site: two languages (English by default, Ukrainian), day and
night themes that follow the OS, a PDF CV generated from the same content, no tracking at all
and a tiny platformer at the very end.

## Quick start

```bash
nvm use 22            # Node 22+
npm ci
npm run dev           # http://localhost:3100/en/  (generates the CV first)
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3100 (runs `npm run cv` first) |
| `npm run build` | Static export to `out/` (runs `npm run cv` first) |
| `npm run preview` | Serves `out/` on http://localhost:4173 |
| `npm run cv` | Renders `public/cv/oleksa-sarnatskyi-cv-{en,uk}.pdf` |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright against the built `out/` (build first) |
| `npm run check` | lint + types + unit tests |

## Editing content

All text lives in **`src/content/`** — components never hard-code copy.

- `src/content/profile.ts` — contacts and headline numbers (one place for both languages).
  A contact with an empty URL is hidden everywhere (site and PDF).
- `src/content/locales/en.ts`, `uk.ts` — everything else. Both implement `SiteContent`
  (`src/domain/content.ts`), and a unit test fails if the two drift apart structurally.
- The PDF CV is built from the same objects (`src/pdf/CvDocument.tsx`), so the site and the
  résumé always match. Never edit the PDF by hand.

A unit test also guards against publishing a phone number or internal Voopty names (NDA).

## Architecture (SOLID in practice)

```
src/
  domain/          Interfaces only (SiteContent, CaseStudy, …) — what everything depends on
  content/         Data: profile + one file per locale, and a locale registry
  services/        Framework-free logic behind interfaces
    theme/         ThemeStore(KeyValueStorage, SystemThemeSource, ThemeTarget)
    sound/         SoundEffectsPlayer / MusicPlayer (Web Audio chiptune)
    storage/       KeyValueStorage (localStorage / memory), FlagStore
  providers/       Composition root (services.ts) + React hooks
  game/            Pure game engine + canvas renderer (no React)
  components/      UI: pixel primitives, HUD, sections, contacts, game
  pdf/             CV document for @react-pdf/renderer
  app/             Next.js routes: /  →  /en/, /en/, /uk/
```

- **Single responsibility** — logic lives in `services/` and `game/engine.ts`; components only render.
- **Open/closed** — sections are registered in `components/sections/registry.tsx`; locales in
  `content/index.ts`. Adding one does not touch the others.
- **Liskov / interface segregation** — small interfaces (`KeyValueStorage`, `SystemThemeSource`,
  `MusicPlayer`) with interchangeable implementations (browser / in-memory).
- **Dependency inversion** — only `providers/services.ts` knows concrete classes; everything else
  receives abstractions, which is what keeps the unit tests simple.

## Privacy

- No analytics, no cookies, no third-party requests — and therefore no cookie banner.
  An E2E test fails if the page ever loads anything from another domain.
- Only UI preferences (theme, sound, game best score) are kept in the visitor's own `localStorage`.
- No forms either: visitors reach out through the listed contacts.

## Deployment (GitHub Pages, free)

1. Repository: **`SarnaKhmel/oleksa_sarnatskyi`** → served at
   https://sarnakhmel.github.io/oleksa_sarnatskyi/ (the `/oleksa_sarnatskyi` base path is detected
   automatically by `actions/configure-pages`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Optionally add the repository variable `RELEASE_DATE` to pin the release date.
4. Push to `main` — `.github/workflows/deploy.yml` runs lint, types, unit and E2E tests, then
   builds and deploys.

### Cloudflare Workers — static assets (current host while GitHub Actions is unavailable)

Cloudflare builds and deploys on every push to `main` via Workers Builds — no GitHub Actions
needed. `wrangler.jsonc` serves the static export from `./out`; there is no server code, so the
OpenNext adapter that Cloudflare suggests for Next.js must **not** be used.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Build variables | `NODE_VERSION=22`, `NEXT_PUBLIC_SITE_URL=https://<worker>.<account>.workers.dev` |

The Worker name in `wrangler.jsonc` must match the project name in the Cloudflare dashboard.
The site is served from the domain root, so no base path is needed.

## Working on the project

- **Branches:** `main` is always deployable. Work in `feat/…`, `fix/…`, `content/…` branches and
  merge through a pull request — CI must be green.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org) — `feat:`, `fix:`,
  `content:`, `refactor:`, `test:`, `chore:`. Keep refactors and features in separate commits.
- **Versioning:** [SemVer](https://semver.org) in `package.json` — the version and the build date
  are shown on the first screen.
  - `patch` — content and copy updates, small fixes
  - `minor` — new sections or features
  - `major` — redesigns or breaking structural changes
- **Releasing:** bump the version (`npm version minor --no-git-tag-version`), add an entry to
  `CHANGELOG.md`, merge to `main`. Pin a date with the `RELEASE_DATE` variable if needed.
- **Tests are mandatory:** every logic change comes with a unit test; every user-visible flow
  with a Playwright test. Run `npm run check` before pushing.
- **Content rules:** only facts that can be explained in an interview; no confidential employer
  details (ticket ids, internal module names, private numbers); never publish a phone number.
- **Accessibility:** keyboard navigable, visible focus, 44px tap targets, `prefers-reduced-motion`
  respected, no content hidden without JavaScript.
- **Dependencies:** think twice before adding one; the site should stay small and static.

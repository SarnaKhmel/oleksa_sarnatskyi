@AGENTS.md

# Project notes for AI assistants

Read `README.md` first — it is the source of truth for architecture and working rules.

- Static export only (`output: 'export'`): no server features (route handlers with Request,
  cookies, redirects, server actions, proxy). Everything must work as static assets on Cloudflare Workers.
- Copy lives in `src/content/**`; components never hard-code text. Keep `en.ts` and `uk.ts`
  structurally identical (a unit test enforces it). English is the default locale.
- Business logic goes to `src/services/**` or `src/game/**` behind interfaces; only
  `src/providers/services.ts` instantiates concrete classes.
- New section → component in `src/components/sections/` + entry in `registry.tsx` + nav item and
  `sections.<id>` copy in both locales.
- Content must be truthful and NDA-safe: no ticket ids, internal module names, phone numbers.
- Every change ships with tests: Vitest in a `tests/` folder next to the code, Playwright in `e2e/`.
- Run `npm run check` (and `npm run build && npm run test:e2e` for UI changes) before finishing.

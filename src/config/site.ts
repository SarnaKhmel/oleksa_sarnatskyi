import type { Locale } from '@/i18n/locales';

/**
 * GitHub Pages serves a project site from `/<repo>/`. The deploy workflow passes
 * that prefix through `NEXT_PUBLIC_BASE_PATH`; locally it is empty.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

export function cvFileName(locale: Locale): string {
  return `oleksa-sarnatskyi-cv-${locale}.pdf`;
}

/** Public URL of the generated CV (see `scripts/generate-cv.tsx`). */
export function cvHref(locale: Locale): string {
  return withBasePath(`/cv/${cvFileName(locale)}`);
}

/** Injected at build time by next.config.ts (package.json version, build date). */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0-dev';
export const RELEASE_DATE = process.env.NEXT_PUBLIC_RELEASE_DATE ?? '';

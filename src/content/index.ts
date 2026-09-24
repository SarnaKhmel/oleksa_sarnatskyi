import type { SiteContent } from '@/domain/content';
import type { Locale } from '@/i18n/locales';
import { en } from '@/content/locales/en';
import { uk } from '@/content/locales/uk';

/**
 * Locale → content registry. Adding a language means adding one entry here
 * and one locale file — no consumer changes (open/closed).
 */
const CONTENT: Record<Locale, SiteContent> = { uk, en };

export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}

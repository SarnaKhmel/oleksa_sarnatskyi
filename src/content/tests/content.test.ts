import { describe, expect, it } from 'vitest';
import { getContent } from '@/content';
import { buildContacts, PROFILE } from '@/content/profile';
import type { SiteContent } from '@/domain/content';
import { LOCALES } from '@/i18n/locales';
import { SECTIONS } from '@/components/sections/registry';

const en = getContent('en');
const uk = getContent('uk');

/** Collects the "shape" of an object: keys and array lengths, not the text. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shape(inner)]));
  }
  return typeof value;
}

const ids = (content: SiteContent, key: 'career' | 'cases' | 'skills' | 'achievements' | 'projects' | 'beyond') =>
  content[key].map((item) => item.id);

describe('content', () => {
  it('has a content file for every locale', () => {
    for (const locale of LOCALES) expect(getContent(locale).locale).toBe(locale);
  });

  it('keeps Ukrainian and English structurally identical', () => {
    expect(shape(uk)).toEqual(shape(en));
    for (const key of ['career', 'cases', 'skills', 'achievements', 'projects', 'beyond'] as const) {
      expect(ids(uk, key)).toEqual(ids(en, key));
    }
  });

  it('links every navigation item to a rendered section', () => {
    const rendered = new Set(SECTIONS.map((section) => section.id));
    for (const item of en.nav) expect(rendered.has(item.id)).toBe(true);
  });

  it('never publishes a phone number', () => {
    const text = JSON.stringify([en, uk]);
    expect(text).not.toMatch(/\+?380[\s\d-]{7,}/);
    expect(text).not.toMatch(/tel:/);
  });

  it('does not leak internal Voopty names (NDA)', () => {
    const text = JSON.stringify([en, uk]);
    for (const secret of ['VOOP-', 'MyTeacherView', 'ClientPage', 'bot-father', 'class-pre-booking', '@voopty/common']) {
      expect(text).not.toContain(secret);
    }
  });

  it('skips contacts that are not configured', () => {
    const contacts = buildContacts({ email: 'E', telegram: 'T', linkedin: 'L', github: 'G' });
    for (const contact of contacts) expect(contact.href).not.toBe('');
    expect(contacts.some((contact) => contact.kind === 'telegram')).toBe(Boolean(PROFILE.telegram.url));
  });

  it('marks exactly one current full-time job', () => {
    expect(en.career.filter((stage) => stage.current && stage.kind === 'work')).toHaveLength(1);
  });
});

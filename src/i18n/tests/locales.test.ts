import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, detectLocale, isLocale, LOCALES } from '../locales';

describe('locales', () => {
  it('uses English as the default and first locale', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALES[0]).toBe('en');
  });

  it('recognises supported locales only', () => {
    expect(isLocale('uk')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('ru')).toBe(false);
  });

  it('detects the first supported browser language', () => {
    expect(detectLocale(['uk-UA', 'en-US'])).toBe('uk');
    expect(detectLocale(['de-DE', 'en-GB'])).toBe('en');
    expect(detectLocale(['fr'])).toBe('en');
    expect(detectLocale([])).toBe('en');
  });
});

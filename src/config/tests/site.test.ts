import { describe, expect, it } from 'vitest';
import { cvFileName, withBasePath } from '../site';

describe('site config', () => {
  it('prefixes paths with the base path (empty locally)', () => {
    expect(withBasePath('/cv/a.pdf')).toBe('/cv/a.pdf');
    expect(withBasePath('cv/a.pdf')).toBe('/cv/a.pdf');
  });

  it('names CV files per locale', () => {
    expect(cvFileName('en')).toBe('oleksa-sarnatskyi-cv-en.pdf');
  });
});

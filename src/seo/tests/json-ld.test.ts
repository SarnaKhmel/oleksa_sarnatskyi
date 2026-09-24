import { describe, expect, it } from 'vitest';
import { getContent } from '@/content';
import { buildPersonJsonLd } from '../json-ld';

describe('buildPersonJsonLd', () => {
  it('describes the person for search engines', () => {
    const data = JSON.parse(buildPersonJsonLd(getContent('en')));
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Oleksa Sarnatskyi');
    expect(data.sameAs).toContain('https://github.com/SarnaKhmel');
  });

  it('cannot break out of the surrounding script tag', () => {
    expect(buildPersonJsonLd(getContent('en'))).not.toContain('<');
  });
});

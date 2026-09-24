import { describe, expect, it } from 'vitest';
import { pdfText } from '../CvDocument';

describe('pdfText', () => {
  it('replaces arrows missing from the PDF font', () => {
    expect(pdfText('AWS → Hetzner')).toBe('AWS -> Hetzner');
  });

  it('breaks fi/fl ligatures so ATS parsers read the words', () => {
    expect(pdfText('first flow')).toBe('f‌irst f‌low');
  });

  it('drops inline-code backticks', () => {
    expect(pdfText('use `Nx`')).toBe('use Nx');
  });
});

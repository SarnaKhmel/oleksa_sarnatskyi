import { describe, expect, it } from 'vitest';
import { advanceSequence, KONAMI } from '../KonamiSecret';

describe('Konami code', () => {
  it('completes on the full sequence', () => {
    const progress = KONAMI.reduce((current, key) => advanceSequence(current, key), 0);
    expect(progress).toBe(KONAMI.length);
  });

  it('resets on a wrong key and accepts upper-case letters', () => {
    expect(advanceSequence(3, 'x')).toBe(0);
    expect(advanceSequence(1, 'ArrowUp')).toBe(2);
    expect(advanceSequence(8, 'B')).toBe(9);
  });
});

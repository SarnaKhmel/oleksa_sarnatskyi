import { describe, expect, it } from 'vitest';
import { toRuns } from '../PixelSprite';
import { BUG, CLOUD, DEV_FRAMES, HEART_EMPTY, HILLS, ICONS, MONITOR, type SpriteData } from '../sprites';

const PALETTE_CHARS = new Set(['.', 'X', 'F', 'A', 'H', 'S', 'M', 'G', 'D', 'B']);

const all: Record<string, SpriteData> = {
  ...ICONS,
  HEART_EMPTY,
  CLOUD,
  HILLS,
  MONITOR,
  BUG,
  DEV_0: DEV_FRAMES[0],
  DEV_1: DEV_FRAMES[1],
};

describe('sprites', () => {
  it.each(Object.entries(all))('%s has rectangular rows and known palette roles', (_, sprite) => {
    const width = sprite[0].length;
    for (const row of sprite) {
      expect(row).toHaveLength(width);
      for (const char of row) expect(PALETTE_CHARS.has(char)).toBe(true);
    }
  });

  it('merges equal neighbours into runs and skips transparency', () => {
    expect(toRuns(['XX..A'])).toEqual([
      { x: 0, y: 0, width: 2, color: 'var(--border)' },
      { x: 4, y: 0, width: 1, color: 'var(--accent)' },
    ]);
  });

  it('keeps both walk frames the same size', () => {
    expect(DEV_FRAMES[0]).toHaveLength(DEV_FRAMES[1].length);
  });
});

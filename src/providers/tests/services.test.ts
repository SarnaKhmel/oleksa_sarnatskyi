import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getBrowserServices', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('returns the same services on every call, so a language switch keeps music state', async () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    });
    const { getBrowserServices } = await import('../services');

    const first = getBrowserServices();
    first.musicEnabled.set(true);
    const second = getBrowserServices();

    expect(second).toBe(first);
    expect(second.musicEnabled.getSnapshot()).toBe(true);
  });
});

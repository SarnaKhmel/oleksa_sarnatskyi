import { describe, expect, it, vi } from 'vitest';
import { MemoryKeyValueStorage } from '@/services/storage/key-value-storage';
import { isThemePreference, nextPreference, resolveTheme, THEME_STORAGE_KEY } from '../theme';
import { ThemeStore, type SystemThemeSource, type ThemeTarget } from '../theme-store';

function fakeSystem(dark: boolean) {
  const listeners = new Set<() => void>();
  const source: SystemThemeSource & { set(value: boolean): void } = {
    prefersDark: () => dark,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(value) {
      dark = value;
      listeners.forEach((listener) => listener());
    },
  };
  return source;
}

describe('theme helpers', () => {
  it('follows the system by default', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('cycles system → light → dark → system', () => {
    expect(nextPreference('system')).toBe('light');
    expect(nextPreference('light')).toBe('dark');
    expect(nextPreference('dark')).toBe('system');
  });

  it('validates stored values', () => {
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('neon')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});

describe('ThemeStore', () => {
  it('starts from the OS preference when nothing is stored', () => {
    const store = new ThemeStore(new MemoryKeyValueStorage(), fakeSystem(true), { apply: vi.fn() });
    expect(store.getSnapshot()).toEqual({ preference: 'system', theme: 'dark' });
  });

  it('persists an explicit choice and applies it', () => {
    const storage = new MemoryKeyValueStorage();
    const target: ThemeTarget = { apply: vi.fn() };
    const store = new ThemeStore(storage, fakeSystem(false), target);
    store.setPreference('dark');
    expect(storage.get(THEME_STORAGE_KEY)).toBe('dark');
    expect(target.apply).toHaveBeenCalledWith('dark');
    store.setPreference('system');
    expect(storage.get(THEME_STORAGE_KEY)).toBeNull();
  });

  it('reacts to OS changes while following the system', () => {
    const system = fakeSystem(false);
    const store = new ThemeStore(new MemoryKeyValueStorage(), system, { apply: vi.fn() });
    const listener = vi.fn();
    store.subscribe(listener);
    system.set(true);
    expect(store.getSnapshot().theme).toBe('dark');
    expect(listener).toHaveBeenCalled();
  });
});

import type { KeyValueStorage } from '@/services/storage/key-value-storage';
import {
  isThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
  type ThemePreference,
} from './theme';

/** Where the resolved theme is applied (the <html> element in the browser). */
export interface ThemeTarget {
  apply(theme: Theme): void;
}

/** Source of the OS colour-scheme preference. */
export interface SystemThemeSource {
  prefersDark(): boolean;
  subscribe(listener: () => void): () => void;
}

export interface ThemeSnapshot {
  preference: ThemePreference;
  theme: Theme;
}

/**
 * Observable theme state, shaped for React's `useSyncExternalStore`.
 * All side effects go through injected abstractions.
 */
export class ThemeStore {
  private listeners = new Set<() => void>();
  private snapshot: ThemeSnapshot;
  private unsubscribeSystem: (() => void) | null = null;

  constructor(
    private readonly storage: KeyValueStorage,
    private readonly system: SystemThemeSource,
    private readonly target: ThemeTarget,
  ) {
    const stored = storage.get(THEME_STORAGE_KEY);
    const preference = isThemePreference(stored) ? stored : 'system';
    this.snapshot = { preference, theme: resolveTheme(preference, system.prefersDark()) };
  }

  getSnapshot = (): ThemeSnapshot => this.snapshot;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    if (!this.unsubscribeSystem) {
      this.unsubscribeSystem = this.system.subscribe(() => this.recompute());
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && this.unsubscribeSystem) {
        this.unsubscribeSystem();
        this.unsubscribeSystem = null;
      }
    };
  };

  setPreference(preference: ThemePreference): void {
    if (preference === 'system') this.storage.remove(THEME_STORAGE_KEY);
    else this.storage.set(THEME_STORAGE_KEY, preference);
    this.update(preference);
  }

  private recompute(): void {
    this.update(this.snapshot.preference);
  }

  private update(preference: ThemePreference): void {
    const theme = resolveTheme(preference, this.system.prefersDark());
    this.snapshot = { preference, theme };
    this.target.apply(theme);
    this.listeners.forEach((listener) => listener());
  }
}

export class MediaQuerySystemTheme implements SystemThemeSource {
  private readonly query = window.matchMedia('(prefers-color-scheme: dark)');

  prefersDark(): boolean {
    return this.query.matches;
  }

  subscribe(listener: () => void): () => void {
    this.query.addEventListener('change', listener);
    return () => this.query.removeEventListener('change', listener);
  }
}

export class DocumentThemeTarget implements ThemeTarget {
  apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

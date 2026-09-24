import type { KeyValueStorage } from './key-value-storage';

/** A persisted boolean exposed for `useSyncExternalStore` (sound, music…). */
export class FlagStore {
  private listeners = new Set<() => void>();
  private value: boolean;

  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key: string,
    defaultValue = false,
  ) {
    const stored = storage.get(key);
    this.value = stored === null ? defaultValue : stored === 'true';
  }

  getSnapshot = (): boolean => this.value;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  set(value: boolean): void {
    this.value = value;
    this.storage.set(this.key, String(value));
    this.listeners.forEach((listener) => listener());
  }

  toggle(): boolean {
    this.set(!this.value);
    return this.value;
  }
}

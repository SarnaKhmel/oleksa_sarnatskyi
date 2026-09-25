import { FlagStore } from '@/services/storage/flag-store';
import {
  BrowserKeyValueStorage,
  MemoryKeyValueStorage,
} from '@/services/storage/key-value-storage';
import {
  MUSIC_STORAGE_KEY,
  SOUND_STORAGE_KEY,
  type MusicPlayer,
  type SoundEffectsPlayer,
} from '@/services/sound/sound';
import {
  AudioContextProvider,
  ChiptuneMusicPlayer,
  WebAudioEffectsPlayer,
} from '@/services/sound/web-audio';
import {
  DocumentThemeTarget,
  MediaQuerySystemTheme,
  ThemeStore,
} from '@/services/theme/theme-store';

export interface AppServices {
  theme: ThemeStore;
  soundEnabled: FlagStore;
  musicEnabled: FlagStore;
  effects: SoundEffectsPlayer;
  music: MusicPlayer;
}

/**
 * Composition root: the only place that knows concrete implementations.
 * Browser-only — called from the client provider.
 */
export function createBrowserServices(): AppServices {
  const storage = new BrowserKeyValueStorage();
  const audio = new AudioContextProvider();
  return {
    theme: new ThemeStore(storage, new MediaQuerySystemTheme(), new DocumentThemeTarget()),
    soundEnabled: new FlagStore(storage, SOUND_STORAGE_KEY, false),
    // Music is not persisted: it must never auto-start on the next visit.
    musicEnabled: new FlagStore(new MemoryKeyValueStorage(), MUSIC_STORAGE_KEY, false),
    effects: new WebAudioEffectsPlayer(audio),
    music: new ChiptuneMusicPlayer(audio),
  };
}

let browserServices: AppServices | null = null;

/**
 * One set of services per browser tab. The `[lang]` layout remounts when the language
 * changes, so creating services per mount would leave the old music loop playing while
 * the new toggles show "off".
 */
export function getBrowserServices(): AppServices {
  browserServices ??= createBrowserServices();
  return browserServices;
}

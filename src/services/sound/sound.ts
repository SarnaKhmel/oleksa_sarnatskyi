export type SoundEffect = 'select' | 'confirm' | 'coin' | 'secret';

/** Short UI blips. */
export interface SoundEffectsPlayer {
  play(effect: SoundEffect): void;
}

/** Background chiptune loop. */
export interface MusicPlayer {
  start(): void;
  stop(): void;
}

export const SILENT_EFFECTS: SoundEffectsPlayer = { play: () => undefined };
export const SILENT_MUSIC: MusicPlayer = { start: () => undefined, stop: () => undefined };

export const SOUND_STORAGE_KEY = 'sound-enabled';
export const MUSIC_STORAGE_KEY = 'music-enabled';

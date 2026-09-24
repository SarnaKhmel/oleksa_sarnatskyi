'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { SoundEffect } from '@/services/sound/sound';
import type { ThemePreference } from '@/services/theme/theme';
import type { ThemeSnapshot } from '@/services/theme/theme-store';
import { useServices } from './AppProviders';

const noopSubscribe = () => () => undefined;
const SERVER_THEME: ThemeSnapshot = { preference: 'system', theme: 'light' };

export function useTheme() {
  const services = useServices();
  const snapshot = useSyncExternalStore(
    services?.theme.subscribe ?? noopSubscribe,
    services?.theme.getSnapshot ?? (() => SERVER_THEME),
    () => SERVER_THEME,
  );
  const setPreference = useCallback(
    (preference: ThemePreference) => services?.theme.setPreference(preference),
    [services],
  );
  return { ...snapshot, setPreference };
}

function useFlag(pick: (s: NonNullable<ReturnType<typeof useServices>>) => {
  subscribe: (l: () => void) => () => void;
  getSnapshot: () => boolean;
}) {
  const services = useServices();
  const store = services ? pick(services) : null;
  return useSyncExternalStore(
    store?.subscribe ?? noopSubscribe,
    store?.getSnapshot ?? (() => false),
    () => false,
  );
}

/** Plays a UI blip if the viewer enabled sound. Safe to call anywhere. */
export function useSfx() {
  const services = useServices();
  return useCallback(
    (effect: SoundEffect) => {
      if (services?.soundEnabled.getSnapshot()) services.effects.play(effect);
    },
    [services],
  );
}

export function useSoundToggle() {
  const services = useServices();
  const enabled = useFlag((s) => s.soundEnabled);
  const toggle = useCallback(() => {
    if (!services) return;
    if (services.soundEnabled.toggle()) services.effects.play('confirm');
  }, [services]);
  return { enabled, toggle };
}

export function useMusicToggle() {
  const services = useServices();
  const enabled = useFlag((s) => s.musicEnabled);
  const toggle = useCallback(() => {
    if (!services) return;
    if (services.musicEnabled.toggle()) services.music.start();
    else services.music.stop();
  }, [services]);
  return { enabled, toggle };
}

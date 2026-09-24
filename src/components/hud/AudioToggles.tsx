'use client';

import { useMusicToggle, useSoundToggle } from '@/providers/hooks';
import type { UiCopy } from '@/domain/content';

interface ToggleProps {
  pressed: boolean;
  onToggle: () => void;
  glyph: string;
  label: string;
  state: string;
}

function Toggle({ pressed, onToggle, glyph, label, state }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      title={state}
      onClick={onToggle}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-pixel text-[9px] pixel-frame-flat ${
        pressed ? 'bg-accent text-accent-fg' : 'bg-surface text-muted hover:bg-surface-2'
      }`}
    >
      <span aria-hidden="true" className={pressed ? '' : 'line-through decoration-2 opacity-70'}>
        {glyph}
      </span>
    </button>
  );
}

export function AudioToggles({ copy }: { copy: Pick<UiCopy, 'sound' | 'music'> }) {
  const sound = useSoundToggle();
  const music = useMusicToggle();
  return (
    <>
      <Toggle
        pressed={sound.enabled}
        onToggle={sound.toggle}
        glyph="SFX"
        label={copy.sound.label}
        state={sound.enabled ? copy.sound.on : copy.sound.off}
      />
      <Toggle
        pressed={music.enabled}
        onToggle={music.toggle}
        glyph="BGM"
        label={copy.music.label}
        state={music.enabled ? copy.music.on : copy.music.off}
      />
    </>
  );
}

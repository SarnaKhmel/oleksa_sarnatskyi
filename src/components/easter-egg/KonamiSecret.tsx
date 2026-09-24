'use client';

import { useEffect, useState } from 'react';
import { PixelSprite } from '@/components/pixel/PixelSprite';
import { ICONS } from '@/components/pixel/sprites';
import { useServices } from '@/providers/AppProviders';

export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

/** Pure matcher: returns the next progress index for a pressed key. */
export function advanceSequence(progress: number, key: string): number {
  const normalized = key.length === 1 ? key.toLowerCase() : key;
  if (normalized === KONAMI[progress]) return progress + 1;
  return normalized === KONAMI[0] ? 1 : 0;
}

export function KonamiSecret({ title, text }: { title: string; text: string }) {
  const [found, setFound] = useState(false);
  const services = useServices();

  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      progress = advanceSequence(progress, event.key);
      if (progress === KONAMI.length) {
        progress = 0;
        setFound(true);
        // The secret always plays its jingle — it is an explicit player action.
        services?.effects.play('secret');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [services]);

  if (!found) return null;
  return (
    <div role="alert" className="fixed inset-x-0 top-24 z-[80] flex justify-center px-4">
      <div className="flex max-w-md animate-pop items-center gap-4 bg-surface p-4 pixel-frame">
        <PixelSprite sprite={ICONS.star} className="h-10 w-10 shrink-0 animate-bob" />
        <div>
          <p className="font-pixel text-[10px] uppercase">{title}</p>
          <p className="mt-2 text-sm">{text}</p>
        </div>
        <button
          type="button"
          onClick={() => setFound(false)}
          aria-label="✕"
          className="ml-2 min-h-11 min-w-11 font-pixel text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

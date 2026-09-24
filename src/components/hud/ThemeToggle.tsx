'use client';

import { useSfx, useTheme } from '@/providers/hooks';
import { nextPreference } from '@/services/theme/theme';
import type { UiCopy } from '@/domain/content';

export function ThemeToggle({ copy }: { copy: UiCopy['theme'] }) {
  const { preference, setPreference } = useTheme();
  const sfx = useSfx();
  const label = copy[preference];

  return (
    <button
      type="button"
      onClick={() => {
        sfx('select');
        const next = nextPreference(preference);
        setPreference(next);
      }}
      aria-label={`${copy.label}: ${label}`}
      title={`${copy.label}: ${label}`}
      className="inline-flex min-h-11 min-w-16 items-center justify-center bg-surface px-2 font-pixel text-[9px] uppercase text-fg pixel-frame-flat hover:bg-surface-2"
    >
      {label}
    </button>
  );
}

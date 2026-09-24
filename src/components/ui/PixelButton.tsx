'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { useSfx } from '@/providers/hooks';
import type { SoundEffect } from '@/services/sound/sound';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'relative inline-flex select-none items-center justify-center gap-3 font-pixel uppercase ' +
  'leading-tight tracking-wide transition-transform duration-75 ' +
  'hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg pixel-frame-sm active:shadow-none',
  secondary: 'bg-surface text-fg pixel-frame-sm active:shadow-none',
  ghost: 'text-fg hover:bg-surface-2',
};

/** min-h keeps every tap target ≥ 44px on touch screens. */
const SIZES: Record<Size, string> = {
  sm: 'min-h-11 px-3 py-2 text-[10px]',
  md: 'min-h-12 px-4 py-3 text-[10px] sm:text-xs',
  lg: 'min-h-14 px-5 py-4 text-xs sm:text-sm',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  sound?: SoundEffect;
  children: ReactNode;
}

function classes(variant: Variant, size: Size, extra?: string) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra ?? ''}`;
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  sound = 'select',
  className,
  onClick,
  children,
  ...rest
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sfx = useSfx();
  return (
    <button
      type="button"
      className={classes(variant, size, className)}
      onClick={(event) => {
        sfx(sound);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PixelLink({
  variant = 'primary',
  size = 'md',
  sound = 'confirm',
  className,
  onClick,
  children,
  ...rest
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const sfx = useSfx();
  return (
    <a
      className={classes(variant, size, className)}
      onClick={(event) => {
        sfx(sound);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

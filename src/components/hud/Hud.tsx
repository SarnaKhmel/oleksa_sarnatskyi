'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { NavItem, UiCopy } from '@/domain/content';
import type { Locale } from '@/i18n/locales';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSfx } from '@/providers/hooks';
import { Icon } from '@/components/pixel/Icon';
import { AudioToggles } from './AudioToggles';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface HudProps {
  locale: Locale;
  nav: NavItem[];
  ui: UiCopy;
  brand: string;
}

/** Sticky game HUD: brand, section navigation and player settings. */
export function Hud({ locale, nav, ui, brand }: HudProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const sfx = useSfx();
  const ids = useMemo(() => nav.map((item) => item.id), [nav]);
  const active = useActiveSection(ids);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const controls = (
    <>
      <LanguageSwitcher current={locale} label={ui.language.label} />
      <ThemeToggle copy={ui.theme} />
      <AudioToggles copy={ui} />
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b-4 border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-10">
        <a
          href="#start"
          className="flex min-h-11 items-center gap-2 font-pixel text-[10px] uppercase text-fg text-glow sm:text-xs"
          onClick={() => sfx('coin')}
        >
          <Icon name="coin" className="h-6 w-6 animate-bob" />
          <span className="truncate">{brand}</span>
        </a>

        <nav aria-label={ui.menu} className="hidden xl:block">
          <ul className="flex items-center">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => sfx('select')}
                  aria-current={active === item.id ? 'location' : undefined}
                  className="group relative inline-flex min-h-11 items-center px-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted hover:text-fg aria-[current=location]:text-fg"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -left-1 text-accent-2 opacity-0 group-hover:opacity-100 group-aria-[current=location]:opacity-100 dark:text-accent"
                  >
                    ▶
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-1 h-[3px] scale-x-0 bg-accent-2 transition-transform group-aria-[current=location]:scale-x-100 dark:bg-accent"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex xl:ml-0">{controls}</div>

        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 bg-surface px-3 font-pixel text-[10px] uppercase text-fg pixel-frame-flat xl:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => {
            sfx('select');
            setOpen((value) => !value);
          }}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
          {open ? ui.close : ui.menu}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t-4 border-line bg-bg px-4 pb-6 pt-4 sm:px-6 xl:hidden"
      >
        <nav aria-label={ui.menu}>
          <ul className="grid grid-cols-1 gap-2 xs:grid-cols-2">
            {nav.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    sfx('select');
                    setOpen(false);
                  }}
                  aria-current={active === item.id ? 'location' : undefined}
                  className="flex min-h-12 items-center gap-3 bg-surface px-3 font-mono text-sm font-semibold uppercase tracking-wider text-fg pixel-frame-flat aria-[current=location]:bg-accent aria-[current=location]:text-accent-fg"
                >
                  <span className="text-muted">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-5 flex flex-wrap items-center gap-2 md:hidden">{controls}</div>
      </div>
    </header>
  );
}

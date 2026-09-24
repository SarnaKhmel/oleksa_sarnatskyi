'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/locales';
import { useSfx } from '@/providers/hooks';

const LANGUAGE_NAMES: Record<Locale, string> = { uk: 'Українська', en: 'English' };

/** One button that switches to the other language, keeping the current section. */
export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const sfx = useSfx();
  const router = useRouter();
  const target = LOCALES.find((locale) => locale !== current) ?? current;

  return (
    <Link
      href={`/${target}/`}
      hrefLang={target}
      lang={target}
      aria-label={`${label}: ${LANGUAGE_NAMES[target]}`}
      title={LANGUAGE_NAMES[target]}
      onClick={(event) => {
        sfx('select');
        const { hash } = window.location;
        if (hash) {
          event.preventDefault();
          router.push(`/${target}/${hash}`);
        }
      }}
      className="inline-flex min-h-11 min-w-12 items-center justify-center bg-surface px-2 font-pixel text-[9px] text-fg pixel-frame-flat hover:bg-surface-2"
    >
      {LOCALE_LABELS[target]}
    </Link>
  );
}

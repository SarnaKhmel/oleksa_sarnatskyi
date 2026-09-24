import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS } from '@/i18n/locales';

/**
 * Static hosting has no server-side redirects: `/` forwards to the default
 * (English) version with an inline script. Links are the no-JS fallback.
 */
const REDIRECT_SCRIPT = `location.replace('./${DEFAULT_LOCALE}/'+location.hash);`;

export default function EntryPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 p-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=./${DEFAULT_LOCALE}/`} />
      </noscript>
      <p className="font-pixel text-xs uppercase">Loading…</p>
      <nav className="flex gap-4">
        {LOCALES.map((locale) => (
          <a
            key={locale}
            href={`./${locale}/`}
            hrefLang={locale}
            className="bg-surface px-4 py-3 font-pixel text-xs pixel-frame-sm"
          >
            {LOCALE_LABELS[locale]}
          </a>
        ))}
      </nav>
    </main>
  );
}

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { BASE_PATH, SITE_URL } from '@/config/site';
import { getContent } from '@/content';
import { isLocale, LOCALES } from '@/i18n/locales';
import { AppProviders } from '@/providers/AppProviders';
import { THEME_BOOT_SCRIPT } from '@/services/theme/theme';
import { jetbrains, pressStart } from '../fonts';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#e4ebd3' },
    { media: '(prefers-color-scheme: dark)', color: '#0d130f' },
  ],
};

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { meta, person } = getContent(lang);
  const languages = Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}/`]));
  return {
    metadataBase: new URL(`${SITE_URL}${BASE_PATH}/`),
    title: meta.title,
    description: meta.description,
    authors: [{ name: person.name }],
    alternates: {
      canonical: `/${lang}/`,
      languages: { ...languages, 'x-default': '/en/' },
    },
    openGraph: {
      type: 'profile',
      title: meta.title,
      description: meta.description,
      locale: lang === 'uk' ? 'uk_UA' : 'en_US',
      url: `/${lang}/`,
    },
    twitter: { card: 'summary', title: meta.title, description: meta.description },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${pressStart.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

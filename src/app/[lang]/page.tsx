import { notFound } from 'next/navigation';
import { ContactRail } from '@/components/contacts/ContactRail';
import { KonamiSecret } from '@/components/easter-egg/KonamiSecret';
import { Hud } from '@/components/hud/Hud';
import { Footer } from '@/components/layout/Footer';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { HeroSection } from '@/components/sections/hero/HeroSection';
import { PowerUpsSection } from '@/components/sections/PowerUpsSection';
import { SECTIONS } from '@/components/sections/registry';
import { StatsBand } from '@/components/sections/stats/StatsBand';
import { getContent } from '@/content';
import { isLocale } from '@/i18n/locales';
import { buildPersonJsonLd } from '@/seo/json-ld';

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = getContent(lang);
  const { ui } = content;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[90] bg-accent px-4 py-3 font-pixel text-xs text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {ui.skipToContent}
      </a>
      <Hud locale={lang} nav={content.nav} ui={ui} brand="SARNATSKYI.DEV" />
      <ContactRail contacts={content.contacts} label={content.sections.contacts.title} />

      {/* Left padding on large screens keeps content clear of the contact rail. */}
      <main id="main" className="lg:pl-16 2xl:pl-0">
        <HeroSection content={content} locale={lang} />
        <PowerUpsSection title={ui.powerUpsTitle} items={content.powerUps} />
        <StatsBand stats={content.stats} locale={lang} />
        {SECTIONS.map(({ id, Component }) => (
          <Component key={id} content={content} locale={lang} />
        ))}
      </main>

      <Footer content={content} />

      <RevealObserver />
      <KonamiSecret title={ui.secretTitle} text={ui.secretText} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildPersonJsonLd(content) }}
      />
    </>
  );
}

import { CvDownloadLink } from '@/components/cv/CvDownloadLink';
import { Icon } from '@/components/pixel/Icon';
import { PixelLink } from '@/components/ui/PixelButton';
import type { SiteContent } from '@/domain/content';
import type { Locale } from '@/i18n/locales';
import { CharacterSheet } from './CharacterSheet';
import { HeroScene } from './HeroScene';
import { ReleaseLabel } from './ReleaseLabel';

export function HeroSection({ content, locale }: { content: SiteContent; locale: Locale }) {
  const { person, ui } = content;
  return (
    <section
      id="start"
      aria-labelledby="start-title"
      className="mx-auto w-full max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-20"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-4">
            <p className="inline-flex items-center gap-2 bg-surface px-3 py-2 font-pixel text-[9px] uppercase text-fg pixel-frame-flat sm:text-[10px]">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 animate-blink bg-accent-2 dark:bg-accent"
              />
              {ui.available}
            </p>
            <ReleaseLabel copy={ui.release} locale={locale} />
          </div>

          <h1
            id="start-title"
            className="mt-6 font-pixel text-2xl uppercase leading-[1.35] text-fg break-words xs:text-3xl sm:text-4xl lg:text-[2.75rem]"
          >
            {person.name}
          </h1>
          <p className="mt-5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-accent-2 dark:text-accent sm:text-base">
            {person.title}
          </p>
          <p className="mt-2 font-mono text-sm text-muted sm:text-base">
            {person.tagline} · {person.location}
          </p>

          <div className="mt-6 max-w-2xl space-y-3 text-sm leading-relaxed sm:text-base">
            {person.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 xs:flex-row xs:flex-wrap">
            <CvDownloadLink cvLocale={locale} className="w-full xs:w-auto">
              <Icon name="floppy" className="h-5 w-5" />
              {ui.downloadCv}
            </CvDownloadLink>
            <PixelLink href="#contacts" variant="secondary" size="lg" className="w-full xs:w-auto">
              <Icon name="mail" className="h-5 w-5" />
              {ui.contactMe}
            </PixelLink>
          </div>

          <a
            href="#experience"
            className="mt-10 hidden font-mono text-xs uppercase tracking-widest text-muted hover:text-fg sm:inline-flex"
          >
            <span>▼ {ui.pressStart}</span>
          </a>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <HeroScene />
          <CharacterSheet content={content} />
        </div>
      </div>
    </section>
  );
}

import { APP_VERSION, RELEASE_DATE } from '@/config/site';
import type { UiCopy } from '@/domain/content';

export function formatReleaseDate(isoDate: string, locale: string): string {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Cartridge label with the release version and date (both injected at build time). */
export function ReleaseLabel({ copy, locale }: { copy: UiCopy['release']; locale: string }) {
  const release = formatReleaseDate(RELEASE_DATE, locale);
  return (
    <dl className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 border-2 border-dashed border-line px-3 py-2 font-pixel text-[9px] uppercase text-muted sm:text-[10px]">
      <div className="flex gap-2">
        <dt>{copy.version}</dt>
        <dd className="text-fg">v{APP_VERSION}</dd>
      </div>
      {release && (
        <div className="flex gap-2">
          <dt>{copy.date}</dt>
          <dd className="text-fg">
            <time dateTime={RELEASE_DATE}>{release}</time>
          </dd>
        </div>
      )}
    </dl>
  );
}

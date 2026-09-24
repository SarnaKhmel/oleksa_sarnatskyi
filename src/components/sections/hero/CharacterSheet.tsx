import { PixelSprite } from '@/components/pixel/PixelSprite';
import { HEART_EMPTY, ICONS } from '@/components/pixel/sprites';
import { PixelFrame } from '@/components/ui/PixelFrame';
import type { SiteContent } from '@/domain/content';

const MAX_HEARTS = 5;

function Hearts({ score, label }: { score: number; label: string }) {
  return (
    <span className="flex gap-1" role="img" aria-label={label}>
      {Array.from({ length: MAX_HEARTS }, (_, i) => (
        <PixelSprite key={i} sprite={i < score ? ICONS.heart : HEART_EMPTY} className="h-3.5 w-4" />
      ))}
    </span>
  );
}

export function CharacterSheet({ content }: { content: SiteContent }) {
  const { person, ui } = content;
  return (
    <PixelFrame className="p-5 sm:p-6">
      <h2 className="font-pixel text-[10px] uppercase tracking-widest text-accent-2 dark:text-accent sm:text-xs">
        {ui.characterSheet}
      </h2>

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {person.sheet.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="text-muted">{key}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-6 font-pixel text-[10px] uppercase text-muted">{ui.languages}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {person.languages.map((language) => (
          <li key={language.name} className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {language.name} <span className="text-muted">· {language.level}</span>
            </span>
            <Hearts score={language.score} label={`${language.name}: ${language.level}`} />
          </li>
        ))}
      </ul>

      <h3 className="mt-6 font-pixel text-[10px] uppercase text-muted">{ui.education}</h3>
      <ul className="mt-3 space-y-3 text-sm">
        {person.education.map((item) => (
          <li key={item.school}>
            <p className="font-semibold">{item.degree}</p>
            <p className="text-muted">
              {item.school} · {item.period}
            </p>
          </li>
        ))}
      </ul>
    </PixelFrame>
  );
}

import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SkillGroup, SiteContent } from '@/domain/content';

/** Items shown before a group is expanded — the strongest ones come first in the content. */
const PREVIEW = 4;

const chipClass = 'border-2 border-line bg-bg px-2 py-1 text-xs leading-snug sm:text-[13px]';

/** The first groups in the content are the main ones; the rest fold under "More skills". */
const PRIMARY_GROUPS = 6;

const gridClass = 'grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3';

/** A skill group as a native <details>: a short preview, the full list on demand. */
function SkillCard({ group }: { group: SkillGroup }) {
  const rest = group.items.slice(PREVIEW);
  return (
    <details className="group bg-surface pixel-frame-sm">
      <summary className="block cursor-pointer p-5 hover:bg-surface-2">
        <span className="flex items-center gap-3 font-pixel text-xs uppercase">
          <Icon name={group.sprite} className="h-7 w-7 shrink-0" />
          {group.title}
          <span className="ml-auto text-[10px] text-muted">×{group.items.length}</span>
          <span
            aria-hidden="true"
            className="text-accent-2 transition-transform group-open:rotate-90 dark:text-accent"
          >
            ▶
          </span>
        </span>
        <span className="mt-4 flex flex-wrap gap-2">
          {group.items.slice(0, PREVIEW).map((item) => (
            <span key={item} className={chipClass}>
              {item}
            </span>
          ))}
          {rest.length > 0 && (
            <span aria-hidden="true" className="self-center px-1 font-mono text-xs text-muted group-open:hidden">
              +{rest.length}
            </span>
          )}
        </span>
      </summary>
      {rest.length > 0 && (
        <ul className="flex flex-wrap gap-2 px-5 pb-5">
          {rest.map((item) => (
            <li key={item} className={chipClass}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

export function SkillsSection({ content }: { content: SiteContent }) {
  const primary = content.skills.slice(0, PRIMARY_GROUPS);
  const more = content.skills.slice(PRIMARY_GROUPS);
  const cards = (groups: SkillGroup[], reveal: boolean) =>
    groups.map((group) => (
      <li key={group.id} data-reveal={reveal || undefined}>
        <SkillCard group={group} />
      </li>
    ));

  return (
    <Section id="skills" copy={content.sections.skills}>
      <ul className={gridClass}>{cards(primary, true)}</ul>
      {more.length > 0 && (
        // Named group: the cards inside have their own `group-open` state.
        <details className="group/more mt-8">
          <summary className="inline-flex min-h-11 cursor-pointer items-center gap-3 bg-surface px-4 py-2 font-pixel text-[10px] uppercase leading-relaxed text-fg pixel-frame-flat hover:bg-surface-2">
            <span
              aria-hidden="true"
              className="text-accent-2 transition-transform group-open/more:rotate-90 dark:text-accent"
            >
              ▶
            </span>
            {content.ui.moreSkills.replace('{count}', String(more.length))}
          </summary>
          <ul className={`mt-8 ${gridClass}`}>{cards(more, false)}</ul>
        </details>
      )}
    </Section>
  );
}

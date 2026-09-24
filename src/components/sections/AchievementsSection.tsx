import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

/** Renders `inline code` fragments from content strings. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, index) =>
        part.startsWith('`') ? (
          <code key={index} className="bg-bg-deep px-1 text-[0.92em] text-accent-2 dark:text-accent">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Native <details> accordion: accessible and works without JavaScript.
 * The first quests start open so a skimming reader sees substance immediately.
 */
export function AchievementsSection({ content }: { content: SiteContent }) {
  return (
    <Section id="achievements" copy={content.sections.achievements}>
      <ol className="grid items-start gap-6 lg:grid-cols-2">
        {content.achievements.map((quest, index) => (
          <li key={quest.id}>
            <details open={index < 2} className="group bg-surface pixel-frame-sm" data-reveal>
              <summary
                className="flex min-h-14 cursor-pointer items-start gap-4 p-4 hover:bg-surface-2 sm:p-5"
                aria-label={`${quest.title} — ${content.ui.openQuest}`}
              >
                <Icon name={quest.sprite} className="mt-0.5 h-8 w-8 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">
                    Quest {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-2 block font-pixel text-[11px] uppercase leading-relaxed sm:text-xs">
                    {quest.title}
                  </span>
                  <span className="mt-2 block text-sm text-muted">{quest.summary}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="font-pixel text-xs text-accent-2 transition-transform group-open:rotate-90 dark:text-accent"
                >
                  ▶
                </span>
              </summary>
              <ul className="space-y-2 border-t-4 border-line px-4 py-4 text-sm leading-relaxed sm:px-5">
                {quest.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="text-accent-2 dark:text-accent">
                      ▸
                    </span>
                    <span className="min-w-0">
                      <RichText text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ol>
    </Section>
  );
}

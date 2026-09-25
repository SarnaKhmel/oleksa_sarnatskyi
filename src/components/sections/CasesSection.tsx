import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

/**
 * Problem → solution → result stories; the format interviewers ask about.
 * The result is always visible; challenge and solution sit in a native <details>
 * so a skimming reader gets the outcome without a wall of text.
 */
export function CasesSection({ content }: { content: SiteContent }) {
  const { ui } = content;
  const details = [
    ['challenge', ui.caseLabels.challenge],
    ['solution', ui.caseLabels.solution],
  ] as const;
  const labelClass =
    'font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-2 dark:text-accent';

  return (
    <Section id="cases" copy={content.sections.cases}>
      <ul className="grid gap-8 lg:grid-cols-2">
        {content.cases.map((item) => (
          <li key={item.id} data-reveal>
            <article className="flex h-full flex-col bg-surface p-5 pixel-frame-sm sm:p-6">
              <div className="flex items-start gap-4">
                <Icon name={item.sprite} className="h-9 w-9 shrink-0" />
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{item.context}</p>
                  <h3 className="mt-2 font-pixel text-[11px] uppercase leading-relaxed sm:text-xs">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed">
                <span className={`block ${labelClass}`}>{ui.caseLabels.result}</span>
                <span className="mt-1 block font-semibold">{item.result}</span>
              </p>
              <details className="group mt-4">
                <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-pixel text-[10px] uppercase text-muted hover:text-fg">
                  <span
                    aria-hidden="true"
                    className="text-accent-2 transition-transform group-open:rotate-90 dark:text-accent"
                  >
                    ▶
                  </span>
                  {ui.openQuest}
                </summary>
                <dl className="mt-2 space-y-4 border-t-4 border-line pt-4 text-sm leading-relaxed">
                  {details.map(([key, label]) => (
                    <div key={key}>
                      <dt className={labelClass}>{label}</dt>
                      <dd className="mt-1 text-fg/90">{item[key]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Stack">
                {item.stack.map((tech) => (
                  <li key={tech} className="bg-bg-deep px-1.5 py-0.5 font-mono text-[11px]">
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}

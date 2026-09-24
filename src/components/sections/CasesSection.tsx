import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

/** Problem → solution → result stories; the format interviewers ask about. */
export function CasesSection({ content }: { content: SiteContent }) {
  const { ui } = content;
  const rows = [
    ['challenge', ui.caseLabels.challenge],
    ['solution', ui.caseLabels.solution],
    ['result', ui.caseLabels.result],
  ] as const;

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
              <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                {rows.map(([key, label]) => (
                  <div key={key}>
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-2 dark:text-accent">
                      {label}
                    </dt>
                    <dd className={`mt-1 ${key === 'result' ? 'font-semibold' : 'text-fg/90'}`}>{item[key]}</dd>
                  </div>
                ))}
              </dl>
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

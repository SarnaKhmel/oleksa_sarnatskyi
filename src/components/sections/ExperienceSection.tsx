import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { CareerStage, SiteContent } from '@/domain/content';

function Stage({ stage, level, content }: { stage: CareerStage; level: number; content: SiteContent }) {
  const { ui } = content;
  const kindLabel = stage.kind === 'work' ? ui.work : ui.teaching;
  return (
    <li className="relative pl-12 sm:pl-16" data-reveal>
      {/* Level node on the path */}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1 flex h-9 w-9 items-center justify-center font-pixel text-[10px] pixel-frame-flat sm:h-11 sm:w-11 ${
          stage.current ? 'bg-accent text-accent-fg' : 'bg-surface text-fg'
        }`}
      >
        {level}
      </span>

      <article className={`h-full bg-surface p-4 sm:p-5 ${stage.current ? 'pixel-frame' : 'pixel-frame-sm'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-fg ${
              stage.kind === 'work' ? 'bg-accent-2' : 'bg-gold'
            }`}
          >
            {kindLabel}
          </span>
          {stage.current && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent-2 dark:text-accent">
              <Icon name="star" className="h-3 w-3" />
              {ui.current}
            </span>
          )}
          <span className="ml-auto font-mono text-xs text-muted">{stage.period || ui.datesTbc}</span>
        </div>
        <h3 className="mt-3 font-pixel text-[11px] uppercase leading-relaxed sm:text-xs">{stage.role}</h3>
        <p className="mt-1 text-sm">
          <span className="font-semibold">{stage.org}</span>
          <span className="text-muted"> · {stage.meta}</span>
        </p>
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
          {stage.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true" className="text-accent-2 dark:text-accent">
                ▸
              </span>
              <span className="min-w-0">{point}</span>
            </li>
          ))}
        </ul>
        {stage.link && (
          <a
            href={stage.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold underline decoration-dotted underline-offset-4 hover:text-accent-2 dark:hover:text-accent"
          >
            ↗ {stage.link.label}
          </a>
        )}
      </article>
    </li>
  );
}

/** Career path as a vertical "level map": the newest level on top. */
export function ExperienceSection({ content }: { content: SiteContent }) {
  const { career } = content;
  return (
    <Section id="experience" copy={content.sections.experience}>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-[16px] top-4 w-1 sm:left-[20px]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 50%, transparent 50%)',
            backgroundSize: '4px 12px',
          }}
        />
        <ol className="relative grid gap-8 lg:max-w-5xl">
          {career.map((stage, index) => (
            <Stage key={stage.id} stage={stage} level={career.length - index} content={content} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

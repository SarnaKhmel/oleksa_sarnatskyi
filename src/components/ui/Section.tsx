import type { ReactNode } from 'react';
import type { SectionCopy, SectionId } from '@/domain/content';

interface SectionProps {
  id: SectionId;
  copy: SectionCopy;
  children: ReactNode;
  className?: string;
}

/** A page "level": terminal command, small kicker, pixel title and a lead. */
export function Section({ id, copy, children, className }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24 ${className ?? ''}`}
    >
      <header className="mb-10 sm:mb-12" data-reveal>
        <p className="font-mono text-xs text-muted sm:text-sm">
          <span aria-hidden="true" className="text-accent-2 dark:text-accent">
            ${' '}
          </span>
          {copy.command}
          <span aria-hidden="true" className="ml-1 inline-block animate-blink">
            ▌
          </span>
        </p>
        <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-2 dark:text-accent">
          {copy.kicker}
        </p>
        <h2
          id={headingId}
          className="mt-3 font-pixel text-lg uppercase leading-snug text-fg break-words sm:text-2xl lg:text-3xl"
        >
          {copy.title}
        </h2>
        {copy.lead && (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
            {copy.lead}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

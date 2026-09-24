import { Icon } from '@/components/pixel/Icon';
import { PixelFrame } from '@/components/ui/PixelFrame';
import type { PowerUp } from '@/domain/content';

/** "Why hire me" — the first thing a recruiter reads after the hero. */
export function PowerUpsSection({ title, items }: { title: string; items: PowerUp[] }) {
  return (
    <section
      id="powerups"
      aria-labelledby="powerups-title"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-10"
    >
      <h2
        id="powerups-title"
        className="font-pixel text-sm uppercase text-fg sm:text-base"
      >
        {title}
      </h2>
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.id} data-reveal>
            <PixelFrame className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <Icon name={item.sprite} className="h-9 w-9" />
                <span className="font-pixel text-lg text-accent-2 dark:text-accent sm:text-xl">
                  {item.value}
                </span>
              </div>
              <h3 className="mt-5 font-pixel text-[11px] uppercase leading-relaxed">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </PixelFrame>
          </li>
        ))}
      </ul>
    </section>
  );
}

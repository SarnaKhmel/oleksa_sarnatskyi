import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

export function BeyondSection({ content }: { content: SiteContent }) {
  return (
    <Section id="beyond" copy={content.sections.beyond}>
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {content.beyond.map((item) => (
          <li key={item.id} className="flex gap-4 bg-surface p-5 pixel-frame-sm" data-reveal>
            <Icon name={item.sprite} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-pixel text-[11px] uppercase leading-relaxed">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

import { Icon } from '@/components/pixel/Icon';
import { PixelFrame } from '@/components/ui/PixelFrame';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

export function SkillsSection({ content }: { content: SiteContent }) {
  return (
    <Section id="skills" copy={content.sections.skills}>
      <ul className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {content.skills.map((group) => (
          <li key={group.id} data-reveal>
            <PixelFrame className="h-full p-5 sm:p-6">
              <h3 className="flex items-center gap-3 font-pixel text-xs uppercase">
                <Icon name={group.sprite} className="h-7 w-7 shrink-0" />
                {group.title}
                <span className="ml-auto text-[10px] text-muted">×{group.items.length}</span>
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-2 border-line bg-bg px-2 py-1 text-xs leading-snug sm:text-[13px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </PixelFrame>
          </li>
        ))}
      </ul>
    </Section>
  );
}

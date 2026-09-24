import { GameCanvas } from '@/components/game/GameCanvas';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';

/** A reward for readers who scrolled to the very end. */
export function GameSection({ content }: { content: SiteContent }) {
  return (
    <Section id="game" copy={content.sections.game}>
      <div className="max-w-4xl" data-reveal>
        <GameCanvas copy={content.ui.game} />
      </div>
    </Section>
  );
}

import type { SpriteName } from '@/domain/content';
import { PixelSprite } from './PixelSprite';
import { ICONS } from './sprites';

export function Icon({ name, className }: { name: SpriteName; className?: string }) {
  return <PixelSprite sprite={ICONS[name]} className={className ?? 'h-6 w-6'} />;
}

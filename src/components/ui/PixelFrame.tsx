import type { ElementType, ReactNode } from 'react';

interface PixelFrameProps {
  as?: ElementType;
  className?: string;
  size?: 'md' | 'sm';
  children: ReactNode;
}

/** Surface with a notched pixel border and a hard 8-bit shadow. */
export function PixelFrame({ as: Tag = 'div', className, size = 'md', children }: PixelFrameProps) {
  const frame = size === 'md' ? 'pixel-frame' : 'pixel-frame-sm';
  return <Tag className={`bg-surface ${frame} ${className ?? ''}`}>{children}</Tag>;
}

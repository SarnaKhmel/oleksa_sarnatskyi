import type { SpriteData } from './sprites';

const PALETTE: Record<string, string> = {
  X: 'var(--border)',
  F: 'var(--fg)',
  A: 'var(--accent)',
  H: 'var(--accent-2)',
  S: 'var(--surface)',
  M: 'var(--muted)',
  G: 'var(--gold)',
  D: 'var(--danger)',
  B: 'var(--bg-deep)',
};

interface Run {
  x: number;
  y: number;
  width: number;
  color: string;
}

/** Merges horizontal runs of equal colour so a sprite is a handful of <rect>s. */
export function toRuns(sprite: SpriteData): Run[] {
  const runs: Run[] = [];
  sprite.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end += 1;
      const color = PALETTE[char];
      if (color) runs.push({ x, y, width: end - x, color });
      x = end;
    }
  });
  return runs;
}

interface PixelSpriteProps {
  sprite: SpriteData;
  className?: string;
  /** Accessible name. Omit for decorative sprites (hidden from screen readers). */
  title?: string;
}

export function PixelSprite({ sprite, className, title }: PixelSpriteProps) {
  const width = sprite[0]?.length ?? 0;
  const height = sprite.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`pixelated ${className ?? ''}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {toRuns(sprite).map((run) => (
        <rect
          key={`${run.x}-${run.y}`}
          x={run.x}
          y={run.y}
          width={run.width}
          height={1}
          fill={run.color}
        />
      ))}
    </svg>
  );
}

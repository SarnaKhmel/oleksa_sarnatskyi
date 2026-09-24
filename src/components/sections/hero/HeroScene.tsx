import { PixelSprite } from '@/components/pixel/PixelSprite';
import { CLOUD, DEV_FRAMES, HILLS, ICONS, MONITOR } from '@/components/pixel/sprites';

/** A strip rendered twice so a -50% translate loops seamlessly. */
function Looping({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={`flex w-[200%] ${className}`} aria-hidden="true">
      <div className="flex w-1/2">{children}</div>
      <div className="flex w-1/2">{children}</div>
    </div>
  );
}

/** Decorative side-scroller scene: drifting clouds, hills, the hero coding. */
export function HeroScene() {
  return (
    <div
      aria-hidden="true"
      className="relative h-56 w-full overflow-hidden bg-surface-2 pixel-frame xs:h-64 sm:h-72"
    >
      {/* Sky */}
      <Looping className="absolute top-4 animate-drift-slow">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex w-1/3 justify-around">
            <PixelSprite sprite={CLOUD} className="h-6 w-16 opacity-80 sm:h-8 sm:w-20" />
            <PixelSprite sprite={CLOUD} className="mt-8 h-5 w-12 opacity-60" />
          </div>
        ))}
      </Looping>

      {/* Floating coins */}
      <div className="absolute left-[12%] top-16 flex gap-3 sm:top-20">
        {[0, 1, 2].map((i) => (
          <PixelSprite
            key={i}
            sprite={ICONS.coin}
            className="h-5 w-5 animate-bob sm:h-6 sm:w-6"
          />
        ))}
      </div>
      <PixelSprite
        sprite={ICONS.star}
        className="absolute right-[10%] top-10 h-6 w-6 animate-bob sm:h-8 sm:w-8"
      />

      {/* Hills */}
      <Looping className="absolute bottom-8 animate-drift">
        {[0, 1, 2, 3].map((i) => (
          <PixelSprite key={i} sprite={HILLS} className="h-12 w-1/4 sm:h-16" />
        ))}
      </Looping>

      {/* Ground: brick tiles */}
      <div
        className="absolute inset-x-0 bottom-0 h-8 border-t-4 border-line bg-accent-2"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 2px, transparent 2px), linear-gradient(90deg, var(--border) 2px, transparent 2px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Hero at the desk */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-end gap-2">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20">
          <PixelSprite sprite={DEV_FRAMES[0]} className="absolute inset-0 h-full w-full animate-frame" />
          <PixelSprite
            sprite={DEV_FRAMES[1]}
            className="absolute inset-0 h-full w-full animate-frame [animation-delay:-0.3s]"
          />
        </div>
        <PixelSprite sprite={MONITOR} className="mb-0 h-12 w-16 sm:h-15 sm:w-20" />
      </div>
    </div>
  );
}

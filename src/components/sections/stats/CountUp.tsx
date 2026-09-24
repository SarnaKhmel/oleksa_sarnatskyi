'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 1200;

/**
 * Arcade score roll-up once the number scrolls into view. The final value is
 * rendered on the server, so crawlers, no-JS and reduced-motion users see it as is.
 */
export function CountUp({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / DURATION_MS);
          // Stepped easing keeps the 8-bit feel.
          setDisplay(Math.round((Math.floor(progress * 20) / 20) * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setDisplay(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString(locale === 'uk' ? 'uk-UA' : 'en-US')}
    </span>
  );
}

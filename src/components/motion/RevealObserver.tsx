'use client';

import { useEffect } from 'react';

/**
 * Adds `is-visible` to `[data-reveal]` elements the first time they enter the
 * viewport. The hidden start state only applies when <html> has `.js-reveal`,
 * so content is never hidden without JavaScript or with reduced motion.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((node) => {
      // Elements already on screen appear immediately — no flash on load.
      if (node.getBoundingClientRect().top < window.innerHeight) node.classList.add('is-visible');
      else observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}

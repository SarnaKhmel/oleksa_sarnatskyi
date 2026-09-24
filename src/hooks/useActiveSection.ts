'use client';

import { useEffect, useState } from 'react';

/**
 * Scroll-spy: returns the id of the section currently crossing the middle of
 * the viewport, so the header can highlight where the reader is.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      // A thin band in the middle of the screen: exactly one section at a time.
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { getBrowserServices, type AppServices } from './services';

const ServicesContext = createContext<AppServices | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  // Shared across remounts (language switch); during prerender there is no window.
  const [services] = useState<AppServices | null>(() =>
    typeof window === 'undefined' ? null : getBrowserServices(),
  );
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

/** `null` while prerendering — hooks fall back to server snapshots. */
export function useServices(): AppServices | null {
  return useContext(ServicesContext);
}

'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { createBrowserServices, type AppServices } from './services';

const ServicesContext = createContext<AppServices | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  // Lazy initializer: runs once in the browser; during prerender there is no window.
  const [services] = useState<AppServices | null>(() =>
    typeof window === 'undefined' ? null : createBrowserServices(),
  );
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

/** `null` while prerendering — hooks fall back to server snapshots. */
export function useServices(): AppServices | null {
  return useContext(ServicesContext);
}

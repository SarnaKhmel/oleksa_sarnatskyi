import type { NextConfig } from 'next';
import packageJson from './package.json' with { type: 'json' };

/** GitHub Pages project sites live under `/<repo>`; the deploy workflow sets this. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Release date = build date (UTC), unless pinned explicitly for a release. */
const releaseDate = process.env.RELEASE_DATE || new Date().toISOString().slice(0, 10);

const nextConfig: NextConfig = {
  // Pure static export — no server, deployable to any static host.
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_RELEASE_DATE: releaseDate,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests run against the real static export (`out/`), exactly what GitHub
 * Pages serves. Build first: `npm run build && npm run test:e2e`.
 */
const PORT = 4173;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `python3 -m http.server ${PORT} --directory out`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    stderr: 'ignore',
  },
});

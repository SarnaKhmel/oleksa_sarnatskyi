import { expect, test } from '@playwright/test';

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1440, 1920];


test.describe('responsive layout', () => {
  for (const width of WIDTHS) {
    for (const locale of ['en', 'uk']) {
      test(`${locale} has no horizontal scroll at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/`);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test('the root opens the English version', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('both CV files are downloadable PDFs', async ({ request }) => {
  for (const locale of ['en', 'uk']) {
    const response = await request.get(`/cv/oleksa-sarnatskyi-cv-${locale}.pdf`);
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  }
});

test('theme follows the OS and can be overridden', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: /theme/i }).first().click(); // auto → day
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('language switch keeps the reader in the same section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/#skills');
  await page.getByRole('link', { name: /language/i }).first().click();
  await expect(page).toHaveURL(/\/uk\/#skills$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
});

test('music and sound keep their state across a language switch', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page.getByRole('button', { name: '8-bit music' }).click();
  await page.getByRole('button', { name: 'Sound effects' }).click();

  await page.getByRole('link', { name: /language/i }).first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
  await expect(page.getByRole('button', { name: '8-бітна музика' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Звукові ефекти' })).toHaveAttribute('aria-pressed', 'true');
});

for (const width of [375, 768, 1024, 1280, 1440]) {
  test(`contact cards are equal and the email stays on one line at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/#contacts');
    const cards = page.locator('#contacts li > a');
    const boxes = await cards.evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect()).map(({ width, height }) => ({ width, height })),
    );
    expect(new Set(boxes.map((box) => Math.round(box.width))).size).toBe(1);
    expect(new Set(boxes.map((box) => Math.round(box.height))).size).toBe(1);

    const email = page.locator('#contacts a[href^="mailto:"] span.font-semibold');
    const lineHeight = await email.evaluate((node) => parseFloat(getComputedStyle(node).lineHeight));
    expect((await email.boundingBox())!.height).toBeLessThan(lineHeight * 1.5);
  });
}

test('navigation highlights the section being read', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page.locator('#cases').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect(page.locator('header a[aria-current="location"]').first()).toHaveAttribute('href', '#cases');
});


test('the bonus game can be played', async ({ page }) => {
  await page.goto('/en/#game');
  await page.getByRole('button', { name: /press start/i }).click();
  await page.waitForTimeout(1200);
  const scoreText = await page.locator('#game').getByText(/score:/i).innerText();
  expect(Number(scoreText.replace(/\D/g, ''))).toBeGreaterThan(0);
});

test('contacts never include a phone number', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
});

test('the site collects no analytics and shows no cookie banner', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/en/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('region', { name: /privacy|cookie/i })).toHaveCount(0);
  const external = requests.filter((url) => !url.startsWith('http://localhost'));
  expect(external).toEqual([]);
});

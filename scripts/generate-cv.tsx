/**
 * Renders the CV PDFs (one per locale) into `public/cv/` from the same content
 * the website uses, so the site and the résumé can never drift apart.
 *
 * Runs automatically before `dev` and `build` (see package.json).
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { renderToFile } from '@react-pdf/renderer';
import { cvFileName } from '@/config/site';
import { getContent } from '@/content';
import { LOCALES } from '@/i18n/locales';
import { CvDocument } from '@/pdf/CvDocument';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'cv');

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const locale of LOCALES) {
    const file = path.join(OUTPUT_DIR, cvFileName(locale));
    await renderToFile(<CvDocument content={getContent(locale)} />, file);
    console.log(`✓ CV (${locale}) → ${path.relative(process.cwd(), file)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

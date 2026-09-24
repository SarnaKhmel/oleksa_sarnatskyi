import type { Metadata } from 'next';
import { THEME_BOOT_SCRIPT } from '@/services/theme/theme';
import { jetbrains, pressStart } from '../fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Oleksa Sarnatskyi — Full-Stack Developer',
  robots: { index: false, follow: true },
};

/** Minimal root layout for `/`, which only forwards to `/uk/` or `/en/`. */
export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}

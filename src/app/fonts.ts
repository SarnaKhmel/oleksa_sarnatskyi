import { JetBrains_Mono, Press_Start_2P } from 'next/font/google';

/** 8-bit display font (headings, HUD). Has Cyrillic glyphs. */
export const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-press-start',
  display: 'swap',
});

/** Readable coder font for body text. */
export const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
});

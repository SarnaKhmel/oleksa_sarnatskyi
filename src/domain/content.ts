/**
 * Domain model of the portfolio content.
 *
 * Every locale file implements `SiteContent`, and every consumer (web sections,
 * PDF generator) depends only on these interfaces — never on a concrete locale.
 */

export type SpriteName =
  | 'rocket'
  | 'refactor'
  | 'coin'
  | 'card'
  | 'chat'
  | 'chart'
  | 'castle'
  | 'shield'
  | 'bolt'
  | 'clock'
  | 'server'
  | 'check'
  | 'mail'
  | 'telegram'
  | 'linkedin'
  | 'github'
  | 'floppy'
  | 'star'
  | 'heart'
  | 'skull'
  | 'brain'
  | 'database'
  | 'people'
  | 'chip'
  | 'cube'
  | 'cup';

export type ContactKind = 'email' | 'telegram' | 'linkedin' | 'github';

export interface ContactLink {
  kind: ContactKind;
  label: string;
  href: string;
  /** Human readable handle shown on the button, e.g. `@nickname`. */
  handle: string;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  /** Rendered after the number, e.g. `%` or `+`. */
  suffix?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  sprite: SpriteName;
  items: string[];
}

/** "Why hire me" argument shown right under the hero. */
export interface PowerUp {
  id: string;
  sprite: SpriteName;
  value: string;
  title: string;
  text: string;
}

/** A problem → solution → result story told without confidential details. */
export interface CaseStudy {
  id: string;
  sprite: SpriteName;
  title: string;
  /** e.g. `Voopty · 2024–2026` */
  context: string;
  challenge: string;
  solution: string;
  result: string;
  stack: string[];
}

/** A public (or explicitly shareable) project. */
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  /** Repository names under the GitHub profile; empty for private projects. */
  repos: string[];
  demo?: string;
  /** Shown instead of repo links when the code is private. */
  privateNote?: string;
  sprite: SpriteName;
}

export interface BeyondItem {
  id: string;
  sprite: SpriteName;
  title: string;
  text: string;
}

export type CareerKind = 'work' | 'teaching';

export interface CareerStage {
  id: string;
  kind: CareerKind;
  role: string;
  org: string;
  /** Empty while the exact dates are not confirmed. */
  period: string;
  /** e.g. `Remote · Part-time`. */
  meta: string;
  points: string[];
  /** Marks a current position. */
  current?: boolean;
  link?: { href: string; label: string };
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface SpokenLanguage {
  name: string;
  level: string;
  /** 1..5 — rendered as pixel hearts. */
  score: number;
}

/** Labels used only by the PDF résumé; the data itself is shared with the site. */
export interface CvLabels {
  summaryTitle: string;
  skillsTitle: string;
  experienceTitle: string;
  projectsTitle: string;
  teachingTitle: string;
  educationTitle: string;
  languagesTitle: string;
  volunteeringTitle: string;
}

export interface CvContent {
  summary: string;
  /** Voopty bullets for the résumé (concise, achievement-oriented). */
  bullets: string[];
  /** Short project lines for the résumé. */
  projects: string[];
  volunteering: string;
  /** Grouped skills: `[label, comma separated list]`. */
  skills: [string, string][];
  labels: CvLabels;
}

export type SectionId =
  | 'start'
  | 'experience'
  | 'cases'
  | 'skills'
  | 'projects'
  | 'beyond'
  | 'contacts'
  | 'game';

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface SectionCopy {
  /** Small label above the title, e.g. `Level 2`. */
  kicker: string;
  title: string;
  /** Terminal-style command line shown above the title. */
  command: string;
  lead?: string;
}

export interface UiCopy {
  skipToContent: string;
  menu: string;
  close: string;
  pressStart: string;
  theme: { system: string; light: string; dark: string; label: string };
  sound: { on: string; off: string; label: string };
  music: { on: string; off: string; label: string };
  language: { label: string };
  downloadCv: string;
  downloadCvOther: string;
  copyEmail: string;
  copied: string;
  builtWith: string;
  secretTitle: string;
  secretText: string;
  openQuest: string;
  /** Accordion with the secondary skill groups; `{count}` is replaced. */
  moreSkills: string;
  /** Accordion with the roles before the current ones; `{count}` is replaced. */
  earlierCareer: string;
  current: string;
  work: string;
  teaching: string;
  education: string;
  languages: string;
  characterSheet: string;
  available: string;
  contactMe: string;
  powerUpsTitle: string;
  caseLabels: { challenge: string; solution: string; result: string };
  projectCode: string;
  projectDemo: string;
  githubMore: string;
  datesTbc: string;
  release: { version: string; date: string };
  game: {
    start: string;
    restart: string;
    score: string;
    best: string;
    over: string;
    controls: string;
    touch: string;
  };
}

export interface SiteContent {
  locale: string;
  meta: { title: string; description: string };
  person: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    about: string[];
    /** Character-sheet rows shown in the hero, e.g. `[Class, Full-stack]`. */
    sheet: [string, string][];
    education: Education[];
    languages: SpokenLanguage[];
  };
  nav: NavItem[];
  ui: UiCopy;
  sections: Record<Exclude<SectionId, 'start'>, SectionCopy>;
  powerUps: PowerUp[];
  stats: Stat[];
  career: CareerStage[];
  cases: CaseStudy[];
  skills: SkillGroup[];
  projects: Project[];
  beyond: BeyondItem[];
  contacts: ContactLink[];
  cv: CvContent;
}

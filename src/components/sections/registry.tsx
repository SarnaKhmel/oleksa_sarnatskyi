import type { ComponentType } from 'react';
import type { SectionId, SiteContent } from '@/domain/content';
import type { Locale } from '@/i18n/locales';
import { BeyondSection } from './BeyondSection';
import { CasesSection } from './CasesSection';
import { ContactsSection } from './ContactsSection';
import { ExperienceSection } from './ExperienceSection';
import { GameSection } from './GameSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';

export interface SectionProps {
  content: SiteContent;
  locale: Locale;
}

interface SectionEntry {
  id: SectionId;
  Component: ComponentType<SectionProps>;
}

/**
 * Page order lives here. Adding, removing or reordering a section never
 * touches the page or the other sections (open/closed).
 */
export const SECTIONS: readonly SectionEntry[] = [
  { id: 'experience', Component: ExperienceSection },
  { id: 'cases', Component: CasesSection },
  { id: 'skills', Component: SkillsSection },
  { id: 'projects', Component: ProjectsSection },
  { id: 'beyond', Component: BeyondSection },
  { id: 'contacts', Component: ContactsSection },
  { id: 'game', Component: GameSection },
];

import type { ContactKind, ContactLink } from '@/domain/content';

/**
 * Locale-independent profile data — the single place to edit contacts and numbers.
 * Phone number is intentionally not published.
 */
export const PROFILE = {
  email: 'olsarnat@gmail.com',
  telegram: { handle: '@sarnakhmel', url: 'https://t.me/sarnakhmel' },
  linkedin: {
    handle: 'in/oleksa-sarnatskyi',
    url: 'https://www.linkedin.com/in/oleksa-sarnatskyi/',
  },
  github: { handle: 'SarnaKhmel', url: 'https://github.com/SarnaKhmel' },
} as const;

const CONTACT_HREFS: Record<ContactKind, { href: string; handle: string }> = {
  email: { href: `mailto:${PROFILE.email}`, handle: PROFILE.email },
  telegram: { href: PROFILE.telegram.url, handle: PROFILE.telegram.handle },
  linkedin: { href: PROFILE.linkedin.url, handle: PROFILE.linkedin.handle },
  github: { href: PROFILE.github.url, handle: PROFILE.github.handle },
};

const CONTACT_ORDER: ContactKind[] = ['email', 'telegram', 'linkedin', 'github'];

/** Localized contact list; contacts that are not configured yet are skipped. */
export function buildContacts(labels: Record<ContactKind, string>): ContactLink[] {
  return CONTACT_ORDER.filter((kind) => CONTACT_HREFS[kind].href).map((kind) => ({
    kind,
    label: labels[kind],
    ...CONTACT_HREFS[kind],
  }));
}

/** Numbers from the git-history analysis of Voopty, client-platform and voopty-agent. */
export const STATS = {
  experienceYears: 5,
  commits: 5500,
  teamShare: 53,
  testCases: 2700,
  backgroundJobs: 27,
  emailTemplates: 130,
} as const;

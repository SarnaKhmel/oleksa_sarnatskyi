import { PROFILE } from '@/content/profile';
import type { SiteContent } from '@/domain/content';

/** schema.org Person — helps search engines show a rich profile result. */
export function buildPersonJsonLd(content: SiteContent): string {
  const { person, skills } = content;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    email: `mailto:${PROFILE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kyiv', addressCountry: 'UA' },
    sameAs: [PROFILE.linkedin.url, PROFILE.github.url],
    knowsAbout: skills.flatMap((group) => group.items).slice(0, 30),
    alumniOf: person.education.map((item) => ({
      '@type': 'EducationalOrganization',
      name: item.school,
    })),
  };
  // Escape `<` so the JSON can never close the surrounding <script> tag.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

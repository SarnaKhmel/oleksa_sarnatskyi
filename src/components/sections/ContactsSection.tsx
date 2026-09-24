import { ContactButtons } from '@/components/contacts/ContactButtons';
import { CvDownloadLink } from '@/components/cv/CvDownloadLink';
import { Icon } from '@/components/pixel/Icon';
import { Section } from '@/components/ui/Section';
import type { SiteContent } from '@/domain/content';
import { LOCALES, type Locale } from '@/i18n/locales';

export function ContactsSection({ content, locale }: { content: SiteContent; locale: Locale }) {
  const { ui } = content;
  const otherLocale = LOCALES.find((item) => item !== locale) ?? locale;
  return (
    <Section id="contacts" copy={content.sections.contacts}>
      <ContactButtons contacts={content.contacts} ui={ui} wide />
      <div className="mt-10 flex flex-col gap-4 xs:flex-row xs:flex-wrap">
        <CvDownloadLink cvLocale={locale} className="w-full xs:w-auto">
          <Icon name="floppy" className="h-5 w-5" />
          {ui.downloadCv}
        </CvDownloadLink>
        <CvDownloadLink cvLocale={otherLocale} variant="secondary" size="md" className="w-full xs:w-auto">
          {ui.downloadCvOther}
        </CvDownloadLink>
      </div>
    </Section>
  );
}

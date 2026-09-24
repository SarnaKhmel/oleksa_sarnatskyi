import path from 'node:path';
import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { PROFILE } from '@/content/profile';
import type { CareerStage, SiteContent } from '@/domain/content';

const FONTS_DIR = path.join(process.cwd(), 'assets', 'fonts');

// PT Sans: a clean humanist sans with first-class Cyrillic — ATS- and print-friendly.
Font.register({
  family: 'PT Sans',
  fonts: [
    { src: path.join(FONTS_DIR, 'PT_Sans-Web-Regular.ttf') },
    { src: path.join(FONTS_DIR, 'PT_Sans-Web-Bold.ttf'), fontWeight: 'bold' },
    { src: path.join(FONTS_DIR, 'PT_Sans-Web-Italic.ttf'), fontStyle: 'italic' },
  ],
});
// Keep words whole — automatic hyphenation looks broken in a résumé.
Font.registerHyphenationCallback((word) => [word]);

const INK = '#1b2a1c';
const MUTED = '#556255';
const ACCENT = '#2d5a27';

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 34,
    paddingHorizontal: 42,
    fontFamily: 'PT Sans',
    fontSize: 9.3,
    lineHeight: 1.34,
    color: INK,
  },
  name: { fontSize: 22, lineHeight: 1.2, fontWeight: 'bold', letterSpacing: 0.5 },
  title: { marginTop: 4, fontSize: 12, lineHeight: 1.3, fontWeight: 'bold', color: ACCENT },
  contacts: { marginTop: 5, flexDirection: 'row', flexWrap: 'wrap', color: MUTED },
  contact: { marginRight: 12 },
  link: { color: MUTED, textDecoration: 'none' },
  rule: { marginTop: 9, height: 1.5, backgroundColor: ACCENT },
  section: { marginTop: 10 },
  heading: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: ACCENT,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  role: { fontWeight: 'bold', fontSize: 10.4 },
  period: { color: MUTED },
  org: { color: MUTED, fontStyle: 'italic', marginBottom: 2 },
  bullet: { flexDirection: 'row', marginBottom: 1.5 },
  bulletMark: { width: 10, color: ACCENT },
  bulletText: { flex: 1 },
  skillRow: { flexDirection: 'row', marginBottom: 1.5 },
  skillLabel: { width: 88, fontWeight: 'bold' },
  skillText: { flex: 1 },
  entry: { marginBottom: 5 },
  pageNumber: { position: 'absolute', bottom: 20, right: 42, fontSize: 8, color: MUTED },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bullet} wrap={false}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{pdfText(item)}</Text>
        </View>
      ))}
    </View>
  );
}

function Stage({ stage, points, tbc }: { stage: CareerStage; points: string[]; tbc: string }) {
  return (
    <View style={styles.entry}>
      {/* Never leave a job title orphaned at the bottom of a page. */}
      <View style={styles.row} wrap={false} minPresenceAhead={36}>
        <Text style={styles.role}>
          {pdfText(`${stage.role} — ${stage.org}`)}
        </Text>
        <Text style={styles.period}>{stage.period || tbc}</Text>
      </View>
      <Text style={styles.org}>{pdfText(stage.meta)}</Text>
      <Bullets items={points} />
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading} minPresenceAhead={40}>
        {title}
      </Text>
      {children}
    </View>
  );
}

/**
 * Makes text safe for PDF: PT Sans has no arrow glyph, and the "fi"/"fl"
 * ligatures lose their Unicode mapping, so ATS parsers would read "frst".
 * A zero-width non-joiner between the letters prevents the ligature.
 */
export function pdfText(text: string): string {
  return text
    .replace(/`/g, '')
    .replace(/\s*→\s*/g, ' -> ')
    .replace(/f(?=[ilf])/g, 'f\u200C');
}

const displayUrl = (href: string) => href.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** One-column, text-based résumé rendered from the same content as the site. */
export function CvDocument({ content }: { content: SiteContent }) {
  const { person, cv, career, contacts, ui } = content;
  const work = career.filter((stage) => stage.kind === 'work');
  const teaching = career.filter((stage) => stage.kind === 'teaching');

  return (
    <Document
      title={`${person.name} — CV`}
      author={person.name}
      subject={person.title}
      keywords={cv.skills.map(([, list]) => list).join(', ')}
      language={content.locale}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.title}>
          {person.title} · {person.tagline}
        </Text>
        <View style={styles.contacts}>
          <Text style={styles.contact}>{person.location}</Text>
          {contacts.map((contact) => (
            <Link key={contact.kind} src={contact.href} style={[styles.contact, styles.link]}>
              {contact.kind === 'email' ? PROFILE.email : displayUrl(contact.href)}
            </Link>
          ))}
        </View>
        <View style={styles.rule} />

        <Section title={cv.labels.summaryTitle}>
          <Text>{pdfText(cv.summary)}</Text>
        </Section>

        <Section title={cv.labels.skillsTitle}>
          {cv.skills.map(([label, list]) => (
            <View key={label} style={styles.skillRow} wrap={false}>
              <Text style={styles.skillLabel}>{label}</Text>
              <Text style={styles.skillText}>{pdfText(list)}</Text>
            </View>
          ))}
        </Section>

        <Section title={cv.labels.experienceTitle}>
          {work.map((stage) => (
            <Stage
              key={stage.id}
              stage={stage}
              points={stage.id === 'voopty' ? cv.bullets : stage.points}
              tbc={ui.datesTbc}
            />
          ))}
        </Section>

        <Section title={cv.labels.projectsTitle}>
          <Bullets items={cv.projects} />
        </Section>

        <Section title={cv.labels.teachingTitle}>
          {teaching.map((stage) => (
            <Stage key={stage.id} stage={stage} points={stage.points} tbc={ui.datesTbc} />
          ))}
        </Section>

        <Section title={cv.labels.educationTitle}>
          {person.education.map((item) => (
            <View key={item.school} style={styles.row} wrap={false}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{item.degree}</Text> — {item.school}
              </Text>
              <Text style={styles.period}>{item.period}</Text>
            </View>
          ))}
        </Section>

        <View style={[styles.section, styles.row]} wrap={false}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>{cv.labels.languagesTitle}</Text>
            <Text>{person.languages.map((language) => `${language.name} (${language.level})`).join(' · ')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>{cv.labels.volunteeringTitle}</Text>
            <Text>{pdfText(cv.volunteering)}</Text>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
}

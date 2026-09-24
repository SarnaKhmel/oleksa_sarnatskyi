'use client';

import { Icon } from '@/components/pixel/Icon';
import type { ContactKind, ContactLink, SpriteName } from '@/domain/content';
import { useSfx } from '@/providers/hooks';

const SPRITES: Record<ContactKind, SpriteName> = {
  email: 'mail',
  telegram: 'telegram',
  linkedin: 'linkedin',
  github: 'github',
};

/** Icon-only contact rail pinned to the left edge on wide screens. */
export function ContactRail({ contacts, label }: { contacts: ContactLink[]; label: string }) {
  const sfx = useSfx();
  return (
    <nav
      aria-label={label}
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 2xl:left-6 lg:flex"
    >
      {contacts.map((contact) => {
        const external = contact.kind !== 'email';
        return (
          <a
            key={contact.kind}
            href={contact.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={`${contact.label}: ${contact.handle}`}
            title={contact.handle}
            onClick={() => {
              sfx('confirm');
            }}
            className="group relative flex h-11 w-11 items-center justify-center bg-surface pixel-frame-flat transition-transform hover:translate-x-1"
          >
            <Icon name={SPRITES[contact.kind]} className="h-6 w-6" />
            <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap bg-surface px-2 py-1 font-mono text-xs pixel-frame-flat group-hover:block group-focus-visible:block">
              {contact.handle}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

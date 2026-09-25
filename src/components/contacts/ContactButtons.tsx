'use client';

import { Fragment, useState } from 'react';
import { Icon } from '@/components/pixel/Icon';
import type { ContactKind, ContactLink, SpriteName, UiCopy } from '@/domain/content';
import { useSfx } from '@/providers/hooks';

const CONTACT_SPRITES: Record<ContactKind, SpriteName> = {
  email: 'mail',
  telegram: 'telegram',
  linkedin: 'linkedin',
  github: 'github',
};

/** Static class names so Tailwind can see them. Four in a row only where the email fits unbroken. */
const WIDE_COLUMNS: Record<number, string> = { 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' };

/** Lets a long handle wrap only after "@" or ".", never in the middle of a word. */
function breakableHandle(handle: string) {
  return handle.split(/(?<=[@.])/).map((part, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      {part}
    </Fragment>
  ));
}

export function ContactButtons({
  contacts,
  ui,
  wide = false,
}: {
  contacts: ContactLink[];
  ui: Pick<UiCopy, 'copyEmail' | 'copied'>;
  /** Spread over four columns when the contacts own the full row. */
  wide?: boolean;
}) {
  const sfx = useSfx();
  const [copied, setCopied] = useState(false);
  const email = contacts.find((contact) => contact.kind === 'email');

  async function copyEmail() {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email.handle);
      setCopied(true);
      sfx('coin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = email.href;
    }
  }

  return (
    <div>
      <ul className={`grid gap-4 sm:grid-cols-2 ${wide ? WIDE_COLUMNS[contacts.length] ?? '' : ''}`}>
        {contacts.map((contact) => {
          const external = contact.kind !== 'email';
          return (
            <li key={contact.kind} className="min-w-0">
              <a
                href={contact.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  sfx('confirm');
                }}
                className="group flex h-full min-h-18 items-center gap-3 bg-surface p-4 pixel-frame-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
              >
                <Icon name={CONTACT_SPRITES[contact.kind]} className="h-8 w-8 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-pixel text-[10px] uppercase text-muted">
                    {contact.label}
                  </span>
                  <span className="mt-2 block break-words text-sm font-semibold group-hover:underline">
                    {breakableHandle(contact.handle)}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 font-pixel text-xs text-accent-2 dark:text-accent">
                  ▶
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      {email && (
        <button
          type="button"
          onClick={copyEmail}
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-pixel text-[10px] uppercase text-muted underline decoration-dotted underline-offset-4 hover:text-fg"
        >
          {copied ? ui.copied : ui.copyEmail}
          <span className="sr-only" aria-live="polite">
            {copied ? ui.copied : ''}
          </span>
        </button>
      )}
    </div>
  );
}

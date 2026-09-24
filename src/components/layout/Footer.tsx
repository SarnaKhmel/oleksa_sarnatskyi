import { APP_VERSION } from '@/config/site';
import type { SiteContent } from '@/domain/content';

export function Footer({ content }: { content: SiteContent }) {
  const { ui, person } = content;
  return (
    <footer className="border-t-4 border-line bg-bg-deep lg:pl-16 2xl:pl-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 pb-28 text-sm text-muted sm:px-6 md:flex-row md:items-center md:justify-between md:pb-10 lg:px-10">
        <p>
          © {new Date().getFullYear()} {person.name} · v{APP_VERSION}
        </p>
        <div className="flex flex-col gap-2 md:items-end">
          <p>{ui.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}

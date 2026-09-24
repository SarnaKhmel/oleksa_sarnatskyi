import { Icon } from '@/components/pixel/Icon';
import { PixelLink } from '@/components/ui/PixelButton';
import { Section } from '@/components/ui/Section';
import { PROFILE } from '@/content/profile';
import type { SiteContent } from '@/domain/content';

const repoUrl = (repo: string) => `${PROFILE.github.url}/${repo}`;

export function ProjectsSection({ content }: { content: SiteContent }) {
  const { ui } = content;
  return (
    <Section id="projects" copy={content.sections.projects}>
      <ul className="grid gap-8 md:grid-cols-2">
        {content.projects.map((project) => (
          <li key={project.id} className="flex flex-col bg-surface p-5 pixel-frame-sm" data-reveal>
            <div className="flex items-start gap-3">
              <Icon name={project.sprite} className="h-8 w-8 shrink-0" />
              <h3 className="font-pixel text-[11px] uppercase leading-relaxed">{project.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.map((tech) => (
                <li key={tech} className="bg-bg-deep px-1.5 py-0.5 font-mono text-[11px] text-fg">
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-sm">
              {project.privateNote && (
                <span className="inline-flex min-h-11 items-center gap-2 text-muted">
                  <span aria-hidden="true">🔒</span>
                  {project.privateNote}
                </span>
              )}
              {project.repos.map((repo) => (
                <a
                  key={repo}
                  href={repoUrl(repo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 underline decoration-dotted underline-offset-4 hover:text-accent-2 dark:hover:text-accent"
                >
                  <span aria-hidden="true">{'</>'}</span>
                  <span className="sr-only">{ui.projectCode}: </span>
                  {repo}
                </a>
              ))}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 font-semibold underline decoration-dotted underline-offset-4 hover:text-accent-2 dark:hover:text-accent"
                >
                  ▶ {ui.projectDemo}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <PixelLink
          href={PROFILE.github.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
        >
          <Icon name="github" className="h-5 w-5" />
          {ui.githubMore}
        </PixelLink>
      </div>
    </Section>
  );
}

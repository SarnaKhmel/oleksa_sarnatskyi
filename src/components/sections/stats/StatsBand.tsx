import type { Stat } from '@/domain/content';
import { CountUp } from './CountUp';

/** Compact score band under the power-ups — numbers without a section of their own. */
export function StatsBand({ stats, locale }: { stats: Stat[]; locale: string }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-10">
      <dl className="grid grid-cols-2 gap-px border-y-4 border-line bg-line sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.id} className="flex min-w-0 flex-col-reverse justify-end bg-bg-deep p-4 sm:p-5" data-reveal>
            <dt className="mt-2 text-xs leading-snug text-muted">{stat.label}</dt>
            <dd className="font-pixel text-lg text-accent-2 dark:text-accent sm:text-xl">
              <CountUp value={stat.value} locale={locale} />
              {stat.suffix && <span className="ml-0.5">{stat.suffix}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

import { cn } from '@/lib/utils';

/** 页面区块容器 */
export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn('mx-auto w-full max-w-6xl px-4 py-12 md:py-16', className)}>{children}</section>;
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
      {eyebrow && (
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-energy/30 bg-energy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-energy">
          <span className="inline-block h-2 w-2 rounded-full bg-energy animate-glow-pulse" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-electric to-cyan-light text-transparent bg-clip-text md:text-3xl dark:from-energy dark:to-cyan-light">{title}</h2>
      {desc && <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">{desc}</p>}
    </div>
  );
}

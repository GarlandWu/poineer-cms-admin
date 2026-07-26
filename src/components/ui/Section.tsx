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
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-energy">{eyebrow}</p>}
      <h2 className="text-2xl font-bold text-white md:text-3xl">{title}</h2>
      {desc && <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">{desc}</p>}
    </div>
  );
}

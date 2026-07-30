import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DemoCTA } from '@/components/CTAButtons';
import { getCaseStudies } from '@/lib/data';

export const metadata: Metadata = {
  title: '客户成功案例',
  description: '智慧园区、数据中心、高耗能工厂等行业标杆客户实测 ROI、节电率、数据采集延迟与数字孪生大屏成效。',
};

export default function CasesPage() {
  const cases = getCaseStudies();
  return (
    <Section>
      <SectionHeading eyebrow="Case Studies" title="客户成功案例" desc="真实项目、真实数据，见证能效数字孪生的落地价值。" />
      <div className="space-y-6">
        {cases.map((c) => (
          <article key={c.slug} className="glass-card glow-border grid gap-6 overflow-hidden md:grid-cols-2 card-gradient-cyber">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.twinScreenshot.replace(/\.svg$/, '-light.svg')} alt={`${c.clientName}数字孪生实景`} className="h-full min-h-[220px] w-full object-cover dark:hidden" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.twinScreenshot} alt={`${c.clientName}数字孪生实景`} className="hidden h-full min-h-[220px] w-full object-cover dark:block" loading="lazy" />
            <div className="p-6">
              <span className="text-xs font-medium text-electric-light">{c.industry}</span>
              <h2 className="mt-2 text-xl font-bold text-navy-deep dark:text-white">{c.clientName}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.summary}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {c.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-electric/20 dark:border-energy/30 bg-electric/8 dark:bg-energy/10 p-3 text-center">
                    <div className="text-lg font-bold text-glow-energy">{m.value}</div>
                    <div className="mt-1 text-[11px] leading-tight text-slate-700 dark:text-slate-400">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center"><DemoCTA /></div>
    </Section>
  );
}

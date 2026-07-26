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
          <article key={c.slug} className="grid gap-6 overflow-hidden rounded-2xl border border-white/10 bg-navy md:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.twinScreenshot} alt={`${c.clientName}数字孪生实景`} className="h-full min-h-[220px] w-full bg-navy-deep object-cover" loading="lazy" />
            <div className="p-6">
              <span className="text-xs font-medium text-electric-light">{c.industry}</span>
              <h2 className="mt-2 text-xl font-bold text-white">{c.clientName}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.summary}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {c.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-white/10 bg-navy-deep p-3 text-center">
                    <div className="text-lg font-bold text-energy">{m.value}</div>
                    <div className="mt-1 text-[11px] leading-tight text-slate-500">{m.label}</div>
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

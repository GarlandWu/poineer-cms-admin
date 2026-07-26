import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ProtocolTagList } from '@/components/ProtocolTag';
import { getSolutions } from '@/lib/data';

export const metadata: Metadata = {
  title: '数字孪生解决方案',
  description: '智慧园区零碳管理、数据中心 PUE 优化、高耗能工厂 3D 能效监测等行业级能源数字孪生解决方案。',
};

export default function SolutionsPage() {
  const solutions = getSolutions();
  return (
    <Section>
      <SectionHeading eyebrow="Solutions" title="数字孪生解决方案" desc="面向不同行业场景的能源采集与数字孪生方案，均支持全协议接入与 ROI 量化交付。" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => (
          <Link key={s.slug} href={`/solutions/${s.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
            <span className="text-xs font-medium text-electric-light">{s.industry}</span>
            <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-energy">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{s.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.twinCapabilities.slice(0, 3).map((c) => (
                <span key={c} className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">{c}</span>
              ))}
            </div>
            <div className="mt-4"><ProtocolTagList protocols={s.supportedProtocols.slice(0, 3)} /></div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
              查看方案 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

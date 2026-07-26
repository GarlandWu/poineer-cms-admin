import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getPartners } from '@/lib/data';

export const metadata: Metadata = {
  title: '合作伙伴',
  description: '携手云平台、配电设备与工业自动化领域领先厂商，共建能源数字孪生生态。',
};

export default function PartnersPage() {
  const partners = getPartners();
  return (
    <Section>
      <SectionHeading eyebrow="Partners" title="合作伙伴" desc="与云平台、静态托管、配电设备与工业自动化领先厂商共建能源数字化生态。" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {partners.map((p) => (
          <div key={p.name} className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-navy p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logo} alt={p.name} className="h-16 w-auto object-contain" loading="lazy" />
            <span className="mt-2 text-xs text-slate-500">{p.category}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

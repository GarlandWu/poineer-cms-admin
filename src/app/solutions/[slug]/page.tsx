import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { ProtocolTagList } from '@/components/ProtocolTag';
import { DemoForm } from '@/components/DemoForm';
import { DemoCTA } from '@/components/CTAButtons';
import { getSolution, getSolutions } from '@/lib/data';
import { SITE } from '@/lib/utils';

/** 静态路径预渲染 */
export function generateStaticParams() {
  return getSolutions().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSolution(params.slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.summary,
    openGraph: { title: s.title, description: s.summary, images: [s.architectureImage] },
    alternates: { canonical: `${SITE.url}/solutions/${s.slug}/` },
  };
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const s = getSolution(params.slug);
  if (!s) notFound();

  return (
    <>
      <section className="border-b border-white/10 bg-navy">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <span className="text-sm font-medium text-electric-light">{s.industry}</span>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-4xl">{s.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">{s.summary}</p>
          <div className="mt-6"><DemoCTA /></div>
        </div>
      </section>

      <Section className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          {/* 架构拓扑图 */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">架构拓扑</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.architectureImage} alt={`${s.title}架构拓扑图`} className="w-full rounded-2xl border border-white/10 bg-navy-deep" loading="lazy" />
          </div>

          {/* 正文 */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">方案说明</h2>
            <div className="richtext" dangerouslySetInnerHTML={{ __html: s.body }} />
          </div>

          {/* 数字孪生能力 */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">数字孪生功能</h2>
            <div className="flex flex-wrap gap-2">
              {s.twinCapabilities.map((c) => (
                <span key={c} className="rounded-lg border border-energy/30 bg-energy/10 px-3 py-1.5 text-sm text-energy">{c}</span>
              ))}
            </div>
          </div>

          {/* 支持协议 */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">支持采集协议</h2>
            <ProtocolTagList protocols={s.supportedProtocols} />
          </div>
        </div>

        {/* 侧栏：ROI + 预约表单 */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-navy p-6">
            <h3 className="text-sm font-semibold text-white">客户 ROI 量化</h3>
            <dl className="mt-4 space-y-4">
              {s.roi.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between border-b border-white/5 pb-3">
                  <dt className="text-sm text-slate-400">{r.label}</dt>
                  <dd className="text-xl font-bold text-energy">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div id="demo" className="rounded-2xl border border-white/10 bg-navy p-6">
            <h3 className="mb-4 text-sm font-semibold text-white">预约 3D 演示</h3>
            <DemoForm />
          </div>
        </aside>
      </Section>
    </>
  );
}

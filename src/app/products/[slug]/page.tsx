import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { ProtocolTagList } from '@/components/ProtocolTag';
import { PdfCTA, DemoCTA } from '@/components/CTAButtons';
import { getProduct, getProducts } from '@/lib/data';
import { SITE } from '@/lib/utils';

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.title}（${p.modelNumber}）`,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, images: [p.image] },
    alternates: { canonical: `${SITE.url}/products/${p.slug}/` },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  return (
    <Section className="grid gap-10 lg:grid-cols-2">
      {/* 产品图 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image.replace(/\.svg$/, '-light.svg')} alt={p.title} className="aspect-square w-full rounded-2xl border border-electric/20 dark:border-energy/30 dark:hidden object-contain" loading="lazy" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.image} alt={p.title} className="hidden aspect-square w-full rounded-2xl border border-electric/20 dark:border-energy/30 dark:block object-contain" loading="lazy" />

      {/* 概览 */}
      <div>
        <span className="text-sm font-medium text-electric-light">{p.category}</span>
        <h1 className="mt-2 text-2xl font-bold bg-gradient-to-r from-navy-deep to-electric text-transparent bg-clip-text dark:from-white dark:to-energy md:text-3xl">{p.title}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">型号 {p.modelNumber}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">{p.summary}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PdfCTA href={p.pdfSpecUrl} />
          <DemoCTA />
        </div>

        {/* 采集通道规格网格 */}
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-navy-deep dark:text-white">采集性能</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card glow-border p-4">
              <div className="text-xs text-slate-500">采集通道</div>
              <div className="mt-1 text-base font-semibold text-glow-energy">{p.samplingSpecs.channels}</div>
            </div>
            <div className="glass-card glow-border p-4">
              <div className="text-xs text-slate-500">上报频率</div>
              <div className="mt-1 text-base font-semibold text-glow-energy">{p.samplingSpecs.reportFrequency}</div>
            </div>
          </div>
        </div>

        {/* 工业协议列表 */}
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-bold text-navy-deep dark:text-white">支持工业协议</h2>
          <ProtocolTagList protocols={p.samplingSpecs.protocols} />
        </div>
      </div>

      {/* 详细规格表 */}
      <div className="lg:col-span-2">
        <h2 className="mb-4 text-lg font-bold text-navy-deep dark:text-white">详细规格参数</h2>
        <div className="overflow-hidden rounded-2xl border border-electric/20 dark:border-energy/30 bg-white dark:bg-navy">
          <table className="w-full text-sm">
            <tbody>
              {p.specifications.map((spec, i) => (
                <tr key={spec.key} className={`${i % 2 ? 'dark:bg-navy-800 bg-blue-50' : 'dark:bg-navy-700 bg-white'}`}>
                  <th scope="row" className="w-2/5 px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300">{spec.key}</th>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6"><PdfCTA href={p.pdfSpecUrl} /></div>
      </div>
    </Section>
  );
}

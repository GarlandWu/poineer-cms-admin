import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ProtocolTagList } from '@/components/ProtocolTag';
import { getProducts } from '@/lib/data';

export const metadata: Metadata = {
  title: '数据采集硬件中心',
  description: '边缘计算采集网关、多功能智能电表、串口服务器等工业级数据采集硬件，支持 Modbus、MQTT、OPC UA 全协议。',
};

export default function ProductsPage() {
  const products = getProducts();
  return (
    <Section>
      <SectionHeading eyebrow="Hardware" title="数据采集硬件中心" desc="工业级采集硬件，稳定可靠、全协议兼容，适配各类能源数字孪生场景。" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
            <span className="text-xs font-medium text-electric-light">{p.category}</span>
            <h2 className="mt-2 text-lg font-semibold text-white group-hover:text-energy">{p.title}</h2>
            <p className="mt-1 text-xs text-slate-500">型号 {p.modelNumber}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.summary}</p>
            <div className="mt-4"><ProtocolTagList protocols={p.samplingSpecs.protocols.slice(0, 3)} /></div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
              规格与选型 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

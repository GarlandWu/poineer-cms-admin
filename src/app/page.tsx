import Link from 'next/link';
import { ArrowRight, Cpu, Gauge, Boxes, Radio, ShieldCheck, TrendingUp, Zap, Leaf, Activity, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { DemoCTA, ZeroCarbonCTA } from '@/components/CTAButtons';
import { ProtocolTagList } from '@/components/ProtocolTag';
import { getSolutions, getProducts, getCaseStudies, getNews, getPartners, getHome } from '@/lib/data';
import { formatDate } from '@/lib/utils';

/** 能力卡图标 key → lucide 组件映射（内容来自 CMS，图标在此解析） */
const ICON_MAP: Record<string, LucideIcon> = {
  Cpu, Radio, Boxes, Gauge, TrendingUp, ShieldCheck, Zap, Leaf, Activity,
};

export default function HomePage() {
  const home = getHome();
  const solutions = getSolutions();
  const products = getProducts();
  const cases = getCaseStudies();
  const news = getNews().slice(0, 3);
  const partners = getPartners();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-navy-deep">
        <div className="tech-grid absolute inset-0 animate-pulse-grid" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-energy/30 bg-energy/10 px-3 py-1 text-xs font-medium text-energy">
            <Radio className="h-3.5 w-3.5" /> {home.hero.badge}
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">
            {home.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {home.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DemoCTA />
            <ZeroCarbonCTA />
          </div>
        </div>
      </section>

      {/* 核心能力 */}
      <Section>
        <SectionHeading eyebrow="Core Capabilities" title="从数据采集到数字孪生的全栈能力" desc="覆盖现场采集、边缘计算、协议归一到 3D 可视化的端到端能源数字化闭环。" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {home.capabilities.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? Cpu;
            return (
              <div key={c.title} className="rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-energy/40">
                <Icon className="h-8 w-8 text-energy" />
                <h3 className="mt-4 text-lg font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 解决方案 */}
      <Section className="border-t border-white/10">
        <SectionHeading eyebrow="Solutions" title="数字孪生解决方案" desc="面向智慧园区、数据中心与高耗能工厂的行业级能效数字孪生方案。" />
        <div className="grid gap-5 md:grid-cols-3">
          {solutions.map((s) => (
            <Link key={s.slug} href={`/solutions/${s.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
              <span className="text-xs font-medium text-electric-light">{s.industry}</span>
              <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-energy">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{s.summary}</p>
              <div className="mt-4"><ProtocolTagList protocols={s.supportedProtocols.slice(0, 3)} /></div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
                查看方案 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 硬件产品 */}
      <Section className="border-t border-white/10">
        <SectionHeading eyebrow="Hardware" title="数据采集硬件中心" desc="工业级边缘采集网关、智能电表与串口服务器，稳定可靠、全协议兼容。" />
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
              <span className="text-xs font-medium text-electric-light">{p.category}</span>
              <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-energy">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{p.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
                规格与选型 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 案例数据条 */}
      <Section className="border-t border-white/10">
        <SectionHeading eyebrow="Proven Results" title="客户实测成效" desc="真实项目量化数据，见证能效数字孪生的落地价值。" />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((c) => (
            <div key={c.slug} className="rounded-2xl border border-white/10 bg-navy p-6">
              <p className="text-sm font-medium text-white">{c.clientName}</p>
              <p className="mt-1 text-xs text-slate-500">{c.industry}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {c.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-lg font-bold text-energy">{m.value}</div>
                    <div className="mt-1 text-[11px] leading-tight text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/cases/" className="inline-flex items-center gap-1 text-sm font-medium text-electric-light hover:text-energy">
            查看全部案例 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* 新闻与技术干货 */}
      <Section className="border-t border-white/10">
        <SectionHeading eyebrow="Insights" title="新闻与技术干货" desc="能源政策解读、采集协议科普与数字孪生技术实践。" />
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((n) => (
            <Link key={n.slug} href={`/news/${n.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-md bg-white/5 px-2 py-1 text-electric-light">{n.category}</span>
                <time className="text-slate-500">{formatDate(n.publishedAt)}</time>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white group-hover:text-energy">{n.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{n.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
                阅读全文 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/news/" className="inline-flex items-center gap-1 text-sm font-medium text-electric-light hover:text-energy">
            查看全部干货 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* 合作伙伴 */}
      <Section className="border-t border-white/10">
        <SectionHeading eyebrow="Partners" title="合作伙伴" desc="携手云平台、配电设备与工业自动化领先厂商，共建能源数字孪生生态。" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center justify-center rounded-xl border border-white/10 bg-navy p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain" loading="lazy" />
            </div>
          ))}
        </div>
      </Section>

      {/* 底部 CTA */}
      <section className="border-t border-white/10 bg-navy">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">准备好开启能源数字化了吗？</h2>
          <p className="mt-3 text-sm text-slate-400 md:text-base">预约一场专属 3D 数字孪生大屏演示，我们的顾问将为您量身定制采集与降碳方案。</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <DemoCTA />
            <ZeroCarbonCTA />
          </div>
        </div>
      </section>
    </>
  );
}

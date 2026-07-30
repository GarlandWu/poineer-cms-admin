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
      <section className="relative overflow-hidden border-b border-electric/10 dark:border-energy/20 hero-bg">
        <div className="tech-grid absolute inset-0" aria-hidden />
        <div className="gradient-glow absolute inset-0" aria-hidden />
        <svg className="absolute inset-0 w-full h-full opacity-5 dark:opacity-10" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600" aria-hidden>
          <defs>
            <pattern id="topology-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="2" fill="currentColor" opacity="0.6"/>
              <line x1="60" y1="0" x2="60" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
              <line x1="0" y1="60" x2="120" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect fill="url(#topology-grid)" width="1200" height="600" opacity="0.08"/>
          <circle cx="200" cy="150" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
          <circle cx="1000" cy="450" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-energy/30 bg-energy/10 px-3 py-1 text-xs font-medium text-energy">
            <Radio className="h-3.5 w-3.5" /> {home.hero.badge}
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight bg-gradient-to-r from-navy-deep to-electric text-transparent bg-clip-text dark:from-white dark:to-energy md:text-5xl">
            {home.hero.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-slate-200 md:text-lg">
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
          {home.capabilities.map((c, idx) => {
            const Icon = ICON_MAP[c.icon] ?? Cpu;
            const gradients = ['card-gradient-energy', 'card-gradient-electric', 'card-gradient-cyber'];
            return (
              <div key={c.title} className={`glass-card glow-border p-6 group relative overflow-hidden ${gradients[idx % 3]}`}>
                <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-energy/20 to-energy/5">
                  <Icon className="h-8 w-8 text-energy group-hover:text-energy-light transition-colors" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy-deep dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 解决方案 */}
      <Section className="border-t border-black/10 dark:border-white/10">
        <SectionHeading eyebrow="Solutions" title="数字孪生解决方案" desc="面向智慧园区、数据中心与高耗能工厂的行业级能效数字孪生方案。" />
        <div className="grid gap-5 md:grid-cols-3">
          {solutions.map((s, idx) => (
            <Link key={s.slug} href={`/solutions/${s.slug}/`} className={`group glass-card glow-border p-6 flex flex-col relative overflow-hidden ${['card-gradient-energy', 'card-gradient-electric', 'card-gradient-cyber'][idx % 3]}`}>
              <span className="text-xs font-medium text-electric-light">{s.industry}</span>
              <h3 className="mt-2 text-lg font-semibold text-navy-deep dark:text-white group-hover:text-energy transition-colors">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{s.summary}</p>
              <div className="mt-4"><ProtocolTagList protocols={s.supportedProtocols.slice(0, 3)} /></div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-energy group-hover:translate-x-1 transition-all">
                查看方案 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 硬件产品 */}
      <Section className="border-t border-electric/10 dark:border-energy/20">
        <SectionHeading eyebrow="Hardware" title="数据采集硬件中心" desc="工业级边缘采集网关、智能电表与串口服务器，稳定可靠、全协议兼容。" />
        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p, idx) => (
            <Link key={p.slug} href={`/products/${p.slug}/`} className={`group glass-card glow-border p-6 flex flex-col relative overflow-hidden ${['card-gradient-cyber', 'card-gradient-energy', 'card-gradient-electric'][idx % 3]}`}>
              <span className="text-xs font-medium text-electric-light">{p.category}</span>
              <h3 className="mt-2 text-lg font-semibold text-navy-deep dark:text-white group-hover:text-energy transition-colors">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{p.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-energy group-hover:translate-x-1 transition-all">
                规格与选型 <ArrowRight className="h-4 w-4 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 案例数据条 */}
      <Section className="border-t border-electric/10 dark:border-energy/20">
        <SectionHeading eyebrow="Proven Results" title="客户实测成效" desc="真实项目量化数据，见证能效数字孪生的落地价值。" />
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((c, idx) => (
            <div key={c.slug} className={`glass-card glow-border p-6 relative overflow-hidden ${['card-gradient-electric', 'card-gradient-cyber', 'card-gradient-energy'][idx % 3]}`}>
              <p className="text-sm font-semibold text-navy-deep dark:text-white">{c.clientName}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{c.industry}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {c.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="text-lg font-bold text-glow-energy">{m.value}</div>
                    <div className="mt-1 text-[11px] leading-tight text-slate-600 dark:text-slate-400">{m.label}</div>
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
      <Section className="border-t border-electric/10 dark:border-energy/20">
        <SectionHeading eyebrow="Insights" title="新闻与技术干货" desc="能源政策解读、采集协议科普与数字孪生技术实践。" />
        <div className="grid gap-5 md:grid-cols-3">
          {news.map((n, idx) => (
            <Link key={n.slug} href={`/news/${n.slug}/`} className={`group glass-card glow-border p-6 flex flex-col relative overflow-hidden ${['card-gradient-energy', 'card-gradient-cyber', 'card-gradient-electric'][idx % 3]}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-md bg-electric/10 px-2 py-1 text-electric-light font-semibold">{n.category}</span>
                <time className="text-slate-600 dark:text-slate-400">{formatDate(n.publishedAt)}</time>
              </div>
              <h3 className="mt-3 text-base font-semibold text-navy-deep dark:text-white group-hover:text-energy transition-colors">{n.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{n.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-energy group-hover:translate-x-1 transition-all">
                阅读全文 <ArrowRight className="h-4 w-4 transition-transform" />
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
      <Section className="border-t border-electric/10 dark:border-energy/20">
        <SectionHeading eyebrow="Partners" title="合作伙伴" desc="携手云平台、配电设备与工业自动化领先厂商，共建能源数字孪生生态。" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <div key={p.name} className="glass-card glow-border p-4 flex items-center justify-center hover:scale-105 transition-transform card-gradient-cyber">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" loading="lazy" />
            </div>
          ))}
        </div>
      </Section>

      {/* 底部 CTA */}
      <section className="border-t border-electric/10 dark:border-energy/20  relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-50" aria-hidden />
        <div className="absolute inset-0 gradient-glow" aria-hidden />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center relative">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-navy-deep to-electric text-transparent bg-clip-text dark:from-white dark:to-energy md:text-3xl">准备好开启能源数字化了吗？</h2>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 md:text-base">预约一场专属 3D 数字孪生大屏演示，我们的顾问将为您量身定制采集与降碳方案。</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <DemoCTA />
            <ZeroCarbonCTA />
          </div>
        </div>
      </section>
    </>
  );
}

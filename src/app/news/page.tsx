import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { getNews } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: '新闻与技术干货',
  description: '能源管理政策解读、工业物联网 (AIoT) 采集协议深度科普、数字孪生技术干货。',
};

export default function NewsPage() {
  const news = getNews();
  return (
    <Section>
      <SectionHeading eyebrow="Insights" title="新闻与技术干货" desc="政策解读、协议科普与数字孪生技术实践分享。" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {news.map((n) => (
          <Link key={n.slug} href={`/news/${n.slug}/`} className="group flex flex-col rounded-2xl border border-white/10 bg-navy p-6 transition-colors hover:border-electric/50">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-md bg-white/5 px-2 py-1 text-electric-light">{n.category}</span>
              <time className="text-slate-500">{formatDate(n.publishedAt)}</time>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-energy">{n.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{n.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-energy">
              阅读全文 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

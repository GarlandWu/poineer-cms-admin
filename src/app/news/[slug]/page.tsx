import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { getNewsItem, getNews } from '@/lib/data';
import { formatDate, SITE } from '@/lib/utils';

export function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const n = getNewsItem(params.slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    openGraph: { type: 'article', title: n.title, description: n.excerpt, images: [n.cover], publishedTime: n.publishedAt },
    alternates: { canonical: `${SITE.url}/news/${n.slug}/` },
  };
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const n = getNewsItem(params.slug);
  if (!n) notFound();

  return (
    <Section className="max-w-3xl">
      <Link href="/news/" className="inline-flex items-center gap-1 text-sm text-electric-light hover:text-energy">
        <ArrowLeft className="h-4 w-4" /> 返回列表
      </Link>
      <div className="mt-4 flex items-center gap-3 text-xs">
        <span className="rounded-md bg-white/5 px-2 py-1 text-electric-light">{n.category}</span>
        <time className="text-slate-500">{formatDate(n.publishedAt)}</time>
      </div>
      <h1 className="mt-3 text-2xl font-bold leading-tight text-white md:text-4xl">{n.title}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={n.cover} alt={n.title} className="mt-6 aspect-video w-full rounded-2xl border border-white/10 bg-navy object-cover" loading="lazy" />
      <article className="richtext mt-8" dangerouslySetInnerHTML={{ __html: n.body }} />
    </Section>
  );
}

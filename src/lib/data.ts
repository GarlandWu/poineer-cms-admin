/**
 * 数据访问层 —— 编译期 (SSG) 直接读取本地静态 JSON。
 * 生产端组件禁止直接请求公网动态数据库；后续可替换为 Payload 本地导出 API。
 */
import solutions from '@/data/solutions.json';
import products from '@/data/products.json';
import cases from '@/data/cases.json';
import news from '@/data/news.json';
import partners from '@/data/partners.json';
import home from '@/data/home.json';
import type {
  SolutionItem,
  EnergyProductItem,
  EnergyCaseStudy,
  NewsItem,
  PartnerItem,
  HomeContent,
} from '@/types/schema';

export function getSolutions(): SolutionItem[] {
  return solutions as SolutionItem[];
}
export function getSolution(slug: string): SolutionItem | undefined {
  return getSolutions().find((s) => s.slug === slug);
}

export function getProducts(): EnergyProductItem[] {
  return products as EnergyProductItem[];
}
export function getProduct(slug: string): EnergyProductItem | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getCaseStudies(): EnergyCaseStudy[] {
  return cases as EnergyCaseStudy[];
}

export function getNews(): NewsItem[] {
  return (news as NewsItem[])
    .slice()
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}
export function getNewsItem(slug: string): NewsItem | undefined {
  return getNews().find((n) => n.slug === slug);
}

export function getPartners(): PartnerItem[] {
  return partners as PartnerItem[];
}

export function getHome(): HomeContent {
  return home as HomeContent;
}

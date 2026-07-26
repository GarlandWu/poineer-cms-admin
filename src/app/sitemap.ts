import type { MetadataRoute } from 'next';
import { getSolutions, getProducts, getNews } from '@/lib/data';
import { SITE } from '@/lib/utils';

/** 构建期自动生成 out/sitemap.xml */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/solutions', '/products', '/cases', '/news', '/partners', '/contact'].map((r) => ({
    url: `${SITE.url}${r}/`,
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.8,
  }));

  const solutionRoutes = getSolutions().map((s) => ({ url: `${SITE.url}/solutions/${s.slug}/`, priority: 0.7 }));
  const productRoutes = getProducts().map((p) => ({ url: `${SITE.url}/products/${p.slug}/`, priority: 0.7 }));
  const newsRoutes = getNews().map((n) => ({ url: `${SITE.url}/news/${n.slug}/`, priority: 0.6 }));

  return [...staticRoutes, ...solutionRoutes, ...productRoutes, ...newsRoutes];
}

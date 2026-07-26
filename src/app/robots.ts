import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/utils';

/** 构建期自动生成 out/robots.txt */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

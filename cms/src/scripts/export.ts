/**
 * 构建期数据桥：读取 Payload 本地库，导出为主站 SSG 所需的静态 JSON。
 * 运行：npm run export  (会写入 ../src/data/*.json)
 */
import { getPayload } from 'payload';
import config from '@payload-config';
import { convertLexicalToHTML, defaultHTMLConverters } from '@payloadcms/richtext-lexical';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.EXPORT_DIR
  ? path.resolve(dirname, '../..', process.env.EXPORT_DIR)
  : path.resolve(dirname, '../../../src/data');

const unwrap = (arr: any[]) => (arr ?? []).map((x) => x.value);
/** lexical 富文本 → HTML 字符串（前端 dangerouslySetInnerHTML 渲染） */
const richToHtml = async (data: any): Promise<string> =>
  data?.root ? convertLexicalToHTML({ data, converters: defaultHTMLConverters }) : '';

async function exportData() {
  const payload = await getPayload({ config });
  // 按创建顺序导出，保证输出稳定、可复现
  const all = async (collection: any) => (await payload.find({ collection, limit: 1000, depth: 0, sort: 'createdAt' })).docs;

  const solutions = await Promise.all((await all('solutions')).map(async (s: any) => ({
    slug: s.slug, title: s.title, industry: s.industry, summary: s.summary,
    twinCapabilities: unwrap(s.twinCapabilities), supportedProtocols: s.supportedProtocols ?? [],
    architectureImage: s.architectureImage, roi: (s.roi ?? []).map((r: any) => ({ label: r.label, value: r.value })),
    body: await richToHtml(s.body),
  })));

  const products = (await all('products')).map((p: any) => ({
    slug: p.slug, modelNumber: p.modelNumber, category: p.category, title: p.title, summary: p.summary,
    samplingSpecs: { channels: p.samplingSpecs?.channels, reportFrequency: p.samplingSpecs?.reportFrequency, protocols: p.samplingSpecs?.protocols ?? [] },
    specifications: (p.specifications ?? []).map((x: any) => ({ key: x.key, value: x.value })),
    image: p.image, pdfSpecUrl: p.pdfSpecUrl,
  }));

  const cases = (await all('case-studies')).map((c: any) => ({
    slug: c.slug, clientName: c.clientName, industry: c.industry, summary: c.summary,
    metrics: (c.metrics ?? []).map((m: any) => ({ label: m.label, value: m.value })), twinScreenshot: c.twinScreenshot,
  }));

  const news = await Promise.all((await all('news')).map(async (n: any) => ({
    slug: n.slug, title: n.title, category: n.category,
    publishedAt: String(n.publishedAt).slice(0, 10), excerpt: n.excerpt, cover: n.cover, body: await richToHtml(n.body),
  })));

  const partners = (await all('partners'))
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((p: any) => ({ name: p.name, logo: p.logo, category: p.category }));

  // 全局站点设置
  const s = (await payload.findGlobal({ slug: 'site-settings' })) as any;
  const site = {
    name: s.name, shortName: s.shortName, url: s.url, description: s.description,
    phone: s.phone, wechat: s.wechat, email: s.email, icp: s.icp, address: s.address,
    workingHours: s.workingHours, contactIntro: s.contactIntro,
    nav: (s.nav ?? []).map((n: any) => ({ label: n.label, href: n.href })),
    demoScenes: (s.demoScenes ?? []).map((d: any) => d.value),
    map: { lng: s.map?.lng, lat: s.map?.lat, coordType: s.map?.coordType ?? 'gcj02' },
  };

  // 首页内容
  const h = (await payload.findGlobal({ slug: 'homepage' })) as any;
  const home = {
    hero: { badge: h.hero?.badge, title: h.hero?.title, subtitle: h.hero?.subtitle },
    capabilities: (h.capabilities ?? []).map((c: any) => ({ icon: c.icon, title: c.title, desc: c.desc })),
  };

  const write = (f: string, data: unknown, count?: number) => {
    writeFileSync(path.join(OUT, f), JSON.stringify(data, null, 2) + '\n', 'utf8');
    payload.logger.info(`✓ 导出 ${f}${count !== undefined ? ` (${count} 条)` : ''}`);
  };
  write('solutions.json', solutions, solutions.length);
  write('products.json', products, products.length);
  write('cases.json', cases, cases.length);
  write('news.json', news, news.length);
  write('partners.json', partners, partners.length);
  write('site.json', site);
  write('home.json', home);

  payload.logger.info(`✓ 数据已导出至 ${OUT}`);
}

try {
  await exportData();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}

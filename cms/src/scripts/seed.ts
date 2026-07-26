/**
 * 初始化后台：创建管理员 + 从主站现有 JSON 导入内容。
 * 运行：npm run seed
 */
import { getPayload } from 'payload';
import config from '@payload-config';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.resolve(dirname, '../../../src/data');
const read = (f: string) => JSON.parse(readFileSync(path.join(DATA, f), 'utf8'));
const wrap = (arr: string[]) => (arr ?? []).map((value) => ({ value }));

/** 把段落文本 / 已导出的 HTML 转成 lexical 富文本初始状态（用于 richText 字段导入） */
const para = (text: string) => ({
  type: 'paragraph', direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
  children: text ? [{ type: 'text', detail: 0, format: 0, mode: 'normal' as const, style: '', text, version: 1 }] : [],
});
const toLexical = (body: unknown) => {
  const texts: string[] = Array.isArray(body)
    ? (body as string[])
    : String(body ?? '')
        .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);
  const children = texts.map(para);
  return { root: { type: 'root', direction: 'ltr' as const, format: '' as const, indent: 0, version: 1, children: children.length ? children : [para('')] } };
};

const ADMIN_EMAIL = 'admin@energy-portal.com';
const ADMIN_PASSWORD = 'Energy@2026';

async function seed() {
  const payload = await getPayload({ config });

  // 1. 管理员
  const existing = await payload.find({ collection: 'users', limit: 1 });
  if (existing.totalDocs === 0) {
    await payload.create({ collection: 'users', data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: '系统管理员' } });
    payload.logger.info(`✓ 管理员已创建：${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  // 1b. 全局站点设置
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: '能源数据采集与数字孪生系统',
      shortName: '能源数字孪生',
      url: 'https://www.your-energy-portal.com',
      description: '专注水/电/气/冷/热能源数据采集与工业级数字孪生解决方案，支持 Modbus、MQTT、OPC UA 等全协议采集，提供边缘计算网关、能效数字孪生大屏与负荷预测算法。',
      phone: '400-888-0000',
      wechat: 'energy-twin-service',
      email: 'sales@your-energy-portal.com',
      icp: '沪 ICP 备 000000 号',
      address: '上海市浦东新区能源科技园 A 座 12F',
      workingHours: '周一至周五 9:00–18:00',
      contactIntro: '无论您想预约一场 3D 数字孪生大屏演示，还是需要采集硬件选型咨询，我们的能效顾问团队都乐意为您服务。',
      nav: [
        { label: '首页', href: '/' },
        { label: '解决方案', href: '/solutions/' },
        { label: '硬件产品', href: '/products/' },
        { label: '客户案例', href: '/cases/' },
        { label: '新闻干货', href: '/news/' },
        { label: '合作伙伴', href: '/partners/' },
        { label: '联系我们', href: '/contact/' },
      ],
      demoScenes: [
        { value: '智慧园区零碳管理' },
        { value: '数据中心 PUE 优化' },
        { value: '高耗能工厂能效监测' },
        { value: '其他' },
      ],
      map: { lng: 121.5447, lat: 31.2216, coordType: 'gcj02' },
    },
  });
  payload.logger.info('✓ 站点设置已初始化');

  // 1c. 首页内容
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        badge: '毫秒级采集 · 全协议接入 · 数字孪生大屏',
        title: '水电气冷热全量能源采集与工业级数字孪生系统',
        subtitle: '通过边缘计算采集网关实现 Modbus、MQTT、OPC UA 全协议毫秒级采集，构建 3D 能效数字孪生大屏、动态能耗热力图与负荷预测算法，助力企业降本降碳。',
      },
      capabilities: [
        { icon: 'Cpu', title: '边缘计算采集', desc: '边缘网关多协议并发接入，毫秒级采集、断网续传与本地算法拓扑预处理。' },
        { icon: 'Radio', title: '全协议归一', desc: '兼容 Modbus-RTU/TCP、MQTT、OPC UA、BACnet、IEC 104，统一上报云端与孪生平台。' },
        { icon: 'Boxes', title: '3D 数字孪生', desc: '3D 管道拓扑重构与能效数字孪生大屏，一屏总览全域能流与设备状态。' },
        { icon: 'Gauge', title: '动态能耗热力图', desc: '实时能耗热力图叠加设备模型，秒级定位高耗能工序与能耗黑洞。' },
        { icon: 'TrendingUp', title: '负荷预测算法', desc: '结合历史曲线与气象数据预测负荷，削峰填谷，优化储能与柔性负荷调度。' },
        { icon: 'ShieldCheck', title: '零碳与合规', desc: '碳排放实时核算，满足重点用能单位能耗在线监测合规要求。' },
      ],
    },
  });
  payload.logger.info('✓ 首页内容已初始化');

  // 2. 解决方案
  for (const s of read('solutions.json')) {
    await payload.create({
      collection: 'solutions',
      data: {
        title: s.title, slug: s.slug, industry: s.industry, summary: s.summary,
        twinCapabilities: wrap(s.twinCapabilities), supportedProtocols: s.supportedProtocols,
        architectureImage: s.architectureImage, roi: s.roi, body: toLexical(s.body) as any,
      },
    });
  }

  // 3. 硬件产品
  for (const p of read('products.json')) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.title, slug: p.slug, modelNumber: p.modelNumber, category: p.category, summary: p.summary,
        samplingSpecs: p.samplingSpecs, specifications: p.specifications, image: p.image, pdfSpecUrl: p.pdfSpecUrl,
      },
    });
  }

  // 4. 客户案例
  for (const c of read('cases.json')) {
    await payload.create({
      collection: 'case-studies',
      data: { clientName: c.clientName, slug: c.slug, industry: c.industry, summary: c.summary, metrics: c.metrics, twinScreenshot: c.twinScreenshot },
    });
  }

  // 5. 新闻
  for (const n of read('news.json')) {
    await payload.create({
      collection: 'news',
      data: { title: n.title, slug: n.slug, category: n.category, publishedAt: n.publishedAt, excerpt: n.excerpt, cover: n.cover, body: toLexical(n.body) as any },
    });
  }

  // 6. 合作伙伴
  for (const p of read('partners.json')) {
    await payload.create({
      collection: 'partners',
      data: { name: p.name, category: p.category, logo: p.logo, order: p.order ?? 0 },
    });
  }

  payload.logger.info('✓ 内容导入完成');
}

try {
  await seed();
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}

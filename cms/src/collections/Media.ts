import type { CollectionConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// 上传目标：主站 public/uploads —— 构建期随 SSG 一并打包，线上以 /uploads/<文件名> 访问
const staticDir = path.resolve(dirname, '../../../public/uploads');

// MIME → 扩展名，用于给缺后缀的上传文件自动补全
const MIME_EXT: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
};

/**
 * 媒体资源库（图片 / PDF 选型手册）。
 * 上传后在各内容集合的路径字段里填 `/uploads/<文件名>` 即可引用；
 * 与预置的 /images/... 路径体系完全一致，主站运行时只读静态文件。
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '媒体资源', plural: '媒体资源库' },
  admin: { useAsTitle: 'filename', description: '上传图片或 PDF；引用路径为 /uploads/<文件名>' },
  hooks: {
    // 上传文件名规范化：空格转连字符、转小写、去非法字符；缺扩展名则按 MIME 补全
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === 'create' || operation === 'update') && req.file) {
          const original = req.file.name ?? 'file';
          const hasExt = /\.[a-z0-9]{2,5}$/i.test(original);
          const dot = original.lastIndexOf('.');
          let base = hasExt ? original.slice(0, dot) : original;
          const ext = (hasExt ? original.slice(dot) : MIME_EXT[req.file.mimetype] || '').toLowerCase();

          base = base
            .toLowerCase()
            .normalize('NFKD')
            .replace(/\s+/g, '-') // 空格 → 连字符
            .replace(/[^a-z0-9一-龥_-]+/g, '-') // 其余非法字符 → 连字符（保留中文）
            .replace(/-+/g, '-') // 合并连续连字符
            .replace(/^-+|-+$/g, ''); // 去首尾连字符

          req.file.name = `${base || 'file'}${ext}`;
        }
      },
    ],
  },
  upload: {
    staticDir,
    // 生产端路径前缀，与 staticDir 落盘位置对应
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 960, height: 540, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: '替代文本 (alt)', admin: { description: '用于无障碍与 SEO' } },
    {
      // 主站静态引用路径（只读）：把它复制到解决方案/产品/新闻等的图片或 PDF 字段
      name: 'publicPath',
      type: 'text',
      virtual: true,
      label: '主站引用路径',
      admin: { readOnly: true, description: '复制此路径填入内容的图片/PDF 字段' },
      hooks: {
        afterRead: [({ data }) => (data?.filename ? `/uploads/${data.filename}` : null)],
      },
    },
  ],
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import site from '@/data/site.json';

/** Tailwind class 合并工具 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 全站信息来自 CMS 全局设置（src/data/site.json，由 cms 的 npm run export 生成）。
 * 少数字段允许环境变量覆盖，便于多环境部署。
 */
export const SITE = {
  ...site,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? site.url,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? site.phone,
  wechat: process.env.NEXT_PUBLIC_CONTACT_WECHAT ?? site.wechat,
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

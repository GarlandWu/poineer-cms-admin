import type { CollectionConfig } from 'payload';

/** 后台管理员账号 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '管理员', plural: '管理员' },
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [{ name: 'name', type: 'text', label: '姓名' }],
};

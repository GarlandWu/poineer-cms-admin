import type { CollectionConfig } from 'payload';
import { syncMediaPaths } from '../hooks/syncMediaPaths';

/** 合作伙伴 —— 对应主站 PartnerItem */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: '合作伙伴', plural: '合作伙伴' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category'] },
  hooks: { beforeChange: [syncMediaPaths([['logoPick', 'logo']])] },
  fields: [
    { name: 'name', type: 'text', required: true, label: '名称' },
    { name: 'category', type: 'text', required: true, label: '分类' },
    { name: 'logo', type: 'text', label: 'Logo 路径', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'logoPick', type: 'upload', relationTo: 'media', label: '从媒体库选择', admin: { description: '选中后自动写入上方路径字段' } },
    { name: 'order', type: 'number', label: '排序', defaultValue: 0, admin: { description: '数字越小越靠前' } },
  ],
};

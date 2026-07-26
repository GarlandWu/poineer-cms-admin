import type { CollectionConfig } from 'payload';
import { syncMediaPaths } from '../hooks/syncMediaPaths';

/** 客户成功案例 —— 对应主站 EnergyCaseStudy */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: '客户案例', plural: '客户案例' },
  admin: { useAsTitle: 'clientName', defaultColumns: ['clientName', 'industry', 'slug'] },
  hooks: { beforeChange: [syncMediaPaths([['twinScreenshotPick', 'twinScreenshot']])] },
  fields: [
    { name: 'clientName', type: 'text', required: true, label: '客户名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL 标识' },
    { name: 'industry', type: 'text', required: true, label: '行业分类' },
    { name: 'summary', type: 'textarea', required: true, label: '案例概述' },
    {
      name: 'metrics',
      type: 'array',
      label: '核心量化指标',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'twinScreenshot', type: 'text', label: '数字孪生实景截图路径', defaultValue: '/images/cases/placeholder.svg', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'twinScreenshotPick', type: 'upload', relationTo: 'media', label: '从媒体库选择', admin: { description: '选中后自动写入上方路径字段' } },
  ],
};

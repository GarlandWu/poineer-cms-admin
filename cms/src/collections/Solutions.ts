import type { CollectionConfig } from 'payload';
import { syncMediaPaths } from '../hooks/syncMediaPaths';

const PROTOCOLS = ['Modbus-RTU', 'Modbus-TCP', 'MQTT', 'OPC UA', 'BACnet', 'IEC 60870-5-104'];

/** 解决方案 —— 对应主站 SolutionItem */
export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: { singular: '解决方案', plural: '解决方案' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'industry', 'slug'] },
  hooks: { beforeChange: [syncMediaPaths([['architectureImagePick', 'architectureImage']])] },
  fields: [
    { name: 'title', type: 'text', required: true, label: '方案名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL 标识', admin: { description: '唯一，用于 /solutions/[slug]' } },
    { name: 'industry', type: 'text', required: true, label: '行业分类' },
    { name: 'summary', type: 'textarea', required: true, label: '一句话概述' },
    {
      name: 'twinCapabilities',
      type: 'array',
      label: '数字孪生功能',
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'supportedProtocols',
      type: 'select',
      hasMany: true,
      label: '支持采集协议',
      options: PROTOCOLS.map((p) => ({ label: p, value: p })),
    },
    { name: 'architectureImage', type: 'text', label: '架构拓扑图路径', defaultValue: '/images/arch/placeholder.svg', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'architectureImagePick', type: 'upload', relationTo: 'media', label: '从媒体库选择', admin: { description: '选中后自动写入上方路径字段' } },
    {
      name: 'roi',
      type: 'array',
      label: '客户 ROI 量化',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'body', type: 'richText', label: '正文', admin: { description: '富文本：支持加粗/斜体、标题、有序与无序列表、链接等' } },
  ],
};

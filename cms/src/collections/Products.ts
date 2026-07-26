import type { CollectionConfig } from 'payload';
import { syncMediaPaths } from '../hooks/syncMediaPaths';

const PROTOCOLS = ['Modbus-RTU', 'Modbus-TCP', 'MQTT', 'OPC UA', 'BACnet', 'IEC 60870-5-104'];

/** 硬件产品 —— 对应主站 EnergyProductItem */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '硬件产品', plural: '硬件产品' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'modelNumber', 'category'] },
  hooks: { beforeChange: [syncMediaPaths([['imagePick', 'image'], ['pdfSpecUrlPick', 'pdfSpecUrl']])] },
  fields: [
    { name: 'title', type: 'text', required: true, label: '产品名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL 标识' },
    { name: 'modelNumber', type: 'text', required: true, label: '产品型号' },
    { name: 'category', type: 'text', required: true, label: '分类' },
    { name: 'summary', type: 'textarea', required: true, label: '概述' },
    {
      name: 'samplingSpecs',
      type: 'group',
      label: '采集性能',
      fields: [
        { name: 'channels', type: 'text', required: true, label: '采集通道' },
        { name: 'reportFrequency', type: 'text', required: true, label: '上报频率' },
        {
          name: 'protocols',
          type: 'select',
          hasMany: true,
          label: '支持协议',
          options: PROTOCOLS.map((p) => ({ label: p, value: p })),
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      label: '详细规格表',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'image', type: 'text', label: '产品图路径', defaultValue: '/images/products/placeholder.svg', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'imagePick', type: 'upload', relationTo: 'media', label: '从媒体库选择', admin: { description: '选中后自动写入上方路径字段' } },
    { name: 'pdfSpecUrl', type: 'text', label: '选型手册 PDF 路径', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'pdfSpecUrlPick', type: 'upload', relationTo: 'media', label: '从媒体库选择 PDF', admin: { description: '选中后自动写入上方路径字段' } },
  ],
};

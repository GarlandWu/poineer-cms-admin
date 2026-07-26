import type { CollectionConfig } from 'payload';
import { syncMediaPaths } from '../hooks/syncMediaPaths';

/** 新闻与技术干货 —— 对应主站 NewsItem */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: '新闻', plural: '新闻与干货' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt'] },
  hooks: { beforeChange: [syncMediaPaths([['coverPick', 'cover']])] },
  fields: [
    { name: 'title', type: 'text', required: true, label: '标题' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL 标识' },
    { name: 'category', type: 'text', required: true, label: '分类' },
    { name: 'publishedAt', type: 'date', required: true, label: '发布日期' },
    { name: 'excerpt', type: 'textarea', required: true, label: '摘要' },
    { name: 'cover', type: 'text', label: '封面图路径', defaultValue: '/images/news/placeholder.svg', admin: { description: '手动填写，或用下方选择器从媒体库选取自动填充', components: { Field: '/components/MediaPathField#MediaPathField' } } },
    { name: 'coverPick', type: 'upload', relationTo: 'media', label: '从媒体库选择', admin: { description: '选中后自动写入上方路径字段' } },
    { name: 'body', type: 'richText', label: '正文', admin: { description: '富文本：支持加粗/斜体、标题、有序与无序列表、链接等' } },
  ],
};

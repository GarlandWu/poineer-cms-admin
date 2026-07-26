import type { GlobalConfig } from 'payload';

/** 可选图标（对应主站 lucide-react 图标，前端做 key→组件映射） */
const ICONS = ['Cpu', 'Radio', 'Boxes', 'Gauge', 'TrendingUp', 'ShieldCheck', 'Zap', 'Leaf', 'Activity'];

/** 首页内容 —— Hero 文案与核心能力，导出为主站 src/data/home.json */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: '首页内容',
  admin: { description: '首页 Hero 与核心能力；修改后需 npm run export 再构建方可生效' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero 区',
      fields: [
        { name: 'badge', type: 'text', required: true, label: '徽标文案', admin: { description: '顶部小标签，如「毫秒级采集 · 全协议接入 · 数字孪生大屏」' } },
        { name: 'title', type: 'text', required: true, label: '主标题' },
        { name: 'subtitle', type: 'textarea', required: true, label: '副标题' },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      label: '核心能力',
      minRows: 1,
      admin: { description: '首页「核心能力」卡片，建议 6 张' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: '图标',
          defaultValue: 'Cpu',
          options: ICONS.map((i) => ({ label: i, value: i })),
        },
        { name: 'title', type: 'text', required: true, label: '标题' },
        { name: 'desc', type: 'textarea', required: true, label: '描述' },
      ],
    },
  ],
};

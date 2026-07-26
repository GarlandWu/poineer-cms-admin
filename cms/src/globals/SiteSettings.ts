import type { GlobalConfig } from 'payload';

/** 全局站点设置 —— 联系方式、地图坐标、SEO 描述等，导出为主站 src/data/site.json */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '站点设置',
  admin: { description: '全站通用信息；修改后需 npm run export 再构建方可生效' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, label: '站点全称', admin: { width: '50%' } },
        { name: 'shortName', type: 'text', required: true, label: '站点简称', admin: { width: '50%' } },
      ],
    },
    { name: 'url', type: 'text', required: true, label: '站点域名', admin: { description: '如 https://www.example.com（可被环境变量 NEXT_PUBLIC_SITE_URL 覆盖）' } },
    { name: 'description', type: 'textarea', required: true, label: 'SEO 描述' },
    {
      type: 'collapsible',
      label: '联系方式',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', required: true, label: '销售热线', admin: { width: '50%' } },
            { name: 'wechat', type: 'text', required: true, label: '微信客服', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'text', required: true, label: '商务邮箱', admin: { width: '50%' } },
            { name: 'icp', type: 'text', label: 'ICP 备案号', admin: { width: '50%' } },
          ],
        },
        { name: 'address', type: 'text', required: true, label: '办公地址' },
        { name: 'workingHours', type: 'text', required: true, label: '工作时间', admin: { description: '如「周一至周五 9:00–18:00」' } },
        { name: 'contactIntro', type: 'textarea', label: '联系页介绍语', admin: { description: '联系我们页面标题下方的一段话' } },
      ],
    },
    {
      name: 'nav',
      type: 'array',
      label: '顶部导航菜单',
      admin: { description: '菜单项与顺序；href 以 / 开头' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, label: '名称', admin: { width: '50%' } },
            { name: 'href', type: 'text', required: true, label: '链接', admin: { width: '50%', description: '如 / 或 /solutions/' } },
          ],
        },
      ],
    },
    {
      name: 'demoScenes',
      type: 'array',
      label: '预约表单-应用场景选项',
      admin: { description: '「预约 3D 演示」表单的场景下拉选项' },
      fields: [{ name: 'value', type: 'text', required: true, label: '场景' }],
    },
    {
      name: 'map',
      type: 'group',
      label: '地图坐标',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'lng', type: 'number', required: true, label: '经度', admin: { width: '33%' } },
            { name: 'lat', type: 'number', required: true, label: '纬度', admin: { width: '33%' } },
            {
              name: 'coordType',
              type: 'select',
              required: true,
              defaultValue: 'gcj02',
              label: '坐标系',
              admin: { width: '34%' },
              options: [
                { label: 'gcj02（高德/腾讯系）', value: 'gcj02' },
                { label: 'bd09ll（百度拾取器）', value: 'bd09ll' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

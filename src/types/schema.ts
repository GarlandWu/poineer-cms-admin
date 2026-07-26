/**
 * 核心数据模型契约 (Data Models)
 * 所有页面与组件必须严格使用以下接口，禁止 any。
 */

/** 工业采集协议枚举 */
export type Protocol =
  | 'Modbus-RTU'
  | 'Modbus-TCP'
  | 'MQTT'
  | 'OPC UA'
  | 'BACnet'
  | 'IEC 60870-5-104';

/** A. 解决方案 —— 数字孪生场景方案 */
export interface SolutionItem {
  slug: string;
  title: string;
  /** 行业分类，如 智慧园区 / 数据中心 / 高耗能工厂 */
  industry: string;
  /** 一句话概述，用于卡片与 SEO description */
  summary: string;
  /** 数字孪生功能列表，如 3D 管道拓扑重构、实时能耗热力图 */
  twinCapabilities: string[];
  /** 支持的工业采集协议 */
  supportedProtocols: Protocol[];
  /** 架构拓扑图路径 (public 下) */
  architectureImage: string;
  /** 客户 ROI 量化数据 */
  roi: {
    label: string;
    value: string;
  }[];
  /** 详情正文（富文本导出的 HTML 字符串） */
  body: string;
}

/** B. 硬件网关与设备 */
export interface EnergyProductItem {
  slug: string;
  modelNumber: string;
  /** 分类，如 边缘采集网关 / 智能电表 / 串口服务器 */
  category: string;
  title: string;
  summary: string;
  /** 采集性能参数 */
  samplingSpecs: {
    channels: string;
    reportFrequency: string;
    protocols: Protocol[];
  };
  /** KV 详细规格表 */
  specifications: { key: string; value: string }[];
  /** 产品图 */
  image: string;
  /** 选型手册 PDF 下载地址 */
  pdfSpecUrl: string;
}

/** C. 客户成功案例 */
export interface EnergyCaseStudy {
  slug: string;
  clientName: string;
  industry: string;
  summary: string;
  /** 核心量化指标 */
  metrics: { label: string; value: string }[];
  /** 现场 3D 数字孪生实景截图 */
  twinScreenshot: string;
}

/** 新闻与技术干货 */
export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  /** ISO 日期 */
  publishedAt: string;
  excerpt: string;
  cover: string;
  /** 正文（富文本导出的 HTML 字符串） */
  body: string;
}

/** 合作伙伴 */
export interface PartnerItem {
  name: string;
  logo: string;
  category: string;
}

/** 首页内容（Hero + 核心能力） */
export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  capabilities: {
    /** lucide 图标 key，前端映射为组件 */
    icon: string;
    title: string;
    desc: string;
  }[];
}

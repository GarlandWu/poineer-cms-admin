# Claude System Prompt & Project Context: 能源采集与数字孪生系统企业门户

## 1. 项目定位与核心技术栈
本项目是关于 **“能源数据采集 (Energy Data Acquisition) & 数字孪生系统 (Digital Twin Systems)”** 企业的的现代化企业门户网站。
采用 **Jamstack 纯静态生成 (SSG)** 架构，做到零云端服务器/数据库成本、国内极速访问以及极致的百度 SEO。

- **全栈框架**: Next.js (App Router, TS, SSG `output: 'export'`)
- **样式系统**: Tailwind CSS + shadcn/ui + Lucide Icons
- **本地 CMS 后台**: Payload CMS 3 (独立应用 `cms/`，端口 3001，本地 **SQLite** 存储，零外部数据库依赖)
- **数据桥接**: `cms/` 内 `npm run export` 读 Payload 写主站 `src/data/*.json`；主站运行时只读静态 JSON，不依赖数据库
- **静态部署**: 腾讯云 Webify / 阿里云静态托管 (依托国内 CDN)

## 2. 行业业务上下文与术语规范
编写 UI 文本、组件和 Mock 数据时，请务必使用以下专业术语：
- **采集协议**: Modbus-RTU/TCP, MQTT, OPC UA, BACnet, IEC 60870-5-104
- **硬件产品**: 边缘计算采集网关 (Edge IoT Gateway), 多功能智能电表, 串口服务器, 算法拓扑模块
- **数字孪生功能**: 3D 管道拓扑重构, 毫秒级数据采集, 能效数字孪生大屏, 动态能耗热力图, 负荷预测算法
- **转化目标 (CTA)**: 【预约 3D 演示 (Demo)】、【下载选型手册 (PDF)】、【获取零碳方案】

## 3. 编码与架构指令 (Coding Rules)

### A. 移动端优先与 UI 设计 (Mobile-First UI)
1. **响应式必须强制**: 界面先满足 375px~430px (手机端) 的极佳展示，再使用 Tailwind 断点 (`md:`, `lg:`) 进行桌面端扩展。
2. **触控与互动**: 移动端所有交互元素高度不低于 `h-11` (44px)。数字孪生 3D 大屏截图必须支持移动端点击放大/全屏预览。
3. **视觉风格**: 主色采用**深青蓝 (Deep Cyan / Navy Blue)**、**科技绿 (Energy Green)**、**电网蓝 (Electric Blue)**，营造工业科技感。

### B. SEO 与 SSG 约束
1. **静态导出模式**: 必须在 `next.config.js` 中配置 `output: 'export'`。禁止使用依赖 Node.js 运行时的 SSR API。
2. **静态路径预渲染**: 所有动态路由 (`/solutions/[slug]`, `/products/[slug]`, `/news/[slug]`) 必须导出 `generateStaticParams()`。
3. **语义化与元数据**: 每个页面必须导出 `generateMetadata`，动态填充 Title, Description 以及 OpenGraph (微信分享卡片适配)。

### C. 数据流与 TypeScript 约束
1. 数据类型严格使用项目定义的 `SolutionItem`, `EnergyProductItem`, `EnergyCaseStudy` 接口。
2. 静态页面通过读取本地静态 JSON 或 Payload 本地导出 API 获取数据，不得直接在生产端组件中发请求到公网动态数据库。

## 4. 常用开发任务指令快速参考
- **新增解决方案页面**: 需包含 架构拓扑图组件 + 支持协议 Tag + 客户 ROI 量化数据 + 预约演示 Form。
- **新增硬件产品页面**: 需包含 采集通道规格网格 + 工业协议列表 + PDF 选型手册下载入口。
- **新增内容字段**: 先改 `cms/src/collections/*.ts`（集合），再同步 `src/types/schema.ts`（接口）与 `cms/src/scripts/export.ts`（导出映射），三处保持一致。
- **发布内容**: `cms/` 内 `npm run export` → 根目录 `npm run build` → 推送 `out/`。
- **本地预览产物**: `npm run preview`（HTTP 服务 `out/`，勿直接双击 HTML，否则绝对路径资源加载失败无样式）。


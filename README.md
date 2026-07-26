# ⚡ 能源数据采集与数字孪生系统 — 现代化企业门户网站

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Payload CMS](https://img.shields.io/badge/Payload_CMS-Local-darkgreen?style=flat)](https://payloadcms.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Tencent_Webify-blue?style=flat)](https://cloud.tencent.com/)

专注于 **水/电/气/冷/热 能源数据采集** 与 **工业级数字孪生 (Digital Twin)** 解决方案的现代化企业门户网站。

采用 **“纯本地内容创作 + 纯静态编译 (SSG) + 全球/国内 CDN 静态托管”** 架构，实现 **0 线上服务器续费成本、国内秒级加载与极致百度 SEO 优化**。

---

## 🏢 核心展示模块

0. **首页**：介绍企业的经验、业务、优势等。
1. **数字孪生解决方案 (Solutions)**：智慧园区零碳管理、数据中心 PUE 优化、高耗能工厂 3D 能效监测。
2. **数据采集硬件中心 (Products)**：边缘计算网关、智能采集终端、协议转换器（支持 Modbus, MQTT, OPC UA 等）。
3. **客户成功案例 (Case Studies)**：行业标杆客户实测 ROI、节电率、数据采集延迟与数字孪生大屏展示。
4. **新闻与技术干货 (Insights)**：能源管理政策解读、工业物联网 (AIoT) 采集协议深度科普。
5. **合作伙伴**：
6. **联系我们**：展示工作时间、联系方式与办公地址（地图）

---

## 🛠️ 本地开发与工作流

> **架构说明**：主站是 **纯静态导出 (SSG, `output: 'export'`)**，运行时不依赖任何数据库；Payload CMS 作为 **独立本地后台**（`cms/` 目录，内置 **SQLite**，零外部数据库依赖）。内容创作在本地后台完成，构建期通过 `npm run export` 把数据导出为 `src/data/*.json` 供主站读取。

### 1. 环境准备
确保本地安装了 Node.js (>= 18.0.0，CMS 后台需 >= 20.9.0)。

```bash
# 1. 克隆项目
git clone https://github.com/your-org/energy-digital-twin-portal.git
cd energy-digital-twin-portal

# 2. 安装主站依赖
npm install

# 3. 安装并初始化本地 CMS 后台
cd cms
npm install
cp .env.example .env            # 按需修改 PAYLOAD_SECRET
npm run seed                    # 建管理员 + 导入初始内容（首次一次即可）
cd ..
```

`npm run seed` 会创建默认管理员 `admin@energy-portal.com / Energy@2026`（请尽快在后台修改）。

### 2. 启动本地开发与内容创作环境

```bash
# A. 主站前端（终端 1）
npm run dev                     # http://localhost:3000

# B. Payload 本地后台（终端 2）
cd cms && npm run dev           # http://localhost:3001/admin
```

在后台录入/编辑 **解决方案 / 硬件产品 / 客户案例 / 新闻**，数据存入本地 SQLite。

### 3. 发布：导出内容 → 构建静态网页 (SSG)

```bash
# 1) 从 CMS 导出最新内容到主站 src/data/*.json
cd cms && npm run export && cd ..

# 2) 构建纯静态站点，产物在 out/
npm run build

# 3) 本地预览构建产物（务必用 HTTP，勿直接双击 out/index.html）
npm run preview                 # http://localhost:5000
```

执行后在根目录生成纯静态网页包 `out/`（含 `sitemap.xml`、`robots.txt`），可直接推送至国内 CDN 托管。

---

## 🚀 部署与发布指南

项目无需购买云服务器与云数据库。部署仅需把 `out/` 目录通过 Git 推送或 CLI 提交至国内托管平台：

* **腾讯云 Webify / 阿里云静态托管**：绑定已备案域名，自动开启 HTTPS 与全网 CDN 加速。
* **发布更新流程**：
`本地后台录入内容` ➔ `cms 内 npm run export` ➔ `npm run build` ➔ `Git Push out/` ➔ `CDN 秒级更新`

---

## 🗂️ 本地 CMS 后台 (`cms/`)

| 项 | 说明 |
| --- | --- |
| 技术 | Payload CMS 3 + Next.js（独立应用，端口 `3001`） |
| 数据库 | 本地 **SQLite**（`cms/energy-portal.db`），零外部依赖 |
| 集合 | `solutions` / `products` / `case-studies` / `news` / `partners` / `media` / `users`，字段与主站 TS 接口一一对应 |
| 全局设置 | `site-settings`（Global）→ `src/data/site.json`（站点名/联系方式/ICP/地图坐标/SEO）；`homepage`（Global）→ `src/data/home.json`（首页 Hero + 核心能力卡） |
| 媒体上传 | `media` 集合上传的图片/PDF 直接落盘到主站 `public/uploads/`；后台复制只读字段 **主站引用路径**（`/uploads/<文件名>`）填入内容的图片/PDF 字段即可 |
| 桥接脚本 | `npm run seed`（初始化）、`npm run export`（导出 JSON 到 `../src/data`） |

**常用命令（在 `cms/` 目录内执行）**

```bash
npm run dev                # 启动后台 http://localhost:3001/admin
npm run seed               # 建管理员 + 从 src/data 导入初始内容（首次）
npm run export             # 读 Payload → 写主站 src/data/*.json（发布前执行）
npm run generate:types     # 由集合生成 payload-types.ts
```

> 主站运行时 **完全不依赖** Payload 与数据库——CMS 仅用于本地内容创作；生产端只读编译进包的静态 JSON，符合"生产端不发公网动态请求"约束。

---

## 📄 开源许可与文档

* 详细架构图与技术细节请参考 [ARCHITECTURE.md](./.claude/docs/ARCHITECTURE.md)。
* Claude / AI Coding 规范请参考 [claude.md](./.claude/claude.md)。
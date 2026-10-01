# 🏗️ 能源门户管理系统 - 完整系统架构概览

## 📊 系统构成

```
┌─────────────────────────────────────────────────────────┐
│                   运营人员工作站                        │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │     能源门户管理系统 (Electron 应用)              │ │
│  │                                                   │ │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────────┐  │ │
│  │  │   CMS 标签页│  │ 预览标签 │  │ 发布标签  │  │ │
│  │  │             │  │          │  │           │  │ │
│  │  │ • 启动 CMS  │  │ • 构建   │  │ • 一键   │  │ │
│  │  │ • 停止 CMS  │  │ • 预览   │  │   发布   │  │ │
│  │  │ • 打开链接  │  │ • 浏览   │  │         │  │ │
│  │  └─────────────┘  └──────────┘  └────────────┘  │ │
│  └───────────────────────────────────────────────────┘ │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
  ┌──────────┐      ┌──────────┐      ┌──────────┐
  │  CMS     │      │ Next.js  │      │ Git Flow │
  │ 3001     │      │ SSG Build│      │          │
  └──────────┘      └──────────┘      └──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ↓
                 ┌─────────────────┐
                 │  out/ 静态文件  │
                 │  (HTML/JS/CSS)  │
                 └─────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
  ┌──────────┐      ┌──────────┐      ┌──────────┐
  │ 本地预览 │      │ Git push │      │ CDN 部署 │
  │ 5000     │      │ pioneer- │      │ 腾讯/    │
  │          │      │ cms repo │      │ 阿里云   │
  └──────────┘      └──────────┘      └──────────┘
```

## 🔄 完整工作流程

### 📝 步骤 1: 启动 CMS 编辑内容

```bash
用户点击 "启动 CMS" 按钮
  ↓
Electron 主进程执行: npm run dev (在 cms 目录)
  ↓
Payload CMS 启动 (localhost:3001)
  ↓
用户在浏览器编辑内容
  ↓
内容保存到 cms/payload.db (SQLite 本地数据库)
```

### 🔨 步骤 2: 构建网站

```bash
用户点击 "构建" 按钮
  ↓
执行 1: cd cms && npm run export
  ├─ Payload 导出所有内容到 JSON
  └─ 生成 src/data/*.json 文件
  ↓
执行 2: next build
  ├─ Next.js 读取 src/data/*.json
  ├─ 构建完整的静态网站
  └─ 生成 out/ 目录 (HTML/JS/CSS)
  ↓
构建完成 ✅
```

### 👁️ 步骤 3: 本地预览验证

```bash
用户点击 "启动预览" 按钮
  ↓
Electron 主进程执行: npx serve out -l 5000
  ↓
Serve 启动 (localhost:5000)
  ↓
用户在浏览器打开 http://localhost:5000
  ↓
验证网站效果无误
```

### 🚀 步骤 4: 一键发布

```bash
用户点击 "执行发布" 按钮 → 确认对话框
  ↓
执行 1: 导出 CMS 数据
  └─ cd cms && npm run export
  ↓
执行 2: 构建主站
  └─ next build
  ↓
执行 3: 清理 submodule
  └─ 删除 pioneer-cms 目录内容 (保留 .git)
  ↓
执行 4: 复制构建产物
  └─ cp -r out/* pioneer-cms/
  ↓
执行 5: Git 提交
  └─ git add -A
  └─ git commit -m "Deploy YYYY-MM-DD"
  ↓
执行 6: 推送远程
  └─ git push origin main
  ↓
发布完成 ✅
  ↓
CDN 自动拉取最新内容并部署
```

## 📂 文件系统结构

```
pioneer-cms/
│
├── electron/                    # ⚡ Electron 应用核心
│   ├── main.js                 # 主进程 (进程管理、IPC)
│   └── preload.js              # 安全桥接 (IPC 暴露)
│
├── electron-ui/                # 🎨 管理界面 (渲染进程)
│   ├── index.html              # 主页面
│   ├── app.js                  # 应用逻辑
│   └── style.css               # 深色主题样式
│
├── cms/                        # 📝 Payload CMS (本地)
│   ├── package.json
│   ├── payload.db              # SQLite 数据库
│   ├── src/
│   │   ├── collections/        # 数据模型定义
│   │   ├── scripts/
│   │   │   └── export.ts       # 导出脚本 → JSON
│   │   └── config.ts           # CMS 配置
│   └── public/                 # CMS UI 资源
│
├── src/                        # 🌐 Next.js 主站门户
│   ├── app/                    # App Router 目录结构
│   ├── components/             # React 组件
│   ├── data/                   # 静态 JSON 数据 (CMS 导出)
│   │   ├── news.json           # 新闻内容
│   │   ├── solutions.json      # 解决方案
│   │   ├── products.json       # 产品
│   │   └── cases.json          # 案例研究
│   └── styles/                 # 全局样式 (Tailwind)
│
├── public/                     # 静态资源 (图片/字体)
│   └── images/
│
├── scripts/                    # 🛠️ 工具脚本
│   ├── publish.js              # 一键发布脚本
│   ├── build.js                # 构建脚本
│   └── export.js               # 导出脚本 (旧)
│
├── out/                        # 📦 构建产物 (Next.js 输出)
│   ├── index.html              # 首页
│   ├── _next/                  # Next.js 运行时
│   ├── news/                   # 动态生成的页面
│   └── solutions/
│
├── dist/                       # 📦 Electron 打包产物
│   ├── 能源门户管理系统 Setup 0.1.0.exe
│   └── 能源门户管理系统 0.1.0.exe
│
├── package.json                # 根目录配置
│   ├── scripts                 # NPM 脚本定义
│   └── build                   # Electron Builder 配置
│
├── next.config.js              # Next.js 配置 (output: 'export')
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.ts          # Tailwind 配置
│
├── ELECTRON_GUIDE.md           # 📖 Electron 使用指南
├── ELECTRON_STARTUP.md         # 📖 快速启动指南
├── DEPLOY_GUIDE.md             # 📖 部署和打包指南
├── SYSTEM_OVERVIEW.md          # 📖 本文档
│
└── run-dev.bat                 # 🚀 快速启动脚本 (开发)
└── build-exe.bat               # 🚀 快速打包脚本
```

## 🔌 IPC 通信架构

### Electron 主进程 (main.js) 负责:
- 创建和管理窗口
- 启动/停止 CMS 进程
- 启动/停止预览服务
- 执行 npm 脚本
- 管理进程通信

### 渲染进程 (electron-ui/app.js) 负责:
- 显示 UI 界面
- 处理用户输入
- 调用 Electron IPC
- 显示进程日志
- 更新界面状态

### IPC 通道清单:

| 功能 | 调用 | 返回 | 日志事件 |
|------|------|------|---------|
| 启动 CMS | `cms.start()` | {success, message} | `cms-log` |
| 停止 CMS | `cms.stop()` | {success, message} | - |
| 启动预览 | `preview.start()` | {success, message} | `preview-log` |
| 停止预览 | `preview.stop()` | {success, message} | - |
| 构建 | `build.execute()` | {success, message} | `build-log` |
| 发布 | `publish.execute()` | {success, message} | `publish-log` |
| 获取状态 | `app.getStatus()` | {cmsRunning, previewRunning} | - |
| 打开 URL | `app.openUrl(url)` | - | - |
| 打开文件夹 | `app.openFolder(path)` | - | - |

## 🔐 安全性设计

### Context Isolation
- ✅ 启用 `contextIsolation: true`
- ✅ 渲染进程无法直接访问 Node.js
- ✅ 只能通过安全的 IPC 桥接通信

### Preload 脚本
- ✅ 使用 `contextBridge.exposeInMainWorld()`
- ✅ 显式暴露允许的 API
- ✅ 禁止暴露 `ipcRenderer` 本身

### 数据安全
- ✅ CMS 数据存储在本地 SQLite
- ✅ 无网络数据传输 (构建期)
- ✅ 发布时推送到 Git，由 CDN 部署

## 📊 数据流向

### 编辑流程
```
Electron App
    ↓
CMS (localhost:3001)
    ↓
Payload CMS 编辑界面
    ↓
编辑内容
    ↓
保存到 cms/payload.db (SQLite)
```

### 构建流程
```
npm run export
    ↓
Payload 导出 API
    ↓
生成 JSON: src/data/*.json
    ↓
Next.js 读取 JSON
    ↓
构建静态文件
    ↓
生成 out/ 目录
```

### 预览流程
```
out/ 目录
    ↓
Serve 启动 (localhost:5000)
    ↓
浏览器访问
    ↓
查看最终效果
```

### 发布流程
```
out/ 目录
    ↓
复制到 pioneer-cms/
    ↓
Git commit
    ↓
Git push origin main
    ↓
CDN 部署
    ↓
用户访问最新网站
```

## 🎯 核心特性

### 开发体验
- ✅ Electron UI 管理所有操作
- ✅ 实时日志输出
- ✅ 错误提示和状态显示
- ✅ 无需命令行操作

### 运营体验
- ✅ 图形化界面，易于上手
- ✅ 一键启动和发布
- ✅ 本地预览验证
- ✅ 详细的操作日志

### 技术特性
- ✅ 零云端服务器成本
- ✅ 国内 CDN 就绪
- ✅ 自动化部署
- ✅ Git 版本控制

## 🚀 部署拓扑

```
开发者工作站
    ↓
    └─→ Electron App (开发/打包)
            ├─→ CMS (3001)
            ├─→ Next.js Build (out/)
            └─→ Preview (5000)
    
    ↓
    
发布
    ├─→ Git Commit
    └─→ Git Push
    
    ↓
    
Pioneer-CMS Repo (GitHub/GitLab)
    ├─→ Webhook 触发
    └─→ CDN 部署
    
    ↓
    
Global CDN (腾讯云/阿里云)
    ├─→ 中国境内加速
    └─→ 边缘节点缓存
    
    ↓
    
终端用户
    └─→ https://your-portal.com
```

## 📈 性能指标

### 构建性能
- CMS 导出: ~1-2 秒
- Next.js 构建: ~30-60 秒
- 总时间: ~1-2 分钟

### 运行时性能
- CMS: 3001 端口，SQLite 查询 <10ms
- 预览: 5000 端口，静态 HTML 直接加载
- 网站: CDN 加速，首屏 <1s

## 🔄 工作流优化

### 一日多次更新
```
修改内容 → 构建 (1分钟) → 预览 (即时) → 发布 (1分钟)
总时间: 2-3 分钟
```

### 版本迭代
```
新增功能 → 自测 → 发布 (2分钟) → CDN 生效 (5分钟)
总延迟: <10 分钟
```

## 🎓 学习路径

1. **快速上手**: 阅读 [ELECTRON_STARTUP.md](./ELECTRON_STARTUP.md)
2. **详细使用**: 阅读 [ELECTRON_GUIDE.md](./ELECTRON_GUIDE.md)
3. **部署打包**: 阅读 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
4. **代码开发**: 查看 `.claude/CLAUDE.md`

---

**最后更新**: 2026-07-31  
**版本**: 0.1.0  
**作者**: Garland Wu

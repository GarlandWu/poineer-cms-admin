# ⚡ 快速参考指南

## 🚀 5 分钟快速开始

### 开发者 (本地开发)
```bash
# 1. 进入项目目录
cd pioneer-cms

# 2. 安装依赖 (首次)
npm install

# 3. 启动开发环境
npm run electron-dev

# 4. 应用会自动打开，享受开发！
```

或者更简单的方式：
```bash
# 直接双击运行
run-dev.bat
```

### 打包 EXE (给运营使用)
```bash
# 双击运行打包脚本
build-exe.bat

# 生成位置: dist/
#  • 能源门户管理系统 Setup 0.1.0.exe (推荐用户安装)
#  • 能源门户管理系统 0.1.0.exe (便携版，无需安装)
```

## 📋 常用命令速查表

| 目的 | 命令 | 说明 |
|------|------|------|
| **开发** | `npm run electron-dev` | 启动开发环境 (热更新) |
| | `npm run electron` | 启动 Electron (需手动启动 Next.js) |
| | `run-dev.bat` | Windows 快速启动脚本 |
| **构建** | `npm run build` | 构建主站到 out/ |
| | `npm run electron-build` | 打包成 EXE |
| | `build-exe.bat` | Windows 快速打包脚本 |
| **部署** | `npm run publish` | 执行一键发布 |
| | | (构建 → 提交 → 推送) |
| **预览** | `npm run preview` | 本地预览 (localhost:5000) |
| **CMS** | `cd cms && npm run dev` | 启动 CMS (localhost:3001) |
| | `cd cms && npm run export` | 导出 CMS 数据到 JSON |

## 🎯 三个场景的完整流程

### 场景 1️⃣: 日常内容更新 (运营人员)

```
启动应用
  ↓
【CMS 标签页】
启动 CMS → 在浏览器编辑 → 停止 CMS
  ↓
【门户预览标签页】
构建 → 启动预览 → 浏览器预览 → 停止预览
  ↓
【发布标签页】
执行发布 → 确认 → 完成！✅
```

**总时间**: ~5 分钟

### 场景 2️⃣: 本地开发调试 (开发者)

```
双击 run-dev.bat
  ↓
修改代码
  ↓
热更新自动刷新
  ↓
按需启动 CMS 测试
  ↓
CTRL+C 结束开发
```

**总时间**: 灵活, 开发时间 + 构建时间(1-2分钟)

### 场景 3️⃣: 打包发布新版本 (开发者)

```
修改代码完成
  ↓
更新 version in package.json
  ↓
git commit && git push
  ↓
双击 build-exe.bat
  ↓
等待构建和打包完成
  ↓
dist/ 目录中找到 EXE
  ↓
发送给运营或部署
```

**总时间**: ~5-10 分钟 (取决于网络速度)

## 📱 UI 界面速查

### CMS 部分
- **启动 CMS**: 绿色按钮，点击启动本地 CMS (3001)
- **停止 CMS**: 红色按钮，关闭 CMS 进程
- **打开 CMS**: 浏览器快捷方式，打开 http://localhost:3001
- **日志**: 实时显示 CMS 运行日志
- **状态**: 左上角徽章显示 "运行中" 或 "未运行"

### 门户预览部分
- **构建**: 蓝色按钮，执行完整构建流程
  - 导出 CMS 数据
  - 构建 Next.js 网站
  - 生成 out/ 目录
- **启动预览**: 绿色按钮，启动预览服务 (5000)
- **停止预览**: 红色按钮，关闭预览服务
- **打开预览**: 浏览器快捷方式，打开 http://localhost:5000
- **打开文件夹**: 文件管理器快捷方式，打开 out/ 目录
- **日志**: 构建和预览日志

### 发布部分
- **执行发布**: 绿色按钮，一键发布到远程
  - ⚠️ 点击后会弹出确认对话框
  - 自动执行: 构建 → 提交 → 推送
- **日志**: 详细的发布过程日志

## 🔧 端口配置

| 服务 | 端口 | 用途 | 何时运行 |
|------|------|------|---------|
| **CMS** | 3001 | Payload CMS 后台 | 编辑内容时 |
| **预览** | 5000 | 预览静态网站 | 发布前验证 |
| **Next.js Dev** | 3000 | 开发服务器 | 开发模式 (自动) |

## 🛑 常见错误快速解决

| 错误 | 原因 | 解决 |
|------|------|------|
| "端口 3001 已被占用" | 其他程序占用 | 关闭占用 3001 的程序 |
| "端口 5000 已被占用" | 其他程序占用 | 关闭占用 5000 的程序 |
| "Node.js 未检测到" | 未安装 Node.js | 下载安装 https://nodejs.org |
| "依赖安装失败" | 网络问题或 npm 损坏 | 重新运行 `npm install` |
| "CMS 启动失败" | cms 目录依赖问题 | 运行 `cd cms && npm install` |
| "构建失败" | TypeScript 错误 | 查看日志，修复代码错误 |
| "发布失败" | Git 配置或网络问题 | 检查 Git 设置和网络连接 |

## 📊 文件大小参考

| 产物 | 大小 | 用途 |
|------|------|------|
| node_modules | ~1GB | 依赖库 (不上传) |
| out/ | ~50-100MB | 构建产物 |
| dist/Setup.exe | ~200-300MB | 安装程序 |
| dist/Portable.exe | ~180-250MB | 便携版 |
| cms/payload.db | ~1-10MB | CMS 数据库 |

## 🎓 文档导航

| 需求 | 文档 | 阅读时间 |
|------|------|---------|
| 五分钟快速开始 | 📖 本文档 | 5 分钟 |
| 启动和运营 | 📖 ELECTRON_STARTUP.md | 15 分钟 |
| 详细使用指南 | 📖 ELECTRON_GUIDE.md | 30 分钟 |
| 部署和打包 | 📖 DEPLOY_GUIDE.md | 20 分钟 |
| 系统架构理解 | 📖 SYSTEM_OVERVIEW.md | 30 分钟 |
| 完整改进说明 | 📖 CHANGES_SUMMARY.md | 20 分钟 |

## 🎯 决策树 - 我应该做什么？

```
我想要...
├─ 快速开始开发
│  └─→ npm run electron-dev 或双击 run-dev.bat
│
├─ 打包成 EXE 给运营用
│  └─→ npm run electron-build 或双击 build-exe.bat
│      └─→ dist/ 目录中找到 EXE 文件
│
├─ 发布网站到远程
│  └─→ 打开 Electron 应用
│      └─→ 点击"执行发布"按钮
│
├─ 只编辑内容
│  └─→ 点击"启动 CMS"
│      └─→ 在浏览器编辑
│
├─ 验证发布前的效果
│  └─→ 点击"构建" → "启动预览" → 浏览器预览
│
├─ 了解系统架构
│  └─→ 阅读 SYSTEM_OVERVIEW.md
│
├─ 遇到问题排查
│  └─→ 查看相应文档的"故障排除"章节
│
└─ 想要深入学习
   └─→ 按顺序阅读所有文档
```

## ⌨️ 键盘快捷键 (开发模式)

| 快捷键 | 功能 |
|--------|------|
| F12 | 打开开发者工具 |
| CTRL+R | 刷新应用 |
| CTRL+Shift+I | 打开检查器 |
| CTRL+C | 停止运行 (终端) |

## 💡 专业技巧

### 1. 快速启动快捷方式
```
右键 run-dev.bat → 创建快捷方式
右键快捷方式 → 属性 → 快捷方式 → 快捷键
设置快捷键 (如 Ctrl+Alt+E) → 应用
```

然后直接按 `Ctrl+Alt+E` 即可启动！

### 2. 后台运行 Electron
```bash
# 启动后最小化到托盘，不占用终端
npm run electron-dev &
```

### 3. 清除构建缓存
```bash
# 如果构建出现奇怪问题，清除缓存
rm -rf .next out dist node_modules
npm install
```

### 4. 查看详细的构建日志
```bash
# 添加调试模式
DEBUG=* npm run electron-build
```

### 5. 手动导出 CMS 数据测试
```bash
cd cms
npm run export
# 查看生成的 JSON 文件: ../src/data/
```

## 📞 何时寻求帮助

### 先自助排查 (10 分钟)
1. 查看错误日志
2. 重启应用
3. 重新安装依赖

### 查阅文档 (15 分钟)
1. 查看 ELECTRON_STARTUP.md 的故障排除
2. 查看相关文档的常见问题部分
3. 搜索错误信息

### 深入诊断 (30 分钟)
1. 查看 SYSTEM_OVERVIEW.md 了解架构
2. 阅读源代码注释
3. 运行诊断脚本

### 技术参考
- [Electron 文档](https://www.electronjs.org)
- [Next.js 文档](https://nextjs.org)
- [Payload CMS 文档](https://payloadcms.com)

## 🎁 实用资源

### 官方链接
- 📥 Node.js 下载: https://nodejs.org (需要 v18+)
- 🎯 Electron: https://www.electronjs.org
- 🚀 Next.js: https://nextjs.org
- 📝 Payload CMS: https://payloadcms.com

### 项目相关
- 📁 项目根目录: `c:\pioneerCMS\`
- 📁 CMS 数据库: `c:\pioneerCMS\cms\payload.db`
- 📁 构建产物: `c:\pioneerCMS\out\`
- 📁 EXE 输出: `c:\pioneerCMS\dist\`

### Git 仓库
- 主仓库: `pioneer-cms` (当前)
- Submodule: `pioneer-cms` (发布目标)

## ✅ 最后检查

启动前确保:
- [ ] Node.js v18+ 已安装
- [ ] `npm install` 成功
- [ ] 没有遗留进程占用 3001/5000 端口
- [ ] 磁盘空间充足 (>2GB)

启动后验证:
- [ ] 应用窗口正常打开
- [ ] 所有按钮可点击
- [ ] 日志区域显示正常
- [ ] 状态徽章显示准确

---

**最后更新**: 2026-07-31  
**版本**: 0.1.0  
**快速参考完成** ✨

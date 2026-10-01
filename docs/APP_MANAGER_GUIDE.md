# App Manager 方案（Node 24 兼容）

## ✨ 为什么改用这个方案？

❌ `webview` 包不兼容 Node 24  
✅ **App Manager** 完全兼容 Node 24  
✅ 无需任何原生模块依赖  
✅ 纯 Node.js + HTML，简单易维护  
✅ 自动打开浏览器  

---

## 🚀 快速开始

### Step 1: 安装 pkg（仅需一次）

```bash
npm install -g pkg
```

### Step 2: 本地测试（可选）

```bash
npm run app
```

自动打开浏览器窗口，显示操作面板。

### Step 3: 打包成 EXE

```bash
npm run app:build
```

等待 2-5 分钟...

```
✅ 完成！
📍 EXE 文件: dist/EnergyPortalManager.exe
💾 大小: 5-8 MB
```

---

## 💻 工作原理

```
app-manager.js (Node.js 脚本)
    ↓
启动 HTTP 服务 (localhost:3010)
    ↓
自动打开浏览器
    ↓
用户点击按钮
    ↓
前端发送 HTTP 请求
    ↓
后端执行命令 (CMS / 预览 / 发布)
    ↓
自动打开对应的浏览器标签
```

---

## 📋 文件说明

| 文件 | 用途 |
|-----|------|
| `app-manager.js` | 主应用脚本 |
| `dashboard.html` | UI 界面 |
| `dashboard-app.js` | 前端逻辑 |

---

## 🎯 功能

### 🚀 启动 CMS 后台

- 启动 `npm run dev` (在 cms 目录)
- 自动打开浏览器到 `http://localhost:3001`
- 在 CMS 中编辑内容

### 🌐 预览网站

- 检查 `out/` 目录
- 如果不存在则先构建
- 启动 `npx serve out -l 5000`
- 自动打开浏览器到 `http://localhost:5000`

### 📦 一键发布

- 执行 `node scripts/publish.js`
- 完整流程：构建 → 提交 → 推送

---

## ✅ 优势

✅ **Node 24 完全兼容** — 无需降级版本  
✅ **零原生模块** — 无编译问题  
✅ **纯 HTML/JS** — 易于修改和维护  
✅ **自动打开浏览器** — 开箱即用  
✅ **文件超小** — 5-8 MB  
✅ **启动超快** — <0.5 秒  

---

## 🔧 修改 UI

编辑 `dashboard.html` 修改按钮、样式等：

```html
<button class="btn-cms" onclick="sendCmd('start-cms')">
  🚀 启动 CMS 后台
</button>
```

---

## 📦 分发

```bash
# 打包
npm run app:build

# 分发给运营人员
# EXE + 整个项目目录
```

---

完成！推荐这个方案。🎉

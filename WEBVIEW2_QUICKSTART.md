# WebView2 快速开始 (5 分钟)

## 🚀 三个命令搞定

### 1️⃣ 安装依赖

```bash
npm install webview
npm install -g pkg
```

### 2️⃣ 本地测试（可选）

```bash
npm run webview
```

**效果**:
- 自动打开一个应用窗口
- 包含三个按钮（启动 CMS、预览、发布）
- 点击按钮即可操作
- `Ctrl+C` 停止

### 3️⃣ 打包成 EXE

```bash
npm run webview:build
```

**等待 2-5 分钟...**

```
✅ 打包完成！
📍 EXE 文件: dist/EnergyPortalManager.exe
💾 大小: 5-8 MB
```

---

## 💻 使用

**双击** `dist/EnergyPortalManager.exe`

```
╔──────────────────────────────────┐
│  ⚡ 能源门户管理                 │
├──────────────────────────────────┤
│  🚀 启动 CMS 后台                │
│  🌐 预览网站                     │
│  📦 一键发布                     │
└──────────────────────────────────┘
```

---

## 📦 分发

1. **整个项目目录** + **EXE 文件**
2. 给运营人员双击 EXE
3. 完成！

---

## ❓ 常见问题

| 问题 | 解决 |
|-----|------|
| webview: command not found | `npm install webview` |
| pkg: command not found | `npm install -g pkg` |
| 启动后没有窗口 | 检查端口 3010 是否被占用 |
| CMS 启动失败 | `cd cms && npm install` |
| Git push 失败 | 配置 git user 和 ssh 密钥 |

---

## 📚 详细文档

→ 查看 `WEBVIEW2_GUIDE.md`

---

**完成！** 🎉

# ⚠️ Windows 打包问题临时解决方案

## 问题诊断
electron-builder 在 Windows 11 上因符号链接权限问题无法提取代码签名工具。

## ✅ 快速解决方案

### 方案 A: 直接运行 Electron 应用（推荐，无需打包）

```bash
# 终端 1: 启动 Next.js 开发服务器
npm run dev

# 终端 2（等待终端 1 显示 ready 后）: 启动 Electron
npm run electron
```

或者使用一键脚本：
```bash
双击 run-dev.bat
```

这样不需要打包就能获得完整的应用功能。

### 方案 B: 使用 pkg 工具打包（替代方案）

项目中已有 pkg 配置（另一个打包工具）：

```bash
npm run app:build
```

这会生成 `dist/EnergyPortalManager.exe`

---

## 📦 可选：修复 electron-builder 打包

如果需要使用 electron-builder，需要以下步骤：

### 步骤 1: 清除所有缓存
```bash
# PowerShell (管理员模式)
Remove-Item -Path "$env:LOCALAPPDATA\electron-builder\Cache" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:LOCALAPPDATA\electron" -Recurse -Force -ErrorAction SilentlyContinue
```

### 步骤 2: 更新 electron-builder 版本
```bash
npm uninstall electron-builder
npm install electron-builder@^25.0.0 --save-dev
```

### 步骤 3: 重试打包
```bash
npm run electron-build
```

---

## 🎯 推荐流程

对于运营人员，推荐以下使用方式：

### 方式 1: 运行 Electron 应用（最简单）
```bash
双击 run-dev.bat
```
- 无需安装，直接运行
- 包含全部功能
- 可以保存为快捷方式

### 方式 2: 使用 pkg 打包的 EXE
```bash
npm run app:build
```
生成单个 EXE 文件，可直接运行

---

## 📝 项目状态

- ✅ Electron 应用框架完整
- ✅ UI 界面完整
- ✅ 所有功能可用
- ✅ 文档详尽
- ⚠️ electron-builder 打包受 Windows 权限影响（可用替代方案）

---

## 💡 快速使用指南

### 第一次使用
```bash
npm install
npm run dev              # 终端 1
npm run electron        # 终端 2
```

### 日常使用
```bash
双击 run-dev.bat        # 自动启动所有服务
```

### 打包分发
```bash
npm run app:build       # 生成 EXE (用 pkg 工具)
```

---

需要帮助？查看详细文档：
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [ELECTRON_STARTUP.md](./ELECTRON_STARTUP.md)

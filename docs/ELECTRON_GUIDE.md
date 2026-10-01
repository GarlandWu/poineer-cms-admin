# 能源门户管理系统 — Electron 桌面端使用指南

面向运营人员的桌面壳：**默认自动启动 CMS**，并提供「构建 / 预览门户 / 一键发布主站」三个按钮。
CMS 只在本机运行，不会发布到服务器；发布出去的只有 `out/` 静态产物。

## 一、组成

```
electron/main.js       主进程：进程管理、端口探测、IPC
electron/preload.js    contextBridge 安全桥接（无 nodeIntegration）
electron-ui/           管理面板（原生 HTML/CSS/JS，无构建步骤）
dist/EnergyPortalManager.exe   打包产物（portable 单文件，约 72MB）
```

exe 内**只包含 Electron 运行时和管理面板**，不包含项目源码与 `node_modules`。
它是一个「驱动器」：操作放在磁盘上的项目目录，因此机器上仍需 **Node.js ≥ 20 与 Git**
（`next build`、`git push` 都要用到）。

## 二、面板功能

| 区域 | 行为 | 实际执行 |
| --- | --- | --- |
| CMS | **应用启动即自动运行**，可停止/重启；支持「在应用内打开 CMS」新窗口，无需浏览器 | `cms/` 内 `npm run dev`（端口 3001，`/admin`） |
| 构建 | 导出 CMS 数据 → 生成静态站 | `cms: npm run export` → `next build` |
| 门户预览 | 本地起静态服务并可打开 `out/` 目录 | `npx --yes serve@latest out -l 5000` |
| 一键发布 | 二次确认后执行完整发布流水线 | `node scripts/publish.js`（构建 → 清理 submodule → 复制产物 → git 提交推送） |

所有子进程的 stdout/stderr 实时流式显示在对应日志框中（不再阻塞界面），关闭窗口时按进程树整体清理。

## 三、项目目录如何定位

主进程按以下顺序取第一个「同时含 `package.json`、`cms/`、`scripts/publish.js`」的目录：

1. 环境变量 `PORTAL_PROJECT_ROOT`
2. 上次在面板中手动选择的目录（持久化于 `%APPDATA%/EnergyPortalManager/config.json`）
3. 应用自身上级目录（开发态即仓库根目录）
4. exe 所在目录（portable 版用 `PORTABLE_EXECUTABLE_DIR`）
5. exe 上级目录

因此最省事的部署方式：**把 exe 放到项目根目录（或其 `dist/` 子目录）**。
放在别处时，点击面板右上角「更改目录」选择项目根目录即可，选择会被记住。

## 四、开发与打包

```bash
npm install
npm run electron        # 本地起桌面壳（自动拉起 CMS）
npm run electron-build  # 打包 → dist/EnergyPortalManager.exe
```

### 打包踩坑：winCodeSign 解压失败

Windows 未开启「开发者模式」时，electron-builder 解压 `winCodeSign` 缓存会因无法创建
符号链接而失败（`Cannot create symbolic link ... libcrypto.dylib`）。二选一：

- 开启 Windows 开发者模式（设置 → 系统 → 开发者选项），或以管理员身份执行一次打包；
- 或手动预置缓存（跳过 macOS 相关文件，Windows 打包不需要它们）：

```bash
CACHE="$USERPROFILE/AppData/Local/electron-builder/Cache/winCodeSign"
mkdir -p "$CACHE"
curl -sL -o "$CACHE/wcs.7z" \
  https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z
node_modules/7zip-bin/win/x64/7za.exe x -y "$CACHE/wcs.7z" \
  "-o$CACHE/winCodeSign-2.6.0" "-x!darwin*"
rm "$CACHE/wcs.7z"
```

## 五、运营人员标准操作流程

1. 双击 `EnergyPortalManager.exe`，等 CMS 状态变为「运行中」
2. 点「在应用内打开 CMS」→ 编辑内容并保存
3. 点「构建」→ 点「启动预览」→ 打开 `localhost:5000` 核对效果
4. 确认无误 → 点「执行发布」→ 日志出现「发布完成」即上线

常见提示：
- *端口 3001/5000 已被占用* — 关掉此前残留的 `node.exe` 或已在跑的开发服务
- *未找到 out/ 产物目录* — 先执行「构建」
- *发布失败* — 多为 Git 凭据或网络问题，日志中会带上 git 的原始报错

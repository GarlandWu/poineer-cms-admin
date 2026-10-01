# 能源门户管理系统 — Electron 桌面端使用指南

面向运营人员的桌面工作台：**默认自动启动随 EXE 打包的 CMS 后台**，并提供「构建门户 / 本地预览 / 构建并发布」操作。
CMS 和 SQLite 数据只在本机运行；发布出去的只有 `out/` 静态产物。

## 一、组成

```
electron/main.js       主进程：进程管理、端口探测、IPC
electron/preload.js    contextBridge 安全桥接（无 nodeIntegration）
electron-ui/           管理面板（原生 HTML/CSS/JS，无构建步骤）
dist/EnergyPortalManager.exe   打包产物（portable 单文件）
```

EXE 携带 Electron 运行时、CMS standalone 服务和后台界面。CMS 数据库保存在 `%APPDATA%/EnergyPortalManager/cms/`；选择项目目录后，上传媒体写入该项目的 `public/uploads/`，未选择时写入用户数据目录。
构建和发布门户仍需一个项目目录，以及 **Node.js ≥ 20 与 Git**；这些依赖不影响直接启动 CMS 后台。

## 二、面板功能

| 区域 | 行为 | 实际执行 |
| --- | --- | --- |
| CMS | **应用启动即自动运行**，可停止/重启；支持「打开管理后台」 | EXE 内的 Next standalone 服务（端口 3001，`/admin`） |
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
npm run electron        # 本地开发桌面壳（使用 cms/ 开发服务）
npm run electron-build  # 构建 CMS standalone 并打包 → dist/EnergyPortalManager.exe
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

1. 双击 `EnergyPortalManager.exe`，后台会自动启动并打开 CMS
2. 编辑并保存内容；项目目录会自动定位，也可以手动选择
3. 点「构建门户」→ 点「启动预览」→ 核对本地站点
4. 确认无误 → 点「构建并发布」→ 日志显示发布完成

常见提示：
- *端口 3001/5000 已被占用* — 关掉此前残留的 `node.exe` 或已在跑的开发服务
- *没有可用项目目录* — 选择包含 `cms/` 和 `scripts/publish.js` 的项目目录
- *未找到 out/ 产物目录* — 先执行「构建门户」
- *发布失败* — 多为 Git 凭据或网络问题，日志中会带上 git 的原始报错

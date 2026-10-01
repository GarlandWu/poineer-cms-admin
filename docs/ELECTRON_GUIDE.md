# 能源门户管理系统 — Electron 桌面端使用指南

面向运营人员的 CMS 桌面应用：EXE 启动后直接进入管理后台；门户构建、预览和发布位于窗口菜单。
CMS 和 SQLite 数据只在本机运行；发布出去的只有 `out/` 静态产物。

## 一、组成

```
electron/main.js       主进程：CMS 服务、原生菜单、构建和发布
dist/EnergyPortalManager.exe   打包产物（portable 单文件）
```

EXE 携带 Electron 运行时、CMS standalone 服务、CMS 初始化数据库和后台界面。首次启动会将初始化库复制到 `%APPDATA%/energy-digital-twin-portal/cms/`；已有内容的用户库不会被覆盖。空库会先备份，再重新导入初始化内容。选择项目目录后，上传媒体写入该项目的 `public/uploads/`，未选择时写入用户数据目录。

门户构建仍需项目源码目录和已安装的根目录/CMS `node_modules`。构建命令使用 EXE 内置 Node 调用项目里的 Payload/Next CLI；安装依赖时仍需 Node.js 与 npm。Git 提交/推送使用系统 Git，Git 凭据也由本机管理。完整主站源码、依赖和 Git 仓库没有打进 EXE。

## 二、应用菜单

| 区域 | 行为 | 实际执行 |
| --- | --- | --- |
| 启动 | **应用启动即自动进入 CMS** | EXE 内的 Next standalone 服务（端口 3001，`/admin`） |
| 项目 → 选择项目目录 | 指定用于导出、构建和发布的项目根目录 | 需要包含 `package.json`、`cms/` 和 `scripts/publish.js` |
| 门户 → 构建静态门户 | 导出 CMS 数据并生成静态站 | EXE 内置 Node 调用 `cms/node_modules/payload/bin.js` 和 `node_modules/next` |
| 门户 → 启动本地预览 | 启动或停止本地静态预览服务 | `npx --yes serve@latest out -l 5000` |
| 门户 → 构建并发布 | 确认后执行构建与 Git 发布 | EXE 内置 Node 执行 `scripts/publish.js`，系统 Git 完成推送 |

构建/发布完成后，原生对话框显示结果及最近的任务日志；退出应用时会整体清理服务进程。

## 三、项目目录如何定位

主进程按以下顺序取第一个「同时含 `package.json`、`cms/`、`scripts/publish.js`」的目录：

1. 环境变量 `PORTAL_PROJECT_ROOT`
2. 上次在菜单中手动选择的目录（持久化于 `%APPDATA%/energy-digital-twin-portal/config.json`）
3. 应用自身上级目录（开发态即仓库根目录）
4. exe 所在目录（portable 版用 `PORTABLE_EXECUTABLE_DIR`）
5. exe 上级目录

因此最省事的部署方式：**把 exe 放到项目根目录（或其 `dist/` 子目录）**。
放在别处时，从「项目 → 选择项目目录」指定项目根目录，选择会被记住。

## 四、开发与打包

```bash
npm install
npm run electron        # 本地启动桌面端（开发态使用 cms/ 开发服务）
npm run electron-build  # 构建 CMS standalone 并打包 → dist/EnergyPortalManager.exe
```

## 五、运营人员标准操作流程

1. 双击 `EnergyPortalManager.exe`，应用自动启动并进入 CMS
2. 编辑并保存内容
3. 从「项目 → 选择项目目录」确认站点项目目录
4. 从「门户」菜单构建、预览或构建并发布

常见提示：
- *端口 3001/5000 已被占用* — 关掉此前残留的 `node.exe` 或已在跑的开发服务
- *没有可用项目目录* — 从「项目 → 选择项目目录」选择包含 `cms/` 和 `scripts/publish.js` 的目录
- *未找到 out/ 产物目录* — 先执行「构建门户」
- *发布失败* — 多为 Git 凭据或网络问题，日志中会带上 git 的原始报错

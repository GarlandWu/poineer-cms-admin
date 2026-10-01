# 📦 Electron 应用打包与部署指南

## 🎯 快速开始

### 第一步：安装依赖
```bash
npm install
```

### 第二步：本地开发测试
```bash
npm run electron-dev
```

### 第三步：打包为 EXE
```bash
# 1. 先执行正常的构建流程
npm run build

# 2. 打包成 Electron 应用（生成 EXE 和安装程序）
npm run electron-build
```

## 📂 输出文件位置

打包完成后，产物位于 `dist/` 目录：

```
dist/
├── 能源门户管理系统 Setup 0.1.0.exe     (安装程序 - 用户安装版)
├── 能源门户管理系统 0.1.0.exe           (便携版 - 无需安装，直接运行)
├── builder-effective-config.yaml         (构建配置)
└── ...
```

## 🚀 发布流程

### 方式一：生成安装程序 (推荐给运营团队)

```bash
npm run electron-build
```

生成文件: `能源门户管理系统 Setup 0.1.0.exe`

**优势**:
- ✅ 用户友好的安装向导
- ✅ 自动创建开始菜单快捷方式
- ✅ 自动创建桌面快捷方式
- ✅ 支持卸载

**流程**:
1. 双击 `Setup 0.1.0.exe`
2. 按照安装向导完成安装
3. 安装完成后自动启动应用

### 方式二：便携版 (不需要安装)

打包时会自动生成便携版: `能源门户管理系统 0.1.0.exe`

**优势**:
- ✅ 无需安装，直接运行
- ✅ 可放在 U 盘或网络共享
- ✅ 文件大小较小

## 🔄 更新版本号

编辑 `package.json` 中的 `version` 字段：

```json
{
  "version": "0.2.0"
}
```

打包时自动使用新版本号生成文件名：
- `能源门户管理系统 Setup 0.2.0.exe`
- `能源门户管理系统 0.2.0.exe`

## 📋 预发布检查清单

在发布 EXE 前，确保完成以下检查：

- [ ] 所有依赖已安装 (`npm install`)
- [ ] CMS 功能正常 (`npm run electron-dev` 后手动测试)
- [ ] 本地预览功能正常
- [ ] 发布流程测试成功
- [ ] 版本号已更新
- [ ] Git 提交和推送已完成
- [ ] 没有未保存的文件修改

## 🧪 测试指南

### 本地开发测试

```bash
npm run electron-dev
```

测试项:
1. **CMS 功能**
   - [ ] 点击"启动 CMS"按钮
   - [ ] 等待日志显示服务已启动
   - [ ] 点击"打开 CMS"在浏览器打开
   - [ ] 编辑一些内容
   - [ ] 点击"停止 CMS"按钮

2. **预览功能**
   - [ ] 点击"构建"按钮
   - [ ] 等待构建完成
   - [ ] 点击"启动预览"按钮
   - [ ] 点击"打开预览"在浏览器查看效果
   - [ ] 点击"打开产物文件夹"查看 out/ 目录
   - [ ] 点击"停止预览"按钮

3. **发布功能**
   - [ ] 在 CMS 中修改一些内容
   - [ ] 点击"执行发布"按钮
   - [ ] 确认发布确认对话框
   - [ ] 等待发布完成
   - [ ] 检查 pioneer-cms 仓库是否有新提交
   - [ ] 检查 CDN 是否已更新

### 打包后测试

```bash
# 打包完成后，在 dist/ 目录中找到生成的 EXE

# 方式一：运行安装程序
./dist/能源门户管理系统\ Setup\ 0.1.0.exe

# 方式二：运行便携版
./dist/能源门户管理系统\ 0.1.0.exe
```

测试同上，确保所有功能正常工作。

## 📊 项目信息

```
应用名称: 能源门户管理系统
应用 ID: com.pioneer-cms.portal
当前版本: 0.1.0
开发者: Garland Wu
发布日期: 2026-07-31
```

## ⚙️ Electron Builder 配置详解

配置位置: `package.json` 的 `build` 字段

### NSIS (Windows 安装程序)
```json
{
  "oneClick": false,                           // 禁用一键安装
  "allowToChangeInstallationDirectory": true,  // 允许用户选择安装目录
  "createDesktopShortcut": true,              // 创建桌面快捷方式
  "createStartMenuShortcut": true             // 创建开始菜单快捷方式
}
```

### 构建目标
```json
{
  "nsis": {... },           // 安装程序版本
  "portable": {... }        // 便携版本
}
```

## 🔐 安全性建议

1. **代码签名** (可选，企业部署时推荐)
   - 添加代码签名证书以增强信任度
   - 编辑 `build` 配置中的 `certificateFile` 和 `certificatePassword`

2. **隐私政策**
   - 在应用中明确说明数据处理方式
   - 所有数据存储在本地，不上传云端

3. **权限管理**
   - Electron 应用在用户的计算机上运行
   - 确保用户了解应用的权限范围

## 🐛 常见问题

### Q: 如何在另一台电脑上运行?
A: 将 EXE 文件复制到另一台 Windows 计算机，直接运行即可。

### Q: 应用数据存储在哪里?
A: 
- CMS 数据库: `cms/payload.db` (SQLite)
- 网站数据: `out/` 目录
- 应用配置: 应用目录中

### Q: 如何卸载应用?
A: 使用 Windows 控制面板的"添加或删除程序"功能卸载。

### Q: 便携版和安装程序有什么区别?
A: 
- 安装程序: 需要安装，支持卸载，创建快捷方式
- 便携版: 无需安装，直接运行，可放在 U 盘

### Q: 如何更新应用?
A: 目前没有内置自动更新功能，需要手动下载新版本的 EXE 覆盖旧版本。

## 📞 技术支持

遇到问题？检查以下资源：

1. [Electron 文档](https://www.electronjs.org/docs)
2. [Electron Builder 文档](https://www.electron.build)
3. [项目 GitHub Issues](https://github.com/your-repo/issues)

## 🎓 相关命令参考

```bash
# 开发
npm run electron              # 启动 Electron (需要先运行 next dev)
npm run electron-dev          # 启动完整开发环境

# 构建
npm run build                 # 构建主站 (out/)
npm run electron-build        # 打包成 EXE

# 发布
npm run publish              # 执行一键发布流程
```

---

最后更新: 2026-07-31

#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   App Manager 打包脚本                        ║
║                                                                ║
║  检查 pkg 版本并尝试打包...                                    ║
╚════════════════════════════════════════════════════════════════╝
`);

try {
  // 尝试用最新的 pkg
  console.log('📦 正在尝试打包...\n');

  const cmd = `pkg app-manager.js --output dist/EnergyPortalManager.exe --targets win-x64 --compress Brotli`;

  console.log(`执行: ${cmd}\n`);

  execSync(cmd, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  console.log(`
✅ 打包成功！

📍 EXE 文件: dist/EnergyPortalManager.exe

🚀 运营人员可以直接双击运行！
  `);

} catch (err) {
  console.error(`
❌ pkg 打包失败

可能原因：
1. pkg 版本太旧，不支持当前 Node 版本
2. pkg 没有该 Node 版本的预编译二进制

解决方案：

方案 A：升级 pkg（推荐）
  npm install -g pkg@latest
  npm run app:build

方案 B：不打包 EXE，直接运行（最简单）
  运营人员只需在项目目录运行：
  npm install
  npm run app

方案 C：切换到 Node 20
  nvm use 20
  npm run app:build

方案 D：改用 Tauri（最轻量，支持 Node 24）
  需要额外配置 Rust，但完全解决版本问题
  详见项目文档
  `);

  process.exit(1);
}

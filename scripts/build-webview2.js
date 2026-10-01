#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const exeName = 'EnergyPortalManager.exe';
const outputDir = path.join(rootDir, 'dist');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              WebView2 EXE 打包工具                            ║
║              Energy Portal Manager Builder                     ║
╚════════════════════════════════════════════════════════════════╝
`);

try {
  // Step 1: 检查依赖
  console.log('📋 Step 1: 检查依赖环境...\n');

  let hasWebview = false;
  try {
    require.resolve('webview');
    hasWebview = true;
    console.log('  ✅ webview 包已安装');
  } catch {
    console.log('  ⚠️  webview 包未安装，正在安装...\n');
    try {
      execSync('npm install webview', { stdio: 'inherit' });
      hasWebview = true;
      console.log('  ✅ webview 包安装完成\n');
    } catch (err) {
      console.error('  ❌ 安装失败:', err.message);
      process.exit(1);
    }
  }

  // 检查 pkg
  let hasPkg = false;
  try {
    require.resolve('pkg');
    hasPkg = true;
    console.log('  ✅ pkg 包已安装');
  } catch {
    console.log('  ⚠️  pkg 包未安装（全局），正在全局安装...\n');
    try {
      execSync('npm install -g pkg', { stdio: 'inherit' });
      hasPkg = true;
      console.log('  ✅ pkg 全局安装完成\n');
    } catch (err) {
      console.error('  ❌ 全局安装失败，尝试本地安装...\n');
      try {
        execSync('npm install pkg --save-dev', { stdio: 'inherit' });
        hasPkg = true;
        console.log('  ✅ pkg 本地安装完成\n');
      } catch (err2) {
        console.error('  ❌ pkg 安装失败:', err2.message);
        process.exit(1);
      }
    }
  }

  // Step 2: 创建输出目录
  console.log('📂 Step 2: 准备输出目录...');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`  ✅ 已创建: ${outputDir}\n`);
  } else {
    console.log(`  ✅ 目录已存在: ${outputDir}\n`);
  }

  // Step 3: 验证入口文件
  console.log('✓ Step 3: 验证入口文件...');
  if (!fs.existsSync(path.join(rootDir, 'webview-main.js'))) {
    console.error('  ❌ webview-main.js 不存在！');
    process.exit(1);
  }
  if (!fs.existsSync(path.join(rootDir, 'webview-dashboard.html'))) {
    console.error('  ❌ webview-dashboard.html 不存在！');
    process.exit(1);
  }
  console.log('  ✅ 入口文件检查完成\n');

  // Step 4: 打包 EXE
  console.log('🔨 Step 4: 开始打包 EXE...\n');
  console.log('  这可能需要 2-5 分钟，请耐心等待...\n');

  const exePath = path.join(outputDir, exeName);
  const cmd = `pkg webview-main.js --output "${exePath}" --targets win-x64 --compress Brotli`;

  console.log(`  执行命令:\n  ${cmd}\n`);

  try {
    execSync(cmd, {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir
    });
  } catch (err) {
    console.error('\n  ❌ pkg 打包失败:', err.message);
    console.error('\n  故障排除：');
    console.error('  1. 确保 Node.js 版本 >= 18.0.0');
    console.error('  2. 尝试重新安装 pkg: npm install -g pkg@latest');
    console.error('  3. 检查硬盘空间是否充足');
    process.exit(1);
  }

  // Step 5: 验证输出
  console.log('\n✓ Step 5: 验证输出文件...');
  if (fs.existsSync(exePath)) {
    const fileSize = fs.statSync(exePath).size;
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
    console.log(`  ✅ EXE 文件已生成: ${exePath}`);
    console.log(`  📦 文件大小: ${fileSizeMB} MB\n`);
  } else {
    console.error('  ❌ EXE 文件生成失败！');
    process.exit(1);
  }

  // 完成
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    ✅ 打包完成！                              ║
╚════════════════════════════════════════════════════════════════╝

📍 EXE 文件路径:
   ${exePath}

🚀 使用方法:
   1. 双击 EXE 文件运行
   2. 会自动打开操作界面
   3. 点击按钮选择操作:
      • 🚀 启动 CMS (http://localhost:3001)
      • 🌐 预览网站 (http://localhost:5000)
      • 📦 一键发布 (自动构建 + Git推送)

💾 文件大小: 极小（5-8 MB）
⚡ 性能: WebView2 原生运行，极速启动
🔧 依赖: 无需额外安装，开箱即用

📝 分发建议:
   • 将 EXE 和项目目录一起打包
   • 用户双击 EXE 即可使用
   • 推荐放在项目根目录

⚠️  注意事项:
   • 首次运行可能需要下载 WebView2 运行时（如果未安装）
   • 确保项目目录结构完整（cms/, src/, scripts/ 等）
   • 保留所有必要的 npm 脚本和配置文件

📚 详细文档: 见 WEBVIEW2_GUIDE.md

  `);

} catch (error) {
  console.error(`\n❌ 打包失败:\n${error.message}\n`);
  process.exit(1);
}

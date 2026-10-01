const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const exeName = 'EnergyPortalManager.exe';
const outputDir = path.join(rootDir, 'dist');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 EXE 打包工具 (pkg 驱动)                        ║
╚════════════════════════════════════════════════════════════════╝
`);

try {
  // 检查 pkg 是否安装
  console.log('📦 检查 pkg 包...');
  try {
    require.resolve('pkg');
  } catch {
    console.log('❌ pkg 未安装，正在全局安装...\n');
    execSync('npm install -g pkg', { stdio: 'inherit' });
  }

  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 运行 pkg 命令
  console.log(`\n🔨 开始打包 EXE...\n`);
  console.log(`   入口: pkg-manager.js`);
  console.log(`   输出: ${path.join(outputDir, exeName)}`);
  console.log(`   包含: Node.js 运行时 + 完整项目\n`);

  const cmd = `pkg pkg-manager.js --output "${path.join(outputDir, exeName)}" --targets win-x64`;

  execSync(cmd, {
    stdio: 'inherit',
    shell: true,
    cwd: rootDir
  });

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                       ✅ 打包完成！                           ║
╚════════════════════════════════════════════════════════════════╝

📍 EXE 文件位置: ${path.join(outputDir, exeName)}

🚀 使用方法:
   1. 复制 EXE 文件到任何位置
   2. 双击运行
   3. 选择操作:
      - [1] 启动 CMS (http://localhost:3001)
      - [2] 预览网站 (http://localhost:5000)
      - [3] 一键发布 (自动构建 + Git推送)

💾 EXE 文件大小: ~60-80MB
   (包含 Node.js 运行时，可离线使用)

📝 注意:
   - 确保项目目录结构完整 (cms/, src/, scripts/ 等)
   - 首次运行 [1] 或 [3] 会自动安装依赖

  `);

} catch (error) {
  console.error(`\n❌ 打包失败:\n${error.message}\n`);
  process.exit(1);
}

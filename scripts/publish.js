const fs = require('fs');
const path = require('path');
const { execFileSync, execSync } = require('child_process');

const rootPath = process.cwd();
const outPath = path.join(rootPath, 'out');
const submodulePath = path.join(rootPath, 'pioneer-cms');

// 复制Out 内容到submodule, 再推送更新submodule

console.log('📦 发布流程开始\n');

// Step 1: 构建
console.log('🔨 Step 1: 执行构建...');
try {
  const cmsPath = path.join(rootPath, 'cms');
  const payloadCli = path.join(cmsPath, 'node_modules', 'payload', 'bin.js');
  const nextCli = path.join(rootPath, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (!fs.existsSync(payloadCli) || !fs.existsSync(nextCli)) {
    throw new Error('项目依赖未安装，请先安装根目录与 cms/ 的 npm 依赖');
  }
  execFileSync(process.execPath, [payloadCli, 'run', './src/scripts/export.ts'], {
    cwd: cmsPath,
    stdio: 'inherit',
    env: process.env,
  });
  execFileSync(process.execPath, [nextCli, 'build'], {
    cwd: rootPath,
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ 构建完成\n');
} catch (error) {
  console.error('❌ 构建失败');
  process.exit(1);
}

// Step 2: 清空submodule内容（保留.git）
// console.log('🧹 Step 2: 清理submodule目录...');
// try {
//   const items = fs.readdirSync(submodulePath);
//   items.forEach(item => {
//     if (item !== '.git' && item !== '.gitignore') {
//       const itemPath = path.join(submodulePath, item);
//       if (fs.lstatSync(itemPath).isDirectory()) {
//         fs.rmSync(itemPath, { recursive: true, force: true });
//       } else {
//         fs.unlinkSync(itemPath);
//       }
//     }
//   });
//   console.log('✅ submodule目录清理完成\n');
// } catch (error) {
//   console.error('❌ 清理失败:', error.message);
//   process.exit(1);
// }

// Step 3: 复制构建产物
// console.log('📋 Step 3: 复制构建产物...');
// try {
//   const copyRecursive = (src, dest) => {
//     if (!fs.existsSync(dest)) {
//       fs.mkdirSync(dest, { recursive: true });
//     }
//     const items = fs.readdirSync(src);
//     items.forEach(item => {
//       const srcPath = path.join(src, item);
//       const destPath = path.join(dest, item);
//       const stat = fs.lstatSync(srcPath);

//       if (stat.isDirectory()) {
//         copyRecursive(srcPath, destPath);
//       } else {
//         fs.copyFileSync(srcPath, destPath);
//       }
//     });
//   };

//   copyRecursive(outPath, submodulePath);
//   console.log('✅ 产物复制完成\n');
// } catch (error) {
//   console.error('❌ 复制失败:', error.message);
//   process.exit(1);
// }


// Step 4: Git提交与推送
console.log('🚀 Step 4: Git提交与推送...');
try {
  // ✅ 不用再指定 submodulePath 了，直接在项目根目录执行
  // 如果需要，可以设置 cwd 为当前脚本所在项目的根目录
  const cwd = { cwd: process.cwd(), shell: true };

  // 1. 确保在 main 分支
  try {
    execSync('git checkout master', { ...cwd, stdio: 'inherit' });
  } catch (e) {
    execSync('git checkout master', { ...cwd, stdio: 'inherit' }); // 兼容 master
  }

  // 2. 检查是否有变更
  const status = execSync('git status --porcelain', { ...cwd, encoding: 'utf-8' });

  if (!status.trim()) {
    console.log('ℹ️  没有变更，跳过提交');
  } else {
    // 3. 添加并提交
    execSync('git add -A', { ...cwd, stdio: 'inherit' });
    const now = new Date().toISOString().slice(0, 10);
    execSync(`git commit -m "Deploy ${now}"`, { ...cwd, stdio: 'inherit' });

    // 4. 拉取远程最新代码，防止冲突
    console.log('📥 拉取远程变更...');
    execSync('git pull --rebase origin main', { ...cwd, stdio: 'inherit' });

    // 5. 推送
    console.log('📤 推送到远程...');
    execSync('git push origin main', { ...cwd, stdio: 'inherit' });
    console.log('✅ 推送完成\n');
  }
} catch (error) {
  console.error('❌ Git操作失败:');
  console.error('STDERR:', error.stderr ? error.stderr.toString() : '无');
  console.error('Message:', error.message);
  process.exit(1);
}

console.log('🎉 发布完成！');

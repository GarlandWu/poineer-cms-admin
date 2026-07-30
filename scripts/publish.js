const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootPath = process.cwd();
const outPath = path.join(rootPath, 'out');
const submodulePath = path.join(rootPath, 'pioneer-cms');

console.log('📦 发布流程开始\n');

// Step 1: 构建
console.log('🔨 Step 1: 执行构建...');
try {
  execSync('cd ./cms && npm run export && cd .. && next build', {
    stdio: 'inherit',
    shell: true
  });
  console.log('✅ 构建完成\n');
} catch (error) {
  console.error('❌ 构建失败');
  process.exit(1);
}

// Step 2: 清空submodule内容（保留.git）
console.log('🧹 Step 2: 清理submodule目录...');
try {
  const items = fs.readdirSync(submodulePath);
  items.forEach(item => {
    if (item !== '.git' && item !== '.gitignore') {
      const itemPath = path.join(submodulePath, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(itemPath);
      }
    }
  });
  console.log('✅ submodule目录清理完成\n');
} catch (error) {
  console.error('❌ 清理失败:', error.message);
  process.exit(1);
}

// Step 3: 复制构建产物
console.log('📋 Step 3: 复制构建产物...');
try {
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.lstatSync(srcPath);

      if (stat.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };

  copyRecursive(outPath, submodulePath);
  console.log('✅ 产物复制完成\n');
} catch (error) {
  console.error('❌ 复制失败:', error.message);
  process.exit(1);
}

// Step 4: Git提交与推送
console.log('🚀 Step 4: Git提交与推送...');
try {
  // 进入submodule目录
  const cwd = { cwd: submodulePath, shell: true };

  // 检查是否有变更
  const status = execSync('git status --porcelain', { ...cwd, encoding: 'utf-8' });

  if (!status.trim()) {
    console.log('ℹ️  没有变更，跳过提交');
  } else {
    // 添加所有变更
    execSync('git add -A', { ...cwd, stdio: 'inherit' });

    // 获取当前日期和时间作为提交信息
    const now = new Date().toISOString().slice(0, 10);
    const commitMsg = `Deploy ${now}`;

    // 提交
    execSync(`git commit -m "${commitMsg}"`, { ...cwd, stdio: 'inherit' });

    // 推送
    execSync('git push origin main', { ...cwd, stdio: 'inherit' });
    console.log('✅ 推送完成\n');
  }
} catch (error) {
  console.error('❌ Git操作失败:', error.message);
  process.exit(1);
}

console.log('🎉 发布完成！');

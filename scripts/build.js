const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const distPath = path.join(process.cwd(), 'out', 'pioneer-cms');
const gitPath = path.join(distPath, '.git');
const gitBackupPath = path.join(process.cwd(), '.git-submodule-backup');

// 执行构建
console.log('🔨 构建中...');
try {
  execSync('cd ./cms && npm run export && cd ../ && next build', {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  console.error('❌ 构建失败');
  process.exit(1);
}
 

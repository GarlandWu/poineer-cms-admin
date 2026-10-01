#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const ROOT_DIR = __dirname;
const CMS_DIR = path.join(ROOT_DIR, 'cms');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function banner() {
  console.clear();
  log('cyan', `
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           能源数字孪生门户 CMS 发布管理工具                    ║
║                  Energy Portal Manager v0.1                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}

function showMenu() {
  banner();
  console.log(`
${colors.bright}请选择操作:${colors.reset}

  ${colors.green}[1]${colors.reset} 启动 CMS 后台
  ${colors.green}[2]${colors.reset} 预览站点 (本地构建产物)
  ${colors.green}[3]${colors.reset} 一键发布 (构建 + 推送)
  ${colors.yellow}[0]${colors.reset} 退出

`);
}

function runCommand(cmd, args, cwd = ROOT_DIR, label = '') {
  return new Promise((resolve, reject) => {
    log('yellow', `\n▶ ${label || cmd}`);

    const proc = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    proc.on('close', (code) => {
      if (code === 0) {
        log('green', `✅ ${label || cmd} 完成\n`);
        resolve();
      } else {
        log('red', `❌ ${label || cmd} 失败 (exit code: ${code})\n`);
        reject(new Error(`${label || cmd} failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      log('red', `❌ 错误: ${err.message}\n`);
      reject(err);
    });
  });
}

async function startCMS() {
  if (!fs.existsSync(CMS_DIR)) {
    log('red', `❌ CMS 目录不存在: ${CMS_DIR}`);
    return;
  }

  return new Promise((resolve) => {
    try {
      log('cyan', '\n🚀 正在启动 CMS 后台...');
      log('yellow', '💡 访问地址: http://localhost:3001');
      log('yellow', '⌨️  按 Ctrl+C 停止\n');

      const proc = spawn('npm', ['run', 'dev'], {
        cwd: CMS_DIR,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      });

      proc.on('close', (code) => {
        if (code === 0 || code === null) {
          log('yellow', '\n✋ CMS 已停止');
        } else {
          log('red', `\n❌ CMS 异常退出 (code: ${code})`);
        }
        resolve();
      });

      proc.on('error', (err) => {
        log('red', `❌ CMS 启动失败: ${err.message}`);
        resolve();
      });
    } catch (err) {
      log('red', `❌ ${err.message}`);
      resolve();
    }
  });
}

async function previewSite() {
  const outDir = path.join(ROOT_DIR, 'out');

  if (!fs.existsSync(outDir)) {
    log('yellow', '\n⚠️  产物目录不存在，正在执行构建...');
    try {
      await runCommand('node', ['scripts/build.js'], ROOT_DIR, '构建主站点');
    } catch (err) {
      log('red', `❌ 构建失败: ${err.message}`);
      return;
    }
  }

  return new Promise((resolve) => {
    try {
      log('cyan', '\n🌐 正在启动预览服务器...');
      log('yellow', '💡 访问地址: http://localhost:5000');
      log('yellow', '⌨️  按 Ctrl+C 停止\n');

      const proc = spawn('npx', ['--yes', 'serve', 'out', '-l', '5000'], {
        cwd: ROOT_DIR,
        stdio: 'inherit',
        shell: process.platform === 'win32'
      });

      proc.on('close', (code) => {
        if (code === 0 || code === null) {
          log('yellow', '\n✋ 预览服务已停止');
        } else {
          log('red', `\n❌ 预览服务异常退出 (code: ${code})`);
        }
        resolve();
      });

      proc.on('error', (err) => {
        log('red', `❌ 预览服务启动失败: ${err.message}`);
        resolve();
      });
    } catch (err) {
      log('red', `❌ ${err.message}`);
      resolve();
    }
  });
}

async function publishSite() {
  try {
    log('cyan', '\n📦 开始发布流程...\n');
    await runCommand('node', ['scripts/publish.js'], ROOT_DIR, '执行发布脚本');
    log('green', '🎉 发布完成！\n');
  } catch (err) {
    log('red', `❌ 发布失败: ${err.message}`);
  }
}

function askChoice() {
  return new Promise((resolve) => {
    rl.question(`${colors.bright}请选择 (0-3): ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  showMenu();

  const choice = await askChoice();

  switch (choice) {
    case '1':
      await startCMS();
      await new Promise(r => setTimeout(r, 1000));
      await main();
      break;
    case '2':
      await previewSite();
      await new Promise(r => setTimeout(r, 1000));
      await main();
      break;
    case '3':
      await publishSite();
      await new Promise(r => setTimeout(r, 2000));
      await main();
      break;
    case '0':
      log('green', '\n👋 再见！\n');
      rl.close();
      process.exit(0);
      break;
    default:
      log('red', '\n❌ 无效选择，请重试\n');
      await new Promise(r => setTimeout(r, 1000));
      await main();
  }
}

// 启动
main().catch((err) => {
  log('red', `\n❌ 严重错误: ${err.message}`);
  process.exit(1);
});

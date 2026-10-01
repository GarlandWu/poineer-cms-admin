#!/usr/bin/env node

const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const { execSync } = require('child_process');

const PORT = 3010;
const ROOT_DIR = __dirname;
const processes = {};

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync(path.join(__dirname, 'dashboard.html')));
  } else if (req.url === '/app.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(fs.readFileSync(path.join(__dirname, 'dashboard-app.js')));
  } else if (req.url === '/api/command' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { cmd } = JSON.parse(body);
      handleCommand(cmd);
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true }));
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

function handleCommand(cmd) {
  console.log(`📋 执行: ${cmd}`);

  switch (cmd) {
    case 'start-cms':
      startCMS();
      break;
    case 'preview':
      previewSite();
      break;
    case 'publish':
      publishSite();
      break;
  }
}

function startCMS() {
  if (processes.cms) {
    console.log('❌ CMS 已在运行');
    return;
  }

  console.log('🚀 启动 CMS...');
  const proc = spawn('npm', ['run', 'dev'], {
    cwd: path.join(ROOT_DIR, 'cms'),
    stdio: 'inherit',
    shell: true
  });

  processes.cms = proc;

  // 延迟后自动打开浏览器
  setTimeout(() => {
    openBrowser('http://localhost:3001');
  }, 2000);

  proc.on('close', () => {
    console.log('✋ CMS 已停止');
    processes.cms = null;
  });
}

function previewSite() {
  const outDir = path.join(ROOT_DIR, 'out');

  if (!fs.existsSync(outDir)) {
    console.log('⚠️ 构建中...');
    spawn('node', ['scripts/build.js'], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      shell: true
    }).on('close', () => {
      startPreview();
    });
  } else {
    startPreview();
  }
}

function startPreview() {
  if (processes.preview) {
    console.log('❌ 预览已在运行');
    return;
  }

  console.log('🌐 启动预览...');
  const proc = spawn('npx', ['--yes', 'serve', 'out', '-l', '5000'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  processes.preview = proc;

  setTimeout(() => {
    openBrowser('http://localhost:5000');
  }, 1500);

  proc.on('close', () => {
    console.log('✋ 预览已停止');
    processes.preview = null;
  });
}

function publishSite() {
  console.log('📦 发布中...');
  spawn('node', ['scripts/publish.js'], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  }).on('close', (code) => {
    if (code === 0) {
      console.log('✅ 发布完成');
    } else {
      console.log('❌ 发布失败');
    }
  });
}

function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      execSync(`start ${url}`);
    } else if (process.platform === 'darwin') {
      execSync(`open ${url}`);
    } else {
      execSync(`xdg-open ${url}`);
    }
    console.log(`🌐 已打开: ${url}`);
  } catch (err) {
    console.error(`无法打开浏览器: ${err.message}`);
  }
}

// 启动服务
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  ⚡ 能源门户管理工具                           ║
║                                                                ║
║               在浏览器打开: http://localhost:${PORT}         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);

  // 自动打开浏览器
  setTimeout(() => {
    openBrowser(`http://localhost:${PORT}`);
  }, 500);
});

process.on('SIGINT', () => {
  console.log('\n\n🧹 清理进程...');
  if (processes.cms) processes.cms.kill();
  if (processes.preview) processes.preview.kill();
  server.close();
  process.exit(0);
});

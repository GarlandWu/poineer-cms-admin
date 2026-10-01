#!/usr/bin/env node

const { WebView } = require('webview2');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const PORT = 3010;
const ROOT_DIR = __dirname;

// 存储进程引用便于管理
const processes = {};

// 创建本地 HTTP 服务提供 dashboard
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 静态文件路由
  let filePath = path.join(__dirname, 'webview-dashboard.html');
  let contentType = 'text/html';

  if (req.url === '/app.js') {
    filePath = path.join(__dirname, 'webview-app.js');
    contentType = 'text/javascript';
  } else if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ running: true }));
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT);

// 创建 WebView 窗口
const webview = new WebView(
  {
    title: '⚡ 能源门户管理工具',
    url: `http://localhost:${PORT}`,
    width: 500,
    height: 700,
    resizable: false,
    debug: false
  }
);

// 命令处理函数
function handleCommand(command, args = {}) {
  console.log(`📋 执行命令: ${command}`);

  switch (command) {
    case 'start-cms':
      startCMS();
      break;
    case 'preview-site':
      previewSite();
      break;
    case 'publish-site':
      publishSite();
      break;
    case 'stop-cms':
      stopCMS();
      break;
    case 'open-url':
      openURL(args.url);
      break;
    default:
      console.log(`未知命令: ${command}`);
  }
}

// 启动 CMS
function startCMS() {
  if (processes.cms) {
    webview.eval(`window.updateStatus("❌ CMS 已在运行中！", "error")`);
    return;
  }

  webview.eval(`window.updateStatus("⏳ 正在启动 CMS...", "info")`);
  console.log('🚀 启动 CMS...');

  const proc = spawn('npm', ['run', 'dev'], {
    cwd: path.join(ROOT_DIR, 'cms'),
    stdio: 'pipe',
    shell: true
  });

  processes.cms = proc;

  let output = '';
  proc.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[CMS] ${data}`);
    // 检查是否启动成功
    if (output.includes('localhost:3001') && !processes.cms.notified) {
      processes.cms.notified = true;
      setTimeout(() => {
        webview.eval(`window.updateStatus("✅ CMS 已启动！", "success", "http://localhost:3001")`);
      }, 1000);
    }
  });

  proc.stderr.on('data', (data) => {
    console.error(`[CMS Error] ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`CMS 进程已退出，代码: ${code}`);
    processes.cms = null;
    webview.eval(`window.updateStatus("✋ CMS 已停止", "info")`);
  });

  proc.on('error', (err) => {
    console.error(`启动 CMS 失败: ${err.message}`);
    processes.cms = null;
    webview.eval(`window.updateStatus("❌ CMS 启动失败: ${err.message}", "error")`);
  });
}

// 预览网站
function previewSite() {
  webview.eval(`window.updateStatus("⏳ 正在启动预览服务...", "info")`);
  console.log('🌐 启动预览服务...');

  // 检查 out 目录
  const outDir = path.join(ROOT_DIR, 'out');
  if (!fs.existsSync(outDir)) {
    webview.eval(`window.updateStatus("⚠️ 产物目录不存在，正在构建...", "info")`);
    console.log('构建站点...');

    const buildProc = spawn('node', ['scripts/build.js'], {
      cwd: ROOT_DIR,
      stdio: 'inherit',
      shell: true
    });

    buildProc.on('close', (code) => {
      if (code === 0) {
        startPreviewServer();
      } else {
        webview.eval(`window.updateStatus("❌ 构建失败", "error")`);
      }
    });
  } else {
    startPreviewServer();
  }
}

function startPreviewServer() {
  if (processes.preview) {
    webview.eval(`window.updateStatus("❌ 预览服务已在运行中！", "error")`);
    return;
  }

  const proc = spawn('npx', ['--yes', 'serve', 'out', '-l', '5000'], {
    cwd: ROOT_DIR,
    stdio: 'pipe',
    shell: true
  });

  processes.preview = proc;

  let output = '';
  proc.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[Preview] ${data}`);
    if (output.includes('5000') && !processes.preview.notified) {
      processes.preview.notified = true;
      setTimeout(() => {
        webview.eval(`window.updateStatus("✅ 预览服务已启动！", "success", "http://localhost:5000")`);
      }, 1000);
    }
  });

  proc.stderr.on('data', (data) => {
    console.error(`[Preview Error] ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`预览服务已退出，代码: ${code}`);
    processes.preview = null;
    webview.eval(`window.updateStatus("✋ 预览服务已停止", "info")`);
  });

  proc.on('error', (err) => {
    console.error(`启动预览服务失败: ${err.message}`);
    processes.preview = null;
    webview.eval(`window.updateStatus("❌ 预览服务启动失败: ${err.message}", "error")`);
  });
}

// 一键发布
function publishSite() {
  const confirmed = webview.eval(`confirm('确认要发布吗？这将构建站点并推送到 Git 服务器。')`);
  if (!confirmed) return;

  webview.eval(`window.updateStatus("⏳ 发布中... 这可能需要 5-10 分钟，请耐心等待", "info")`);
  console.log('📦 开始发布流程...');

  const proc = spawn('node', ['scripts/publish.js'], {
    cwd: ROOT_DIR,
    stdio: 'pipe',
    shell: true
  });

  let output = '';
  proc.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`[Publish] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[Publish Error] ${data}`);
  });

  proc.on('close', (code) => {
    if (code === 0) {
      console.log('✅ 发布完成');
      webview.eval(`window.updateStatus("✅ 发布完成！站点已推送到服务器", "success")`);
    } else {
      console.error(`发布失败，代码: ${code}`);
      webview.eval(`window.updateStatus("❌ 发布失败，请查看控制台输出", "error")`);
    }
  });

  proc.on('error', (err) => {
    console.error(`发布失败: ${err.message}`);
    webview.eval(`window.updateStatus("❌ 发布失败: ${err.message}", "error")`);
  });
}

// 停止 CMS
function stopCMS() {
  if (processes.cms) {
    processes.cms.kill();
    processes.cms = null;
    console.log('✋ CMS 已停止');
  }
}

// 打开 URL（自动打开浏览器）
function openURL(url) {
  const { execSync } = require('child_process');
  try {
    if (process.platform === 'win32') {
      execSync(`start ${url}`);
    } else if (process.platform === 'darwin') {
      execSync(`open ${url}`);
    } else {
      execSync(`xdg-open ${url}`);
    }
  } catch (err) {
    console.error(`打开 URL 失败: ${err.message}`);
  }
}

// 监听 WebView 消息
webview.on('message', (data) => {
  console.log('📩 收到消息:', data);
  if (typeof data === 'string') {
    const { cmd, args } = JSON.parse(data);
    handleCommand(cmd, args);
  }
});

// 清理进程
function cleanup() {
  console.log('\n🧹 清理进程...');
  if (processes.cms) processes.cms.kill();
  if (processes.preview) processes.preview.kill();
  server.close();
  process.exit(0);
}

webview.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║          ⚡ 能源门户管理工具 (WebView2)                        ║
║                                                                ║
║          启动 UI 服务: http://localhost:${PORT}              ║
║          请勿关闭此窗口，WebView 已打开                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

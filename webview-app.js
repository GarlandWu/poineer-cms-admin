// WebView2 前端逻辑

// 更新状态显示
function updateStatus(text, type = 'info', url = null) {
  const statusEl = document.getElementById('status');
  const urlEl = document.getElementById('urlLink');
  const statusUrl = document.getElementById('statusUrl');

  // 更新状态文本和样式
  statusEl.textContent = text;
  statusEl.className = `status ${type}`;

  // 更新 URL 链接
  if (url) {
    statusUrl.href = url;
    statusUrl.textContent = url;
    urlEl.classList.add('show');

    // 延迟自动打开浏览器
    setTimeout(() => {
      openURL(url);
    }, 500);
  } else {
    urlEl.classList.remove('show');
  }
}

// 通过 WebView API 发送消息到 Rust 后端
function sendCommand(command, args = {}) {
  try {
    // 使用 external 对象发送消息（WebView 提供）
    if (window.external && window.external.invoke) {
      // 某些 WebView 库使用 invoke
      window.external.invoke(JSON.stringify({ cmd: command, args }));
    } else {
      // 备用方案：通过 message 事件
      window.external.postMessage(JSON.stringify({ cmd: command, args }));
    }
  } catch (err) {
    console.error('发送命令失败:', err);
    updateStatus(`❌ 通信错误: ${err.message}`, 'error');
  }
}

// 打开 URL（调用后端打开浏览器）
function openURL(url) {
  sendCommand('open-url', { url });
}

// 启动 CMS
function startCMS() {
  const button = event.target.closest('.button');
  button.disabled = true;

  updateStatus('⏳ 正在启动 CMS...', 'info');
  sendCommand('start-cms');

  // 设置超时自动启用按钮
  setTimeout(() => {
    button.disabled = false;
  }, 2000);
}

// 预览网站
function previewSite() {
  const button = event.target.closest('.button');
  button.disabled = true;

  updateStatus('⏳ 正在启动预览服务...', 'info');
  sendCommand('preview-site');

  // 设置超时自动启用按钮
  setTimeout(() => {
    button.disabled = false;
  }, 2000);
}

// 一键发布
function publishSite() {
  const confirmed = confirm('确认要发布吗？\n\n这将自动执行以下操作：\n1. 构建 CMS 数据\n2. 编译 Next.js 站点\n3. 推送到 Git 服务器\n\n这可能需要 5-10 分钟。');
  if (!confirmed) {
    updateStatus('❌ 发布已取消', 'info');
    return;
  }

  const button = event.target.closest('.button');
  button.disabled = true;

  updateStatus('⏳ 发布中...\n\n这可能需要 5-10 分钟，请耐心等待', 'info');
  sendCommand('publish-site');

  // 发布可能需要较长时间，设置较长的超时
  setTimeout(() => {
    button.disabled = false;
  }, 5000);
}

// 全局消息处理（来自 Rust 后端）
window.addEventListener('message', (event) => {
  console.log('收到后端消息:', event.data);
  const data = event.data;

  if (data.status) {
    updateStatus(data.status, 'success', data.url);
  } else if (data.error) {
    updateStatus(`❌ ${data.error}`, 'error');
  }
});

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ WebView2 仪表盘已加载');

  // 检查是否有 external 对象（WebView 支持）
  if (!window.external) {
    console.warn('⚠️ WebView external API 不可用，某些功能可能无法工作');
  }

  // 可选：定期检查连接状态
  setInterval(() => {
    try {
      fetch('http://localhost:3010/api/status')
        .then(r => r.json())
        .catch(() => {
          console.warn('后端服务可能已断开连接');
        });
    } catch (err) {
      // 忽略错误
    }
  }, 5000);
});

// 错误处理
window.addEventListener('error', (event) => {
  console.error('页面错误:', event);
  updateStatus(`❌ 页面错误: ${event.message}`, 'error');
});

// 禁用右键菜单（可选，增加专业感）
document.addEventListener('contextmenu', (e) => {
  // e.preventDefault(); // 取消注释以禁用右键菜单
});

console.log('✅ WebView2 应用脚本已加载');

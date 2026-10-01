const statusEl = document.getElementById('status');

async function sendCmd(cmd) {
  const button = event.target;
  button.disabled = true;

  try {
    statusEl.textContent = '⏳ 正在执行...';
    statusEl.className = 'status';

    const response = await fetch('/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd })
    });

    if (response.ok) {
      if (cmd === 'start-cms') {
        statusEl.textContent = '✅ CMS 已启动！(http://localhost:3001)';
        statusEl.className = 'status success';
      } else if (cmd === 'preview') {
        statusEl.textContent = '✅ 预览服务已启动！(http://localhost:5000)';
        statusEl.className = 'status success';
      } else if (cmd === 'publish') {
        statusEl.textContent = '✅ 发布完成！';
        statusEl.className = 'status success';
      }
    } else {
      statusEl.textContent = '❌ 命令执行出错';
      statusEl.className = 'status error';
    }
  } catch (err) {
    statusEl.textContent = `❌ 错误: ${err.message}`;
    statusEl.className = 'status error';
  } finally {
    setTimeout(() => {
      button.disabled = false;
    }, 1000);
  }
}

// UI Elements
const rootPathEl = document.getElementById('root-path');
const rootChangeBtn = document.getElementById('root-change-btn');

const cmsStartBtn = document.getElementById('cms-start-btn');
const cmsStopBtn = document.getElementById('cms-stop-btn');
const cmsBadge = document.getElementById('cms-badge');
const cmsLog = document.getElementById('cms-log');
const cmsOpenLink = document.getElementById('cms-open-link');
const cmsOpenInApp = document.getElementById('cms-open-inapp');

const buildBtn = document.getElementById('build-btn');
const previewStartBtn = document.getElementById('preview-start-btn');
const previewStopBtn = document.getElementById('preview-stop-btn');
const previewBadge = document.getElementById('preview-badge');
const previewLog = document.getElementById('preview-log');
const previewOpenLink = document.getElementById('preview-open-link');
const previewFolderLink = document.getElementById('preview-folder-link');

const publishBtn = document.getElementById('publish-btn');
const publishLog = document.getElementById('publish-log');
const buildLog = document.getElementById('build-log');

const CMS_URL = 'http://localhost:3001/admin';
const PREVIEW_URL = 'http://localhost:5000';

// 日志管理
class LogManager {
  constructor(container) {
    this.container = container;
  }

  clear() {
    this.container.innerHTML = '';
  }

  add(message, type = 'info') {
    if (this.container.querySelector('.log-empty')) this.clear();
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.textContent = message;
    this.container.appendChild(line);
    // 只保留最近 500 行，避免长时间运行后内存膨胀
    while (this.container.childElementCount > 500) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.scrollTop = this.container.scrollHeight;
  }

  setEmpty(message = '等待操作...') {
    this.container.innerHTML = `<p class="log-empty">${message}</p>`;
  }
}

const logManagers = {
  cms: new LogManager(cmsLog),
  preview: new LogManager(previewLog),
  publish: new LogManager(publishLog),
  build: new LogManager(buildLog),
};

// 项目目录
rootChangeBtn.addEventListener('click', async () => {
  const result = await window.electron.app.chooseRoot();
  logManagers.cms.add(result.message, result.success ? 'success' : 'error');
  if (result.success) {
    rootPathEl.textContent = result.projectRoot;
    updateCmsStatus(false);
    updatePreviewStatus(false);
  }
});

window.electron.app.onRootMissing(() => {
  rootPathEl.textContent = '未找到项目目录';
  logManagers.cms.add('未找到项目根目录，请点击右上角「更改目录」选择包含 cms/ 的项目根目录', 'error');
  setBusy(true);
});

// CMS 控制
cmsStartBtn.addEventListener('click', async () => {
  cmsStartBtn.disabled = true;
  logManagers.cms.add('正在启动 CMS...', 'info');

  const result = await window.electron.cms.start();
  logManagers.cms.add(result.message, result.success ? 'success' : 'error');
  if (result.success) updateCmsStatus(true);
  else cmsStartBtn.disabled = false;
});

cmsStopBtn.addEventListener('click', async () => {
  cmsStopBtn.disabled = true;
  const result = await window.electron.cms.stop();
  logManagers.cms.add(result.message, 'info');
  updateCmsStatus(false);
});

cmsOpenInApp.addEventListener('click', async (event) => {
  event.preventDefault();
  const result = await window.electron.cms.openWindow();
  if (!result.success) logManagers.cms.add(result.message, 'error');
});

cmsOpenLink.addEventListener('click', (event) => {
  event.preventDefault();
  window.electron.app.openUrl(CMS_URL);
});

window.electron.cms.onLog((data) => logManagers.cms.add(data, 'info'));
window.electron.cms.onStarted(() => updateCmsStatus(true));
window.electron.cms.onStopped(() => updateCmsStatus(false));

// 构建
buildBtn.addEventListener('click', async () => {
  buildBtn.disabled = true;
  publishBtn.disabled = true;
  logManagers.build.clear();
  logManagers.build.add('开始构建...', 'info');

  const result = await window.electron.build.execute();
  logManagers.build.add(
    result.success ? '✅ 构建完成，可以启动预览了' : `❌ 构建失败: ${result.message}`,
    result.success ? 'success' : 'error'
  );
  buildBtn.disabled = false;
  publishBtn.disabled = false;
});

window.electron.build.onLog((data) => logManagers.build.add(data, 'info'));

// 预览
previewStartBtn.addEventListener('click', async () => {
  previewStartBtn.disabled = true;
  logManagers.preview.add('正在启动预览服务...', 'info');

  const result = await window.electron.preview.start();
  logManagers.preview.add(result.message, result.success ? 'success' : 'error');
  if (result.success) updatePreviewStatus(true);
  else previewStartBtn.disabled = false;
});

previewStopBtn.addEventListener('click', async () => {
  previewStopBtn.disabled = true;
  const result = await window.electron.preview.stop();
  logManagers.preview.add(result.message, 'info');
  updatePreviewStatus(false);
});

previewOpenLink.addEventListener('click', (event) => {
  event.preventDefault();
  window.electron.app.openUrl(PREVIEW_URL);
});

previewFolderLink.addEventListener('click', (event) => {
  event.preventDefault();
  window.electron.app.openFolder('out');
});

window.electron.preview.onLog((data) => logManagers.preview.add(data, 'info'));
window.electron.preview.onStarted(() => updatePreviewStatus(true));
window.electron.preview.onStopped(() => updatePreviewStatus(false));

// 一键发布
publishBtn.addEventListener('click', async () => {
  const confirmed = confirm(
    '⚠️ 即将发布门户主站到远程仓库\n\n' +
      '流程:\n' +
      '1. 导出 CMS 数据\n' +
      '2. 构建主站\n' +
      '3. 清理 submodule\n' +
      '4. 复制构建产物\n' +
      '5. Git 提交并推送\n\n' +
      '确认继续？'
  );
  if (!confirmed) return;

  publishBtn.disabled = true;
  buildBtn.disabled = true;
  logManagers.publish.clear();
  logManagers.publish.add('🚀 开始发布流程...', 'info');

  const result = await window.electron.publish.execute();
  logManagers.publish.add(
    result.success ? '✅ 发布完成，网站已推送到远程仓库' : `❌ 发布失败: ${result.message}`,
    result.success ? 'success' : 'error'
  );
  publishBtn.disabled = false;
  buildBtn.disabled = false;
});

window.electron.publish.onLog((data) => logManagers.publish.add(data, 'info'));

// 状态更新
function updateCmsStatus(running) {
  cmsBadge.textContent = running ? '运行中' : '未运行';
  cmsBadge.classList.toggle('running', running);
  cmsStartBtn.disabled = running;
  cmsStopBtn.disabled = !running;
  cmsOpenLink.style.display = running ? 'inline-flex' : 'none';
  cmsOpenInApp.style.display = running ? 'inline-flex' : 'none';
}

function updatePreviewStatus(running) {
  previewBadge.textContent = running ? '运行中' : '未运行';
  previewBadge.classList.toggle('running', running);
  previewStartBtn.disabled = running;
  previewStopBtn.disabled = !running;
  previewOpenLink.style.display = running ? 'inline-flex' : 'none';
  previewFolderLink.style.display = running ? 'inline-flex' : 'none';
}

/** 项目目录缺失时禁用所有操作按钮 */
function setBusy(disabled) {
  [cmsStartBtn, cmsStopBtn, buildBtn, previewStartBtn, previewStopBtn, publishBtn].forEach((btn) => {
    btn.disabled = disabled;
  });
}

// 初始化
async function init() {
  document.getElementById('timestamp').textContent = new Date().toLocaleString();

  logManagers.cms.setEmpty('CMS 启动中...');
  logManagers.preview.setEmpty('预览服务未在运行');
  logManagers.publish.setEmpty('等待执行发布');
  logManagers.build.setEmpty('等待构建');

  const status = await window.electron.app.getStatus();
  rootPathEl.textContent = status.projectRoot || '未找到项目目录';
  updateCmsStatus(status.cmsRunning);
  updatePreviewStatus(status.previewRunning);
}

init();

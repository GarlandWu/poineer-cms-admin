const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const { spawn, execFile } = require('child_process');

const CMS_PORT = 3001;
const PREVIEW_PORT = 5000;

let mainWindow = null;
let cmsWindow = null;

/** 长驻服务进程：{ cms, preview } */
const services = { cms: null, preview: null };
/** 一次性任务进程：{ build, publish } */
const tasks = { build: null, publish: null };

/** 项目根目录（可持久化在 userData/config.json） */
let projectRoot = null;

// ---------------------------------------------------------------- 配置持久化

const configFile = () => path.join(app.getPath('userData'), 'config.json');

const readConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(configFile(), 'utf-8'));
  } catch {
    return {};
  }
};

const writeConfig = (patch) => {
  try {
    const next = { ...readConfig(), ...patch };
    fs.mkdirSync(path.dirname(configFile()), { recursive: true });
    fs.writeFileSync(configFile(), JSON.stringify(next, null, 2), 'utf-8');
  } catch (error) {
    console.error('写入配置失败:', error.message);
  }
};

// ------------------------------------------------------------ 项目根目录解析

/** 一个合法的项目根必须同时具备 package.json / cms / scripts/publish.js */
const isValidRoot = (dir) => {
  if (!dir) return false;
  try {
    return (
      fs.existsSync(path.join(dir, 'package.json')) &&
      fs.existsSync(path.join(dir, 'cms')) &&
      fs.existsSync(path.join(dir, 'scripts', 'publish.js'))
    );
  } catch {
    return false;
  }
};

/**
 * 依次尝试：环境变量 → 上次选择 → 随包内容(asar:false 时即 resources/app)
 * → exe 同级目录 → exe 上级目录。开发态下第三项即仓库根目录。
 */
const resolveProjectRoot = () => {
  // portable 版 exe 会解压到临时目录运行，PORTABLE_EXECUTABLE_DIR 才是 exe 真实所在目录
  const exeDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe'));
  const candidates = [
    process.env.PORTAL_PROJECT_ROOT,
    readConfig().projectRoot,
    path.join(__dirname, '..'),
    exeDir,
    path.join(exeDir, '..'),
  ];
  return candidates.find(isValidRoot) || null;
};

// ------------------------------------------------------------------ 工具函数

const isPortInUse = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => server.close(() => resolve(false)));
    server.listen(port, '127.0.0.1');
  });

const send = (channel, payload) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
};

/** Windows 下必须整棵进程树杀掉，否则 next dev / serve 的子进程会残留 */
const killTree = (child) =>
  new Promise((resolve) => {
    if (!child || child.exitCode !== null) return resolve();
    if (process.platform === 'win32') {
      execFile('taskkill', ['/PID', String(child.pid), '/T', '/F'], () => resolve());
    } else {
      try {
        child.kill('SIGTERM');
      } catch {
        /* 已退出 */
      }
      resolve();
    }
  });

/** 启动子进程，并把 stdout/stderr 逐行推送到渲染进程的 `${id}-log` 频道 */
/** 启动子进程，并把 stdout/stderr 逐行推送到渲染进程的 `${logId}-log` 频道 */
const spawnLogged = (id, command, args, cwd, logId = id) => {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    windowsHide: true,
    env: { ...process.env, FORCE_COLOR: '0' },
  });

  const pump = (stream) => {
    if (!stream) return;
    stream.setEncoding('utf-8');
    stream.on('data', (chunk) => {
      chunk
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .forEach((line) => send(`${logId}-log`, line));
    });
  };

  pump(child.stdout);
  pump(child.stderr);
  return child;
};

/** 一次性任务：跑完即返回结果 */
const runTask = (id, command, args, cwd, logId = id) =>
  new Promise((resolve) => {
    if (tasks[id]) return resolve({ success: false, message: '该任务正在执行中' });

    const child = spawnLogged(id, command, args, cwd, logId);
    tasks[id] = child;

    child.on('error', (error) => {
      tasks[id] = null;
      send(`${logId}-log`, `启动失败: ${error.message}`);
      resolve({ success: false, message: error.message });
    });

    child.on('close', (code) => {
      tasks[id] = null;
      resolve(
        code === 0
          ? { success: true, message: '执行完成' }
          : { success: false, message: `进程退出码 ${code}` }
      );
    });
  });

/** 长驻服务：轮询端口确认真的起来了，而不是死等固定秒数 */
const startService = async (id, command, args, cwd, port, readyMessage) => {
  if (services[id]) return { success: false, message: '服务已在运行' };
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };

  if (await isPortInUse(port)) {
    return { success: false, message: `端口 ${port} 已被占用，请先关闭占用该端口的程序` };
  }

  const child = spawnLogged(id, command, args, cwd);
  services[id] = child;

  child.on('error', (error) => {
    services[id] = null;
    send(`${id}-log`, `启动失败: ${error.message}`);
    send(`${id}-stopped`);
  });

  child.on('close', (code) => {
    services[id] = null;
    send(`${id}-log`, `进程已退出 (代码 ${code})`);
    send(`${id}-stopped`);
  });

  for (let i = 0; i < 120; i += 1) {
    if (!services[id]) return { success: false, message: '服务启动失败，请查看日志' };
    if (await isPortInUse(port)) {
      send(`${id}-started`);
      return { success: true, message: readyMessage };
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  return { success: false, message: '服务启动超时（60 秒），请查看日志' };
};

const stopService = async (id) => {
  if (!services[id]) return { success: true, message: '服务未在运行' };
  const child = services[id];
  services[id] = null;
  await killTree(child);
  send(`${id}-stopped`);
  return { success: true, message: '服务已停止' };
};

// ------------------------------------------------------------ CMS 启动流程

/**
 * 启动 CMS：安装依赖 → 生成 importmap → 启动 dev 服务。
 * npm install 与 generate:importmap 均在 cms/ 子目录中执行。
 */
const startCms = async () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };
  if (services.cms) return { success: false, message: 'CMS 已在运行' };

  const cmsDir = path.join(projectRoot, 'cms');

  if (!fs.existsSync(path.join(cmsDir, 'node_modules'))) { 
    send('cms-log', '[1/3] 安装依赖 (npm install) ...');
    const installed = await runTask('cms-setup', 'npm', ['install'], cmsDir, 'cms');
    if (!installed.success) {
      return { success: false, message: `依赖安装失败：${installed.message}` };
    } 
  }
  

  send('cms-log', '[2/3] 生成 importmap (npm run generate:importmap) ...');
  const generated = await runTask('cms-setup', 'npm', ['run', 'generate:importmap'], cmsDir, 'cms');
  if (!generated.success) {
    return { success: false, message: `importmap 生成失败：${generated.message}` };
  }

  send('cms-log', '[3/3] 启动 CMS 开发服务 ...');
  return startService(
    'cms',
    'npm',
    ['run', 'dev'],
    cmsDir,
    CMS_PORT,
    `CMS 已启动：http://localhost:${CMS_PORT}/admin`
  );
};

// ------------------------------------------------------- 预览服务启动流程

/**
 * 启动预览：安装依赖 → serve out/。
 * npm install 在项目根目录执行（serve 本身走 npx，无需本地安装）。
 */
const startPreview = async () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };
  if (services.preview) return { success: false, message: '预览服务已在运行' };
  if (!fs.existsSync(path.join(projectRoot, 'out'))) {
    return { success: false, message: '未找到 out/ 产物目录，请先执行「构建」' };
  }

  send('preview-log', '[1/2] 安装依赖 (npm install) ...');
  const installed = await runTask('preview-setup', 'npm', ['install'], projectRoot, 'preview');
  if (!installed.success) {
    return { success: false, message: `依赖安装失败：${installed.message}` };
  }

  send('preview-log', '[2/2] 启动预览服务 ...');
  return startService(
    'preview',
    'npx',
    ['--yes', 'serve@latest', 'out', '-l', String(PREVIEW_PORT)],
    projectRoot,
    PREVIEW_PORT,
    `预览服务已启动：http://localhost:${PREVIEW_PORT}`
  );
};

const stopAll = async () => {
  const all = [...Object.keys(services), ...Object.keys(tasks)];
  await Promise.all(
    all.map((id) => {
      const bag = id in services ? services : tasks;
      const child = bag[id];
      bag[id] = null;
      return killTree(child);
    })
  );
};

// -------------------------------------------------------------------- 窗口

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 860,
    minWidth: 820,
    minHeight: 600,
    title: '能源门户管理系统',
    backgroundColor: '#0b1220',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'electron-ui', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

/** 在应用内直接打开 CMS 后台，运营人员无需切换浏览器 */
const openCmsWindow = () => {
  if (cmsWindow && !cmsWindow.isDestroyed()) {
    cmsWindow.focus();
    return;
  }
  cmsWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    title: '内容管理后台 (CMS)',
    backgroundColor: '#ffffff',
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  cmsWindow.loadURL(`http://localhost:${CMS_PORT}/admin`);
  cmsWindow.on('closed', () => {
    cmsWindow = null;
  });
};

// --------------------------------------------------------------- 生命周期

let quitting = false;

app.whenReady().then(() => {
  projectRoot = resolveProjectRoot();
  createWindow();

    mainWindow.webContents.once('did-finish-load', async () => {
    if (!projectRoot) {
      send('root-missing');
      return;
    }
    // 默认行为：应用启动即拉起 CMS
    send('cms-log', '正在自动启动 CMS ...');
    const result = await startCms();
    send('cms-log', result.message);
    if (result.success) send('cms-started');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async (event) => {
  if (quitting) return;
  const running = [...Object.values(services), ...Object.values(tasks)].some(Boolean);
  if (!running) return;
  event.preventDefault();
  quitting = true;
  await stopAll();
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// ------------------------------------------------------------------- IPC

ipcMain.handle('start-cms', () => startCms());

ipcMain.handle('stop-cms', () => stopService('cms'));

ipcMain.handle('open-cms-window', () => {
  if (!services.cms) return { success: false, message: 'CMS 未在运行，请先启动' };
  openCmsWindow();
  return { success: true, message: '已打开 CMS 窗口' };
});

ipcMain.handle('start-preview', () => startPreview());

ipcMain.handle('stop-preview', () => stopService('preview'));

// 构建：导出 CMS 数据 → Next.js 静态导出
ipcMain.handle('build', async () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };

  send('build-log', '[1/2] 导出 CMS 数据 (cms: npm run export) ...');
  const exported = await runTask('build', 'npm', ['run', 'export'], path.join(projectRoot, 'cms'));
  if (!exported.success) return { success: false, message: `CMS 数据导出失败：${exported.message}` };

  send('build-log', '[2/2] 构建主站 (next build) ...');
  const built = await runTask('build', 'npx', ['--no-install', 'next', 'build'], projectRoot);
  if (!built.success) return { success: false, message: `主站构建失败：${built.message}` };

  send('build-log', '构建完成，产物位于 out/');
  return { success: true, message: '构建完成' };
});

// 一键发布：构建 → 清理 submodule → 复制产物 → git 提交推送
ipcMain.handle('publish', () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };
  return runTask('publish', 'node', ['scripts/publish.js'], projectRoot);
});

ipcMain.handle('open-url', async (_event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('open-folder', async (_event, relativePath) => {
  const target = path.resolve(projectRoot || app.getPath('home'), relativePath || '.');
  await shell.openPath(target);
});

ipcMain.handle('get-status', () => ({
  cmsRunning: Boolean(services.cms),
  previewRunning: Boolean(services.preview),
  busy: {
    build: Boolean(tasks.build),
    publish: Boolean(tasks.publish),
    cmsSetup: Boolean(tasks['cms-setup']),
    previewSetup: Boolean(tasks['preview-setup']),
  },
  projectRoot,
  cmsUrl: `http://localhost:${CMS_PORT}/admin`,
  previewUrl: `http://localhost:${PREVIEW_PORT}`,
  version: app.getVersion(),
}));

/** 运营人员手动指定项目目录（打包版放在其他位置时使用） */
ipcMain.handle('choose-root', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: '选择项目根目录（须包含 cms 与 scripts/publish.js）',
    properties: ['openDirectory'],
  });
  if (canceled || !filePaths[0]) return { success: false, message: '已取消' };

  if (!isValidRoot(filePaths[0])) {
    return { success: false, message: '该目录不是有效的项目根目录' };
  }

  await stopAll();
  projectRoot = filePaths[0];
  writeConfig({ projectRoot });
  send('cms-stopped');
  send('preview-stopped');
  return { success: true, message: `项目目录已设置为 ${projectRoot}`, projectRoot };
});

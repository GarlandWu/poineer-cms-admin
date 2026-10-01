const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { spawn, execFile } = require('child_process');

const CMS_PORT = 3001;
const PREVIEW_PORT = 5000;

let mainWindow = null;
let applicationMenu = null;

/** 长驻服务进程：{ cms, preview } */
const services = { cms: null, preview: null };
/** 一次性任务进程：{ build, publish } */
const tasks = { build: null, publish: null };
const taskOutput = { build: [], publish: [] };

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

const logCmsStartup = (message) => {
  try {
    const logPath = path.join(app.getPath('userData'), 'startup.log');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\r\n`, 'utf8');
  } catch (error) {
    console.error('写入 CMS 启动日志失败:', error.message);
  }
};

const getCmsEnvironment = () => {
  const dataDir = path.join(app.getPath('userData'), 'cms');
  const databasePath = path.join(dataDir, readConfig().databaseFile || 'energy-portal.db');
  const uploadDir = projectRoot
    ? path.join(projectRoot, 'public', 'uploads')
    : path.join(dataDir, 'uploads');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });

  const config = readConfig();
  const payloadSecret = config.payloadSecret || crypto.randomBytes(32).toString('hex');
  if (!config.payloadSecret) writeConfig({ payloadSecret });

  return {
    DATABASE_URI: pathToFileURL(databasePath).href,
    PAYLOAD_SECRET: payloadSecret,
    PORTAL_UPLOAD_DIR: uploadDir,
    HOSTNAME: '127.0.0.1',
    PORT: String(CMS_PORT),
  };
};

const seedCmsDatabase = async () => {
  const cmsDir = app.isPackaged
    ? path.join(process.resourcesPath, 'cms')
    : path.join(projectRoot, 'cms');
  const dataDir = path.join(app.getPath('userData'), 'cms');
  const config = readConfig();
  const databaseFile = config.databaseFile || 'energy-portal.db';
  const databasePath = path.join(dataDir, databaseFile);
  const seedPath = path.join(cmsDir, 'energy-portal.db');
  logCmsStartup(`Database seed check: packaged=${app.isPackaged}, seedExists=${fs.existsSync(seedPath)}, database=${databasePath}`);
  if (!fs.existsSync(seedPath)) return;

  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(databasePath)) {
    fs.copyFileSync(seedPath, databasePath);
    return;
  }

  const { createClient } = require(path.join(cmsDir, 'node_modules', '@libsql', 'client'));
  const client = createClient({ url: pathToFileURL(databasePath).href });
  let hasContent = false;
  try {
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    );
    const metadataTables = new Set(['payload_migrations', 'users_sessions']);
    for (const row of tables.rows) {
      const tableName = String(row.name);
      if (metadataTables.has(tableName)) continue;
      const escapedName = tableName.replaceAll('"', '""');
      const result = await client.execute(`SELECT COUNT(*) AS count FROM "${escapedName}"`);
      if (Number(result.rows[0].count) > 0) {
        hasContent = true;
        break;
      }
    }
  } finally {
    await client.close();
  }
  logCmsStartup(`Database seed content check: hasContent=${hasContent}`);
  if (hasContent) return;

  const backupPath = `${databasePath}.empty-${Date.now()}.bak`;
  fs.copyFileSync(databasePath, backupPath);
  const seededDatabaseFile = 'energy-portal-initialized.db';
  fs.copyFileSync(seedPath, path.join(dataDir, seededDatabaseFile));
  writeConfig({ databaseFile: seededDatabaseFile });
  logCmsStartup(`Database seed copied: backup=${backupPath}, active=${seededDatabaseFile}`);
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

const updateMenuState = () => {
  applicationMenu = Menu.buildFromTemplate([
    {
      label: '项目',
      submenu: [
        { label: '选择项目目录…', click: () => chooseProjectRoot() },
        { label: projectRoot || '尚未选择项目目录', enabled: false },
        { type: 'separator' },
        {
          label: '打开构建产物目录',
          enabled: Boolean(projectRoot),
          click: () => shell.openPath(path.join(projectRoot, 'out')),
        },
      ],
    },
    {
      label: '门户',
      submenu: [
        {
          label: tasks.build ? '正在构建…' : '构建静态门户',
          accelerator: 'CmdOrCtrl+B',
          enabled: Boolean(projectRoot) && !tasks.build && !tasks.publish,
          click: async () => showTaskResult('build', await executeBuild()),
        },
        {
          label: tasks.publish ? '正在发布…' : '构建并发布',
          accelerator: 'CmdOrCtrl+Shift+P',
          enabled: Boolean(projectRoot) && !tasks.build && !tasks.publish,
          click: async () => {
            const confirmation = await dialog.showMessageBox(mainWindow, {
              type: 'warning',
              message: '构建并发布门户？',
              detail: '将导出 CMS 数据、构建静态站并执行 scripts/publish.js 推送到远程仓库。',
              buttons: ['构建并发布', '取消'],
              defaultId: 1,
              cancelId: 1,
            });
            if (confirmation.response === 0) {
              showTaskResult('publish', await executePublish());
            }
          },
        },
        { type: 'separator' },
        {
          label: services.preview ? '停止本地预览' : '启动本地预览',
          enabled: Boolean(projectRoot) && !tasks.build && !tasks.publish && !tasks['preview-setup'],
          click: async () => {
            const wasRunning = Boolean(services.preview);
            const result = wasRunning ? await stopService('preview') : await startPreview();
            if (result.success && !wasRunning) await shell.openExternal(`http://localhost:${PREVIEW_PORT}`);
            await dialog.showMessageBox(mainWindow, {
              type: result.success ? 'info' : 'error',
              message: result.message,
            });
            updateMenuState();
          },
        },
      ],
    },
    {
      label: '后台',
      submenu: [
        { label: '重新载入 CMS', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { type: 'separator' },
        { label: '退出', role: 'quit' },
      ],
    },
  ]);
  Menu.setApplicationMenu(applicationMenu);
};

const showTaskResult = async (task, result) => {
  const recentOutput = taskOutput[task].slice(-12).join('\n');
  await dialog.showMessageBox(mainWindow, {
    type: result.success ? 'info' : 'error',
    message: result.success ? (task === 'build' ? '门户构建完成' : '发布流程完成') : result.message,
    detail: recentOutput || result.message,
  });
  updateMenuState();
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

/** 启动子进程并保留构建/发布日志，供原生结果框展示。 */
const spawnLogged = (id, command, args, cwd, logId = id, env = process.env) => {
  const child = spawn(command, args, {
    cwd,
    shell: command !== process.execPath,
    windowsHide: true,
    env: { ...env, FORCE_COLOR: '0' },
  });

  const pump = (stream) => {
    if (!stream) return;
    stream.setEncoding('utf-8');
    stream.on('data', (chunk) => {
      chunk
        .split(/\r?\n/)
        .filter((line) => line.trim())
        .forEach((line) => {
          if (logId in taskOutput) {
            taskOutput[logId].push(line);
            if (taskOutput[logId].length > 100) taskOutput[logId].shift();
          }
          send(`${logId}-log`, line);
        });
    });
  };

  pump(child.stdout);
  pump(child.stderr);
  return child;
};

/** 一次性任务：跑完即返回结果 */
const runTask = (id, command, args, cwd, logId = id, env = process.env) =>
  new Promise((resolve) => {
    if (tasks[id]) return resolve({ success: false, message: '该任务正在执行中' });

    const child = spawnLogged(id, command, args, cwd, logId, env);
    tasks[id] = child;
    updateMenuState();

    child.on('error', (error) => {
      tasks[id] = null;
      send(`${logId}-log`, `启动失败: ${error.message}`);
      updateMenuState();
      resolve({ success: false, message: error.message });
    });

    child.on('close', (code) => {
      tasks[id] = null;
      updateMenuState();
      resolve(
        code === 0
          ? { success: true, message: '执行完成' }
          : { success: false, message: `进程退出码 ${code}` }
      );
    });
  });

/** 长驻服务：轮询端口确认真的起来了，而不是死等固定秒数 */
const startService = async (id, command, args, cwd, port, readyMessage, env = process.env) => {
  if (services[id]) return { success: false, message: '服务已在运行' };
  if (!projectRoot && !(id === 'cms' && app.isPackaged)) {
    return { success: false, message: '未设置项目根目录' };
  }

  if (await isPortInUse(port)) {
    return { success: false, message: `端口 ${port} 已被占用，请先关闭占用该端口的程序` };
  }

  const child = spawnLogged(id, command, args, cwd, id, env);
  services[id] = child;
  updateMenuState();

  child.on('error', (error) => {
    services[id] = null;
    updateMenuState();
    send(`${id}-log`, `启动失败: ${error.message}`);
    send(`${id}-stopped`);
  });

  child.on('close', (code) => {
    services[id] = null;
    updateMenuState();
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
  updateMenuState();
  await killTree(child);
  send(`${id}-stopped`);
  return { success: true, message: '服务已停止' };
};

// ------------------------------------------------------------ CMS 启动流程

/**
 * 打包版使用随 EXE 携带的 standalone 服务；开发版继续使用本地 Next dev。
 */
const startCms = async () => {
  if (services.cms) return { success: false, message: 'CMS 已在运行' };

  if (!app.isPackaged && !projectRoot) return { success: false, message: '未设置项目根目录' };
  const cmsDir = app.isPackaged
    ? path.join(process.resourcesPath, 'cms')
    : path.join(projectRoot, 'cms');
  try {
    await seedCmsDatabase();
  } catch (error) {
    return { success: false, message: `CMS 数据库初始化失败：${error.message}` };
  }
  const cmsEnvironment = { ...process.env, ...getCmsEnvironment() };

  if (app.isPackaged) {
    const serverFile = path.join(cmsDir, 'server.js');
    if (!fs.existsSync(serverFile)) {
      return { success: false, message: '未找到随 EXE 打包的 CMS 服务，请重新构建 EXE' };
    }
    return startService(
      'cms',
      process.execPath,
      [serverFile],
      cmsDir,
      CMS_PORT,
      `CMS 已启动：http://localhost:${CMS_PORT}/admin`,
      { ...cmsEnvironment, ELECTRON_RUN_AS_NODE: '1' }
    );
  }

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
    `CMS 已启动：http://localhost:${CMS_PORT}/admin`,
    cmsEnvironment
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

const createCmsWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 680,
    title: '能源数字孪生内容管理后台',
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  mainWindow.loadURL(`http://localhost:${CMS_PORT}/admin`);
  mainWindow.once('ready-to-show', () => mainWindow?.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// --------------------------------------------------------------- 生命周期

let quitting = false;

app.whenReady().then(async () => {
  projectRoot = resolveProjectRoot();
  logCmsStartup(`Application ready: packaged=${app.isPackaged}, projectRoot=${projectRoot || 'none'}, resourcesPath=${process.resourcesPath}`);
  updateMenuState();
  const result = await startCms();
  logCmsStartup(`CMS startup result: success=${result.success}, message=${result.message}`);
  if (!result.success) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'CMS 启动失败',
      message: result.message,
      detail: '请检查端口 3001 是否被占用，然后重新启动应用。',
    });
    app.quit();
    return;
  }
  createCmsWindow();
  updateMenuState();
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
  if (mainWindow === null && services.cms) createCmsWindow();
});

const executeBuild = async () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };
  taskOutput.build = [];
  const cmsDir = path.join(projectRoot, 'cms');
  const payloadCli = path.join(cmsDir, 'node_modules', 'payload', 'bin.js');
  const nextCli = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
  if (!fs.existsSync(payloadCli) || !fs.existsSync(nextCli)) {
    return {
      success: false,
      message: '项目依赖未安装，请先在项目目录运行 npm install 和 npm install --prefix cms',
    };
  }

  taskOutput.build.push('[1/2] 导出 CMS 数据 (cms: npm run export) ...');
  const cmsEnvironment = { ...process.env, ...getCmsEnvironment() };
  const exported = await runTask(
    'build',
    process.execPath,
    [payloadCli, 'run', './src/scripts/export.ts'],
    cmsDir,
    'build',
    { ...cmsEnvironment, ELECTRON_RUN_AS_NODE: '1', NODE_OPTIONS: '--no-deprecation' }
  );
  if (!exported.success) return { success: false, message: `CMS 数据导出失败：${exported.message}` };

  taskOutput.build.push('[2/2] 构建主站 (next build) ...');
  const built = await runTask(
    'build',
    process.execPath,
    [nextCli, 'build'],
    projectRoot,
    'build',
    { ...cmsEnvironment, ELECTRON_RUN_AS_NODE: '1', NODE_OPTIONS: '--no-deprecation' }
  );
  if (!built.success) return { success: false, message: `主站构建失败：${built.message}` };

  taskOutput.build.push('构建完成，产物位于 out/');
  return { success: true, message: '构建完成，产物位于 out/' };
};

// 一键发布：构建 → 清理 submodule → 复制产物 → git 提交推送
const executePublish = () => {
  if (!projectRoot) return { success: false, message: '未设置项目根目录' };
  taskOutput.publish = [];
  return runTask(
    'publish',
    process.execPath,
    ['scripts/publish.js'],
    projectRoot,
    'publish',
    {
      ...process.env,
      ...getCmsEnvironment(),
      ELECTRON_RUN_AS_NODE: '1',
      NODE_OPTIONS: '--no-deprecation',
    }
  );
};

/** 运营人员手动指定项目目录（打包版放在其他位置时使用） */
const chooseProjectRoot = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow || undefined, {
    title: '选择项目根目录（须包含 cms 与 scripts/publish.js）',
    properties: ['openDirectory'],
  });
  if (canceled || !filePaths[0]) return false;

  if (!isValidRoot(filePaths[0])) {
    await dialog.showMessageBox(mainWindow || undefined, {
      type: 'error',
      message: '该目录不是有效的门户项目目录。',
      detail: '目录中需要包含 package.json、cms/ 和 scripts/publish.js。',
    });
    return false;
  }

  if (services.preview) await stopService('preview');
  if (services.cms) await stopService('cms');
  projectRoot = filePaths[0];
  writeConfig({ projectRoot });
  const restarted = await startCms();
  if (!restarted.success) {
    await dialog.showMessageBox(mainWindow || undefined, {
      type: 'error',
      message: 'CMS 无法使用新项目目录启动。',
      detail: restarted.message,
    });
    app.quit();
    return false;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    await mainWindow.loadURL(`http://localhost:${CMS_PORT}/admin`);
  }
  updateMenuState();
  return true;
};

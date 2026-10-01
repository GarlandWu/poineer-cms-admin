const { contextBridge, ipcRenderer } = require('electron');

const on = (channel, callback) =>
  ipcRenderer.on(channel, (_event, payload) => callback(payload));

contextBridge.exposeInMainWorld('electron', {
  cms: {
    start: () => ipcRenderer.invoke('start-cms'),
    stop: () => ipcRenderer.invoke('stop-cms'),
    openWindow: () => ipcRenderer.invoke('open-cms-window'),
    onLog: (callback) => on('cms-log', callback),
    onStarted: (callback) => on('cms-started', callback),
    onStopped: (callback) => on('cms-stopped', callback),
  },
  preview: {
    start: () => ipcRenderer.invoke('start-preview'),
    stop: () => ipcRenderer.invoke('stop-preview'),
    onLog: (callback) => on('preview-log', callback),
    onStarted: (callback) => on('preview-started', callback),
    onStopped: (callback) => on('preview-stopped', callback),
  },
  publish: {
    execute: () => ipcRenderer.invoke('publish'),
    onLog: (callback) => on('publish-log', callback),
  },
  build: {
    execute: () => ipcRenderer.invoke('build'),
    onLog: (callback) => on('build-log', callback),
  },
  app: {
    getStatus: () => ipcRenderer.invoke('get-status'),
    openUrl: (url) => ipcRenderer.invoke('open-url', url),
    openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
    chooseRoot: () => ipcRenderer.invoke('choose-root'),
    onRootMissing: (callback) => on('root-missing', callback),
  },
});

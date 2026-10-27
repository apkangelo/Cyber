'use strict';
// Cyber pour Windows et Linux : fenêtre Electron + shells locaux + sessions SSH.
const { app, BrowserWindow, ipcMain, shell, clipboard, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { openSsh } = require('./ssh-core');
const { openLocal } = require('./local-core');

const sessions = new Map(); // id → { write, resize, close }
const hostKeyAnswers = new Map(); // id → callback(bool)
let win = null;

const statePath = () => path.join(app.getPath('userData'), 'fenetre.json');
function loadBounds() {
  try {
    return JSON.parse(fs.readFileSync(statePath(), 'utf8'));
  } catch (e) {
    return null;
  }
}
function saveBounds() {
  if (!win || win.isDestroyed()) return;
  try {
    fs.writeFileSync(statePath(), JSON.stringify({ ...win.getNormalBounds(), maximized: win.isMaximized() }));
  } catch (e) {}
}

function emit(ev) {
  if (win && !win.isDestroyed()) win.webContents.send('cyber:event', ev);
}

function createWindow() {
  const b = loadBounds() || {};
  win = new BrowserWindow({
    width: b.width || 1120,
    height: b.height || 720,
    x: b.x,
    y: b.y,
    minWidth: 420,
    minHeight: 320,
    backgroundColor: '#0b0614',
    title: 'Cyber',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });
  if (b.maximized) win.maximize();
  win.once('ready-to-show', () => win.show());
  win.on('close', saveBounds);
  win.on('closed', () => {
    win = null;
    for (const s of sessions.values()) s.close();
    sessions.clear();
  });

  // liens : uniquement dans le navigateur du système
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F12' && !app.isPackaged) win.webContents.toggleDevTools();
  });

  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
}

/* ---------- IPC ---------- */
ipcMain.on('cyber:version', (e) => {
  e.returnValue = app.getVersion();
});

ipcMain.handle('cyber:openLocal', (e, id, o) => {
  const s = openLocal(o || {}, {
    onData: (data) => emit({ type: 'data', id, data }),
    onReady: () => emit({ type: 'ready', id }),
    onExit: (code) => {
      sessions.delete(id);
      emit({ type: 'exit', id, code });
    },
  });
  sessions.set(id, s);
});

ipcMain.handle('cyber:openSsh', (e, id, o) => {
  const s = openSsh(o || {}, {
    onData: (data) => emit({ type: 'data', id, data }),
    onReady: () => emit({ type: 'ready', id }),
    onStatus: (text) => emit({ type: 'status', id, text }),
    onBanner: (text) => emit({ type: 'data', id, data: String(text).replace(/\r?\n/g, '\r\n') }),
    onHostKey: (info, answer) => {
      hostKeyAnswers.set(id, answer);
      emit({ type: 'hostkey', id, ...info });
    },
    onError: (message) => emit({ type: 'error', id, message }),
    onExit: (code) => {
      sessions.delete(id);
      hostKeyAnswers.delete(id);
      emit({ type: 'exit', id, code });
    },
  });
  sessions.set(id, s);
});

ipcMain.on('cyber:write', (e, id, data) => {
  const s = sessions.get(id);
  if (s) s.write(data);
});
ipcMain.on('cyber:resize', (e, id, cols, rows) => {
  const s = sessions.get(id);
  if (s) s.resize(cols, rows);
});
ipcMain.on('cyber:close', (e, id) => {
  const answer = hostKeyAnswers.get(id);
  if (answer) {
    hostKeyAnswers.delete(id);
    answer(false);
  }
  const s = sessions.get(id);
  if (s) {
    sessions.delete(id);
    s.close();
  }
});
ipcMain.on('cyber:hostkey', (e, id, ok) => {
  const answer = hostKeyAnswers.get(id);
  hostKeyAnswers.delete(id);
  if (answer) answer(!!ok);
});
ipcMain.handle('cyber:copy', (e, text) => clipboard.writeText(String(text)));
ipcMain.handle('cyber:paste', () => clipboard.readText());
ipcMain.on('cyber:open', (e, url) => {
  if (/^https?:\/\//i.test(String(url))) shell.openExternal(String(url));
});
ipcMain.handle('cyber:saveText', async (e, name, text) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: path.join(app.getPath('documents'), String(name || 'cyber.json')) });
  if (r.canceled || !r.filePath) return false;
  fs.writeFileSync(r.filePath, String(text), 'utf8');
  return true;
});

/* ---------- application ---------- */
app.setName('Cyber');
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
  });
  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  app.on('window-all-closed', () => app.quit());
}

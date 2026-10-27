'use strict';
// Pont sécurisé entre l'interface et la partie native (aucun accès direct à Node pour la page).
const { contextBridge, ipcRenderer } = require('electron');

const clean = (e) => new Error(String((e && e.message) || e).replace(/^Error invoking remote method '[^']+': (?:Error: )?/, ''));
const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args).catch((e) => Promise.reject(clean(e)));

let version = '';
try {
  version = ipcRenderer.sendSync('cyber:version');
} catch (e) {}

contextBridge.exposeInMainWorld('cyberNative', {
  platform: process.platform,
  version,
  openLocal: (id, o) => invoke('cyber:openLocal', id, o),
  openSsh: (id, o) => invoke('cyber:openSsh', id, o),
  write: (id, data) => ipcRenderer.send('cyber:write', id, data),
  resize: (id, cols, rows) => ipcRenderer.send('cyber:resize', id, cols, rows),
  close: (id) => ipcRenderer.send('cyber:close', id),
  answerHostKey: (id, ok) => ipcRenderer.send('cyber:hostkey', id, !!ok),
  copy: (text) => invoke('cyber:copy', text),
  paste: () => invoke('cyber:paste'),
  openExternal: (url) => ipcRenderer.send('cyber:open', url),
  saveText: (name, text) => invoke('cyber:saveText', name, text),
  onEvent: (fn) => {
    ipcRenderer.on('cyber:event', (_e, ev) => fn(ev));
  },
});

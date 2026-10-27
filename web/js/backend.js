/* Cyber — pont vers la partie native (Electron sur PC, Java sur Android, démo dans un navigateur)
 *
 * Toutes les versions exposent la même interface :
 *   openLocal(id, options)  openSsh(id, options)  write(id, texte)  resize(id, cols, rows)
 *   close(id)  answerHostKey(id, accepté)  copy(texte)  paste()  openExternal(url)
 * et émettent des évènements { type, id, ... } :
 *   data (data: Uint8Array | string)  ready  status (text)  hostkey (algo, fingerprint, changed)
 *   error (message)  exit (code)
 */
(function () {
  'use strict';
  const C = window.Cyber;
  const handlers = new Set();
  const dispatch = (ev) => {
    for (const fn of handlers) {
      try {
        fn(ev);
      } catch (e) {
        console.error(e);
      }
    }
  };

  let backend;

  if (window.cyberNative) {
    /* ---------- Windows / Linux (Electron) ---------- */
    const n = window.cyberNative;
    n.onEvent(dispatch);
    backend = {
      kind: 'electron',
      platform: n.platform === 'win32' ? 'windows' : n.platform === 'darwin' ? 'mac' : 'linux',
      version: n.version || '',
      openLocal: (id, o) => n.openLocal(id, o),
      openSsh: (id, o) => n.openSsh(id, o),
      write: (id, d) => n.write(id, d),
      resize: (id, c, r) => n.resize(id, c, r),
      close: (id) => n.close(id),
      answerHostKey: (id, ok) => n.answerHostKey(id, !!ok),
      copy: (t) => n.copy(String(t)),
      paste: () => n.paste(),
      openExternal: (u) => n.openExternal(u),
      saveText: (name, text) => n.saveText(name, text),
      vibrate() {},
      setActiveSessions() {},
      setBarColor() {},
    };
  } else if (window.CyberAndroid) {
    /* ---------- Android (WebView + Java) ---------- */
    const a = window.CyberAndroid;
    window.__cyberEvent = (json) => {
      let ev;
      try {
        ev = typeof json === 'string' ? JSON.parse(json) : json;
      } catch (e) {
        return;
      }
      if (ev.type === 'data' && typeof ev.b64 === 'string') {
        ev.data = C.b64ToBytes(ev.b64);
        delete ev.b64;
      }
      dispatch(ev);
    };
    const call = (fn) => {
      const err = fn();
      if (err) throw new Error(err);
    };
    let info = {};
    try {
      info = JSON.parse(a.info());
    } catch (e) {}
    backend = {
      kind: 'android',
      platform: 'android',
      version: info.version || '',
      info,
      openLocal: async (id, o) => call(() => a.openLocal(id, JSON.stringify(o))),
      openSsh: async (id, o) => call(() => a.openSsh(id, JSON.stringify(o))),
      write: (id, d) => a.write(id, d),
      resize: (id, c, r) => a.resize(id, c | 0, r | 0),
      close: (id) => a.close(id),
      answerHostKey: (id, ok) => a.answerHostKey(id, !!ok),
      copy: async (t) => a.copy(String(t)),
      paste: async () => a.paste() || '',
      openExternal: (u) => a.openExternal(String(u)),
      saveText: async (name, text) => a.shareText(name, text),
      vibrate: (ms) => a.vibrate(ms | 0),
      setActiveSessions: (n) => a.setActiveSessions(n | 0),
      setBarColor: (hex) => a.setBarColor(String(hex)),
    };
  } else {
    /* ---------- Démo dans un navigateur : petit shell intégré, sans SSH ---------- */
    const demos = new Map();
    const out = (id, text) => setTimeout(() => dispatch({ type: 'data', id, data: text }), 0);
    const prompt = '\x1b[1;35mcyber\x1b[0m:\x1b[1;36mdémo\x1b[0m $ ';
    const run = (id, line) => {
      const [cmd, ...args] = line.trim().split(/\s+/);
      switch (cmd) {
        case '':
          return '';
        case 'aide':
        case 'help':
          return 'Commandes de la démo : aide, couleurs, echo, date, clear, exit\r\nLe SSH et le vrai shell sont disponibles dans les applis Android, Windows et Linux.\r\n';
        case 'couleurs':
          return C.themes.sampleAnsi();
        case 'echo':
          return args.join(' ') + '\r\n';
        case 'date':
          return new Date().toLocaleString('fr-FR') + '\r\n';
        case 'clear':
          return '\x1b[2J\x1b[H';
        case 'exit':
          setTimeout(() => {
            demos.delete(id);
            dispatch({ type: 'exit', id, code: 0 });
          }, 10);
          return null;
        default:
          return `${cmd} : commande inconnue (tape « aide »)\r\n`;
      }
    };
    backend = {
      kind: 'demo',
      platform: 'web',
      version: '',
      async openLocal(id) {
        demos.set(id, { line: '' });
        setTimeout(() => dispatch({ type: 'ready', id }), 0);
        out(id, 'Bienvenue dans la démo de \x1b[1;35mCyber\x1b[0m. Tape « aide ».\r\n' + prompt);
      },
      async openSsh() {
        throw new Error('Le SSH demande l’appli Android, Windows ou Linux.');
      },
      write(id, d) {
        const s = demos.get(id);
        if (!s) return;
        for (const ch of d) {
          if (ch === '\r') {
            const res = run(id, s.line);
            s.line = '';
            if (res === null) return;
            out(id, '\r\n' + res + prompt);
          } else if (ch === '\x7f' || ch === '\b') {
            if (s.line) {
              s.line = s.line.slice(0, -1);
              out(id, '\b \b');
            }
          } else if (ch === '\x03') {
            s.line = '';
            out(id, '^C\r\n' + prompt);
          } else if (ch >= ' ') {
            s.line += ch;
            out(id, ch);
          }
        }
      },
      resize() {},
      close: (id) => demos.delete(id),
      answerHostKey() {},
      copy: async (t) => {
        try {
          await navigator.clipboard.writeText(t);
        } catch (e) {}
      },
      paste: async () => {
        try {
          return await navigator.clipboard.readText();
        } catch (e) {
          return '';
        }
      },
      openExternal: (u) => window.open(u, '_blank', 'noopener'),
      saveText: async (name, text) => C.downloadText(name, text),
      vibrate(ms) {
        if (navigator.vibrate) navigator.vibrate(ms);
      },
      setActiveSessions() {},
      setBarColor() {},
    };
  }

  backend.onEvent = (fn) => {
    handlers.add(fn);
    return () => handlers.delete(fn);
  };
  backend.dispatch = dispatch;
  backend.platformLabel = { windows: 'Windows', linux: 'Linux', mac: 'macOS', android: 'Android', web: 'Navigateur (démo)' }[backend.platform];

  C.backend = backend;
})();

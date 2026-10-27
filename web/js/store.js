/* Cyber — réglages, profils SSH, clés et hôtes connus (stockés sur l'appareil) */
(function () {
  'use strict';
  const C = window.Cyber;

  const KEYS = {
    settings: 'cyber.settings.v1',
    profiles: 'cyber.profiles.v1',
    hosts: 'cyber.knownhosts.v1',
    keys: 'cyber.keys.v1',
  };

  const mobile = C.isTouch;

  const DEFAULT_RC = [
    '# Script lancé au démarrage du shell local de Cyber.',
    '# Tu peux y mettre tes alias, ton invite (PS1) et tes variables.',
    "PS1='cyber:${PWD##*/} $ '",
    "alias ll='ls -la'",
    "alias cls='clear'",
    '',
  ].join('\n');

  const DEFAULTS = {
    theme: 'cyber',
    customThemes: [],
    accent: '#b56cff',
    accentFollowsTheme: false,
    fontFamily: 'jetbrains',
    customFont: '',
    fontSize: mobile ? 13 : 14,
    lineHeight: 1.15,
    letterSpacing: 0,
    fontWeight: 'normal',
    fontWeightBold: 'bold',
    boldBright: true,
    minContrast: 1,
    cursorStyle: 'block',
    cursorBlink: true,
    scrollback: 5000,
    bell: 'visual',
    copyOnSelect: false,
    rightClickPaste: true,
    winClipboardKeys: true,
    renderer: 'auto',
    padding: 8,
    tabsPosition: 'top',
    confirmClose: true,
    closeOnExit: false,
    startup: 'local',
    extraKeys: 'auto',
    extraKeysLayout: 'ESC / - HOME UP END PGUP\nTAB CTRL ALT LEFT DOWN RIGHT PGDN',
    keyVibrate: true,
    pinchZoom: true,
    localShell: { command: '', args: '', cwd: '', rc: DEFAULT_RC },
    ssh: { keepalive: 30, timeout: 20 },
    snippets: [
      { id: 'sn1', name: 'Espace disque', command: 'df -h', enter: true },
      { id: 'sn2', name: 'Mémoire', command: 'free -h', enter: true },
      { id: 'sn3', name: 'Processus', command: 'htop || top', enter: true },
      { id: 'sn4', name: 'Mises à jour (Debian/Ubuntu)', command: 'sudo apt update && sudo apt upgrade', enter: false },
    ],
  };

  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  function merge(def, val) {
    if (!isObj(def)) return val === undefined ? def : val;
    const out = {};
    for (const k of Object.keys(def)) out[k] = isObj(def[k]) ? merge(def[k], isObj(val) ? val[k] : undefined) : (isObj(val) && val[k] !== undefined ? val[k] : def[k]);
    if (isObj(val)) for (const k of Object.keys(val)) if (!(k in out)) out[k] = val[k];
    return out;
  }
  const clone = (v) => JSON.parse(JSON.stringify(v));

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Cyber: enregistrement impossible', e);
      C.toast && C.toast("Impossible d'enregistrer les réglages", 'bad');
    }
  }

  const listeners = new Set();

  const store = {
    DEFAULT_RC,
    defaults: DEFAULTS,
    settings: merge(clone(DEFAULTS), read(KEYS.settings, {})),
    profiles: read(KEYS.profiles, []),
    knownHosts: read(KEYS.hosts, {}),
    keys: read(KEYS.keys, []),

    on(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    emit(what, detail) {
      for (const fn of listeners) {
        try {
          fn(what, detail);
        } catch (e) {
          console.error(e);
        }
      }
    },

    get(path) {
      return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), this.settings);
    },
    set(path, value) {
      const parts = path.split('.');
      let o = this.settings;
      for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]] = isObj(o[parts[i]]) ? o[parts[i]] : {};
      o[parts[parts.length - 1]] = value;
      this.saveSettings(path);
    },

    saveSettings(path) {
      write(KEYS.settings, this.settings);
      this.emit('settings', path || '*');
    },
    saveProfiles() {
      write(KEYS.profiles, this.profiles);
      this.emit('profiles');
    },
    saveHosts() {
      write(KEYS.hosts, this.knownHosts);
      this.emit('hosts');
    },
    saveKeys() {
      write(KEYS.keys, this.keys);
      this.emit('keys');
    },

    hostId(host, port) {
      return String(host).toLowerCase() + ':' + (Number(port) || 22);
    },

    exportAll(includeSecrets) {
      const profiles = clone(this.profiles);
      const keys = clone(this.keys);
      if (!includeSecrets) {
        profiles.forEach((p) => {
          delete p.password;
          delete p.passphrase;
        });
        keys.forEach((k) => delete k.privateKey);
      }
      return {
        app: 'Cyber',
        format: 1,
        exportedAt: new Date().toISOString(),
        settings: clone(this.settings),
        profiles,
        knownHosts: clone(this.knownHosts),
        keys,
      };
    },

    importAll(data) {
      if (!data || data.app !== 'Cyber') throw new Error("Ce fichier n'est pas une sauvegarde Cyber.");
      if (data.settings) this.settings = merge(clone(DEFAULTS), data.settings);
      if (Array.isArray(data.profiles)) this.profiles = data.profiles;
      if (isObj(data.knownHosts)) this.knownHosts = data.knownHosts;
      if (Array.isArray(data.keys)) {
        // on garde les clés privées locales si la sauvegarde ne les contient pas
        const local = new Map(this.keys.map((k) => [k.id, k]));
        this.keys = data.keys
          .map((k) => (k.privateKey ? k : { ...k, privateKey: (local.get(k.id) || {}).privateKey }))
          .filter((k) => k.privateKey);
      }
      write(KEYS.profiles, this.profiles);
      write(KEYS.hosts, this.knownHosts);
      write(KEYS.keys, this.keys);
      this.saveSettings('*');
      this.emit('profiles');
      this.emit('keys');
      this.emit('hosts');
    },

    resetSettings() {
      this.settings = clone(DEFAULTS);
      this.saveSettings('*');
    },
  };

  C.store = store;
})();

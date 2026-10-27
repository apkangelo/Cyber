/* Cyber — une session = un onglet = un terminal xterm.js relié à un shell local ou à un serveur SSH */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;

  const FONTS = {
    jetbrains: '"JetBrains Mono", "Cascadia Code", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    firacode: '"Fira Code", "JetBrains Mono", Menlo, Consolas, monospace',
    cascadia: '"Cascadia Code", "Cascadia Mono", Consolas, "JetBrains Mono", monospace',
    consolas: 'Consolas, "Courier New", monospace',
    dejavu: '"DejaVu Sans Mono", "Liberation Mono", monospace',
    ubuntu: '"Ubuntu Mono", "DejaVu Sans Mono", monospace',
    system: 'monospace',
  };
  C.FONT_CHOICES = [
    { value: 'jetbrains', label: 'JetBrains Mono (intégrée)' },
    { value: 'firacode', label: 'Fira Code (intégrée)' },
    { value: 'cascadia', label: 'Cascadia Code (Windows)' },
    { value: 'consolas', label: 'Consolas (Windows)' },
    { value: 'dejavu', label: 'DejaVu Sans Mono (Linux)' },
    { value: 'ubuntu', label: 'Ubuntu Mono (Linux)' },
    { value: 'system', label: 'Police du système' },
    { value: 'custom', label: 'Autre police…' },
  ];
  C.fontStack = (s) =>
    s.fontFamily === 'custom' && s.customFont ? `"${s.customFont.replace(/"/g, '')}", monospace` : FONTS[s.fontFamily] || FONTS.jetbrains;

  C.termOptions = (s, theme) => ({
    fontFamily: C.fontStack(s),
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    fontWeight: s.fontWeight,
    fontWeightBold: s.fontWeightBold,
    drawBoldTextInBrightColors: s.boldBright,
    minimumContrastRatio: s.minContrast,
    cursorStyle: s.cursorStyle,
    cursorBlink: s.cursorBlink,
    cursorInactiveStyle: 'outline',
    scrollback: s.scrollback,
    theme: C.themes.toXterm(theme),
    allowProposedApi: true,
    macOptionIsMeta: true,
    rightClickSelectsWord: false,
    smoothScrollDuration: 0,
    scrollSensitivity: C.isTouch ? 1.5 : 1,
    fastScrollSensitivity: 5,
  });

  let counter = 0;

  class Session {
    constructor(app, spec) {
      this.app = app;
      this.spec = spec; // { kind: 'local' } | { kind: 'ssh', profile }
      this.num = ++counter;
      this.id = C.uid('s');
      this.state = 'idle';
      this.remoteTitle = '';
      this.customTitle = '';
      this.host = h('div', { class: 'term-host' });
      app.termsEl.append(this.host);
      this.createTerminal();
    }

    get title() {
      if (this.customTitle) return this.customTitle;
      if (this.spec.kind === 'ssh') return this.spec.profile.name || `${this.spec.profile.username}@${this.spec.profile.host}`;
      return this.remoteTitle && this.remoteTitle.length < 40 ? this.remoteTitle : 'Local ' + this.num;
    }

    get theme() {
      return C.themes.forSpec(this.spec);
    }

    createTerminal() {
      const s = C.store.settings;
      if (typeof window.Terminal !== 'function') throw new Error('xterm.js est introuvable (dossier vendor manquant).');
      const term = (this.term = new window.Terminal(C.termOptions(s, this.theme)));
      this.fit = new window.FitAddon.FitAddon();
      term.loadAddon(this.fit);
      try {
        term.loadAddon(new window.Unicode11Addon.Unicode11Addon());
        term.unicode.activeVersion = '11';
      } catch (e) {}
      try {
        term.loadAddon(new window.WebLinksAddon.WebLinksAddon((ev, uri) => C.backend.openExternal(uri)));
      } catch (e) {}
      try {
        this.search = new window.SearchAddon.SearchAddon();
        term.loadAddon(this.search);
      } catch (e) {
        this.search = null;
      }
      term.open(this.host);
      this.applyRenderer();
      this.applyHostStyle();

      term.onData((d) => this.input(d));
      term.onBinary((d) => {
        if (this.state === 'connected') C.backend.write(this.id, d);
      });
      term.onResize(({ cols, rows }) => {
        if (this.state === 'connected') C.backend.resize(this.id, cols, rows);
      });
      term.onTitleChange((t) => {
        this.remoteTitle = t;
        this.app.renderTabs();
      });
      term.onBell(() => this.app.bell(this));
      term.onSelectionChange(() => {
        if (C.store.settings.copyOnSelect && term.hasSelection()) C.backend.copy(term.getSelection());
      });
      term.attachCustomKeyEventHandler((e) => this.app.handleKey(e, this));

      this.host.addEventListener('contextmenu', (e) => {
        if (!C.store.settings.rightClickPaste || C.isTouch) return;
        e.preventDefault();
        if (term.hasSelection()) {
          C.backend.copy(term.getSelection());
          term.clearSelection();
          C.toast('Copié');
        } else this.pasteFromClipboard();
      });

      this.resizeObs = new ResizeObserver(C.debounce(() => this.doFit(), 50));
      this.resizeObs.observe(this.host);
    }

    applyRenderer() {
      const mode = C.store.settings.renderer;
      const want = mode === 'webgl' || (mode === 'auto' && !!window.WebglAddon);
      if (want && !this.webgl && window.WebglAddon) {
        try {
          const addon = new window.WebglAddon.WebglAddon();
          addon.onContextLoss(() => {
            addon.dispose();
            this.webgl = null;
          });
          this.term.loadAddon(addon);
          this.webgl = addon;
        } catch (e) {
          this.webgl = null; // retombe sur le rendu DOM
        }
      } else if (!want && this.webgl) {
        this.webgl.dispose();
        this.webgl = null;
      }
    }

    applyHostStyle() {
      const s = C.store.settings;
      this.host.style.padding = s.padding + 'px';
      this.host.style.background = this.theme.colors.background;
    }

    applySettings() {
      const s = C.store.settings;
      const opts = C.termOptions(s, this.theme);
      for (const [k, v] of Object.entries(opts)) {
        if (k === 'allowProposedApi') continue;
        try {
          if (JSON.stringify(this.term.options[k]) !== JSON.stringify(v)) this.term.options[k] = v;
        } catch (e) {}
      }
      this.applyRenderer();
      this.applyHostStyle();
      this.doFit();
    }

    doFit() {
      if (!this.host.classList.contains('active') || !this.host.offsetWidth) return;
      try {
        this.fit.fit();
      } catch (e) {}
    }

    focus() {
      if (this.state !== 'closed') this.term.focus();
    }

    setState(state) {
      this.state = state;
      this.app.renderTabs();
      this.app.updateActiveCount();
    }

    info(text, color = '2') {
      this.term.write(`\r\n\x1b[${color}m${text}\x1b[0m\r\n`);
    }

    /** Texte tapé au clavier (ou collé) */
    input(d) {
      if (this.state === 'ended' || this.state === 'error') {
        if (d === '\r' || d === '\n') this.restart();
        return;
      }
      if (this.state === 'hostkey' || this.state === 'connecting') return;
      if (this.state !== 'connected') return;
      C.backend.write(this.id, C.keys.applyModifiers(d));
    }

    /** Envoi direct (touches supplémentaires, commandes rapides) */
    send(seq) {
      if (this.state === 'ended' || this.state === 'error') {
        if (seq === '\r') this.restart();
        return;
      }
      if (this.state === 'connected') C.backend.write(this.id, seq);
    }

    async pasteFromClipboard() {
      const text = await C.backend.paste();
      if (text) this.term.paste(text);
      else C.toast('Presse-papiers vide');
    }

    async connect() {
      const s = C.store.settings;
      this.doFit();
      const { cols, rows } = this.term;
      this.setState('connecting');
      try {
        if (this.spec.kind === 'local') {
          const ls = s.localShell;
          await C.backend.openLocal(this.id, { cols, rows, command: ls.command, args: ls.args, cwd: ls.cwd, rc: ls.rc });
          return;
        }
        const p = this.spec.profile;
        const port = Number(p.port) || 22;
        let password = p.password || '';
        let privateKey = '';
        let passphrase = p.passphrase || '';
        if (p.auth === 'key') {
          const key = C.store.keys.find((k) => k.id === p.keyId);
          if (!key) throw new Error('La clé choisie pour ce profil n’existe plus. Modifie le profil.');
          privateKey = key.privateKey;
          if (key.encrypted && !passphrase) {
            const r = await C.ui.prompt('Phrase de passe', { label: `Clé « ${key.name} »`, type: 'password', okLabel: 'Se connecter' });
            if (r == null) return this.cancelled();
            passphrase = r;
          }
        } else if (!password) {
          const r = await this.app.askPassword(p);
          if (!r) return this.cancelled();
          password = r.password;
          if (r.remember && p.id && !p.temporary) {
            p.password = password;
            C.store.saveProfiles();
          }
        }
        const known = C.store.knownHosts[C.store.hostId(p.host, port)];
        this.term.write(`\x1b[2mConnexion à ${p.username}@${p.host}:${port}…\x1b[0m\r\n`);
        await C.backend.openSsh(this.id, {
          host: p.host.trim(),
          port,
          username: p.username,
          password,
          privateKey,
          passphrase,
          cols,
          rows,
          knownFingerprint: known ? known.fp : '',
          keepalive: Number(s.ssh.keepalive) || 0,
          timeout: Number(s.ssh.timeout) || 20,
          startupCommand: p.startupCommand || '',
        });
      } catch (e) {
        this.fail(e && e.message ? e.message : String(e));
      }
    }

    cancelled() {
      this.info('Connexion annulée. Appuie sur Entrée pour réessayer.', '33');
      this.setState('ended');
    }

    restart() {
      this.id = C.uid('s'); // nouvel identifiant : ignore les évènements tardifs de l'ancienne connexion
      this.term.write('\r\n');
      this.connect();
    }

    fail(message) {
      this.info('✖ ' + message, '31');
      this.info('Appuie sur Entrée pour réessayer.');
      this.setState('error');
    }

    /** Évènement venant de la partie native */
    handleEvent(ev) {
      switch (ev.type) {
        case 'data':
          this.term.write(ev.data);
          if (!this.isActive()) {
            this.unread = true;
            this.app.renderTabs();
          }
          break;
        case 'ready':
          this.setState('connected');
          C.backend.resize(this.id, this.term.cols, this.term.rows);
          if (this.spec.kind === 'ssh' && this.spec.onConnected) this.spec.onConnected(this);
          break;
        case 'status':
          if (ev.text) this.term.write(`\x1b[2m${ev.text}\x1b[0m\r\n`);
          break;
        case 'hostkey':
          this.setState('hostkey');
          this.app.confirmHostKey(this, ev);
          break;
        case 'error':
          this.fail(ev.message || 'Erreur inconnue');
          break;
        case 'exit':
          if (this.state === 'error') break;
          this.info(`[Session terminée${ev.code != null && ev.code !== 0 ? ' — code ' + ev.code : ''}. Entrée pour relancer.]`);
          this.setState('ended');
          if (this.app.shouldAutoClose(this, ev)) this.app.closeSession(this, true);
          break;
      }
    }

    isActive() {
      return this.app.active === this;
    }

    dispose() {
      if (this.state === 'connected' || this.state === 'connecting' || this.state === 'hostkey') C.backend.close(this.id);
      this.state = 'closed';
      try {
        this.resizeObs.disconnect();
      } catch (e) {}
      try {
        this.term.dispose();
      } catch (e) {}
      this.host.remove();
    }
  }

  C.Session = Session;
})();

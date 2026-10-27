/* Cyber — chef d'orchestre : onglets, menus, raccourcis, barre latérale */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;
  const S = () => C.store.settings;

  const UI_KEY = 'cyber.ui.v1';
  const uiPrefs = (() => {
    try {
      return JSON.parse(localStorage.getItem(UI_KEY)) || {};
    } catch (e) {
      return {};
    }
  })();
  const saveUiPrefs = () => {
    try {
      localStorage.setItem(UI_KEY, JSON.stringify(uiPrefs));
    } catch (e) {}
  };

  const app = {
    sessions: [],
    active: null,
    keyboardWanted: true,
    drawerOpen: false,

    init() {
      this.root = document.getElementById('app');
      this.termsEl = document.getElementById('terminals');
      this.tabsEl = document.getElementById('tabs');
      this.emptyEl = document.getElementById('empty-state');
      this.extraKeysEl = document.getElementById('extra-keys');
      this.searchEl = document.getElementById('searchbar');

      const btn = (id, icon, fn) => {
        const b = document.getElementById(id);
        b.innerHTML = C.icons[icon];
        b.addEventListener('click', (e) => fn(e.currentTarget));
      };
      btn('btn-menu', 'menu', () => this.toggleSidebar());
      btn('btn-new', 'plus', (el) => this.newMenu(el));
      btn('btn-snippets', 'bolt', (el) => this.snippetsMenu(el));
      btn('btn-settings', 'gear', () => C.settingsUI.open(this));
      document.getElementById('sidebar-backdrop').addEventListener('click', () => this.closeSidebarIfOverlay());

      C.backend.onEvent((ev) => {
        const s = this.sessions.find((x) => x.id === ev.id);
        if (s) s.handleEvent(ev);
      });

      const applyAll = C.debounce((path) => this.applySettings(path), 60);
      let pending = new Set();
      C.store.on((what, path) => {
        if (what === 'settings') {
          pending.add(path || '*');
          applyAll();
        } else if (what === 'profiles') {
          C.connections.render(this);
          this.renderEmpty();
          this.sessions.forEach((s) => s.spec.kind === 'ssh' && s.applySettings());
          this.renderTabs();
        }
      });
      this.applySettings = () => {
        const paths = Array.from(pending);
        pending = new Set();
        const any = (re) => paths.some((p) => p === '*' || re.test(p));
        this.sessions.forEach((s) => s.applySettings());
        this.applyChrome();
        if (any(/^(extraKeys|extraKeysLayout)/)) C.keys.render(this.extraKeysEl, this);
        if (any(/^tabsPosition/)) this.applyLayout();
        setTimeout(() => this.active && this.active.doFit(), 30);
      };

      this.applyChrome();
      C.keys.render(this.extraKeysEl, this);
      C.connections.render(this);
      this.applyLayout();
      this.setupPinch();
      this.setupSearch();

      window.addEventListener('resize', C.debounce(() => {
        this.applyLayout();
        this.active && this.active.doFit();
      }, 80));
      document.addEventListener('keydown', (e) => this.globalKey(e));
      window.__cyberBack = () => this.back();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this.sessions.forEach((s) => s.applySettings()));
      }

      // ouverture au démarrage
      const st = S().startup;
      if (st && st.startsWith('p:')) {
        const p = C.store.profiles.find((x) => 'p:' + x.id === st);
        if (p) this.openSsh(p);
        else this.openLocal();
      } else if (st !== 'none') this.openLocal();
      this.renderEmpty();
    },

    /* ---------- disposition ---------- */
    isWide() {
      return window.innerWidth >= 900;
    },

    applyLayout() {
      const wide = this.isWide();
      const root = document.documentElement;
      root.classList.toggle('wide', wide);
      root.classList.toggle('tabs-bottom', S().tabsPosition === 'bottom');
      const open = wide ? uiPrefs.sidebar !== false : this.drawerOpen;
      this.root.classList.toggle('sidebar-open', open);
      this.root.classList.toggle('sidebar-overlay', !wide);
    },

    toggleSidebar() {
      if (this.isWide()) {
        uiPrefs.sidebar = uiPrefs.sidebar === false;
        saveUiPrefs();
      } else this.drawerOpen = !this.drawerOpen;
      this.applyLayout();
      setTimeout(() => this.active && this.active.doFit(), 220);
    },

    closeSidebarIfOverlay() {
      if (!this.isWide() && this.drawerOpen) {
        this.drawerOpen = false;
        this.applyLayout();
      }
    },

    applyChrome() {
      const theme = this.active ? this.active.theme : C.themes.get(S().theme);
      const chrome = C.themes.applyChrome(theme, S().accent);
      C.backend.setBarColor(chrome);
    },

    /* ---------- sessions ---------- */
    openLocal() {
      return this.newSession({ kind: 'local' });
    },

    openSsh(profile) {
      return this.newSession({ kind: 'ssh', profile });
    },

    newSession(spec) {
      let s;
      try {
        s = new C.Session(this, spec);
      } catch (e) {
        C.ui.alert('Impossible d’ouvrir le terminal', e.message);
        return null;
      }
      this.sessions.push(s);
      this.activate(s);
      this.renderEmpty();
      requestAnimationFrame(() => s.connect());
      return s;
    },

    activate(s) {
      if (!s) return;
      this.active = s;
      for (const x of this.sessions) x.host.classList.toggle('active', x === s);
      s.unread = false;
      this.renderTabs();
      this.applyChrome();
      requestAnimationFrame(() => {
        s.doFit();
        s.focus();
      });
      const tab = this.tabsEl.querySelector(`[data-id="${s.num}"]`);
      if (tab && tab.scrollIntoView) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    },

    cycle(dir) {
      if (this.sessions.length < 2) return;
      const i = this.sessions.indexOf(this.active);
      this.activate(this.sessions[(i + dir + this.sessions.length) % this.sessions.length]);
    },

    async closeSession(s, force) {
      if (!s) return;
      if (!force && S().confirmClose && s.state === 'connected') {
        const ok = await C.ui.confirm('Fermer l’onglet', `La session « ${s.title} » est encore ouverte. La fermer ?`, 'Fermer', true);
        if (!ok) return;
      }
      const i = this.sessions.indexOf(s);
      if (i < 0) return;
      this.sessions.splice(i, 1);
      s.dispose();
      if (this.active === s) {
        this.active = null;
        const next = this.sessions[Math.min(i, this.sessions.length - 1)];
        if (next) this.activate(next);
      }
      this.renderTabs();
      this.renderEmpty();
      this.updateActiveCount();
      this.applyChrome();
    },

    shouldAutoClose() {
      return !!S().closeOnExit;
    },

    updateActiveCount() {
      const n = this.sessions.filter((s) => s.state === 'connected' || s.state === 'connecting' || s.state === 'hostkey').length;
      C.backend.setActiveSessions(n);
    },

    renderTabs() {
      const el = this.tabsEl;
      el.innerHTML = '';
      for (const s of this.sessions) {
        const tab = h(
          'div',
          {
            class: 'tab' + (s === this.active ? ' active' : '') + (s.unread ? ' unread' : ''),
            role: 'tab',
            tabindex: '0',
            'aria-selected': s === this.active ? 'true' : 'false',
            dataset: { id: String(s.num), state: s.state },
            title: s.title,
          },
          h('i', { class: 'state', style: s.spec.kind === 'ssh' && s.spec.profile.color ? { '--tag': s.spec.profile.color } : null }),
          h('span', { class: 'tab-title', text: s.title }),
          h('button', {
            type: 'button',
            class: 'tab-close',
            'aria-label': 'Fermer l’onglet',
            html: C.icons.close,
            onClick: (e) => {
              e.stopPropagation();
              this.closeSession(s);
            },
          })
        );
        tab.addEventListener('click', () => this.activate(s));
        tab.addEventListener('auxclick', (e) => {
          if (e.button === 1) this.closeSession(s);
        });
        tab.addEventListener('dblclick', () => this.renameSession(s));
        tab.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.tabMenu(s, tab);
        });
        tab.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.activate(s);
        });
        el.append(tab);
      }
    },

    async renameSession(s) {
      const v = await C.ui.prompt('Renommer l’onglet', { value: s.title, okLabel: 'Renommer' });
      if (v == null) return;
      s.customTitle = v.trim();
      this.renderTabs();
    },

    async tabMenu(s, anchor) {
      const v = await C.ui.menu(anchor, [
        { label: 'Renommer', value: 'rename', icon: 'edit' },
        { label: 'Dupliquer', value: 'dup', icon: 'copy' },
        { label: 'Reconnecter', value: 'reconnect', icon: 'link' },
        { label: 'Rechercher', value: 'search', icon: 'search' },
        { label: 'Copier tout le texte', value: 'copyall', icon: 'copy' },
        { label: 'Effacer l’écran', value: 'clear', icon: 'trash' },
        '-',
        { label: 'Fermer', value: 'close', icon: 'close', danger: true },
      ]);
      if (v === 'rename') this.renameSession(s);
      else if (v === 'dup') this.newSession(s.spec);
      else if (v === 'reconnect') {
        if (s.state === 'connected' || s.state === 'connecting') C.backend.close(s.id);
        s.restart();
      } else if (v === 'search') {
        this.activate(s);
        this.openSearch();
      } else if (v === 'copyall') this.copyAll(s);
      else if (v === 'clear') s.term.clear();
      else if (v === 'close') this.closeSession(s);
    },

    copyAll(s) {
      const buf = s.term.buffer.active;
      const lines = [];
      for (let i = 0; i < buf.length; i++) {
        const line = buf.getLine(i);
        if (line) lines.push(line.translateToString(true));
      }
      C.backend.copy(lines.join('\n').replace(/\n+$/, '\n'));
      C.toast('Texte copié');
    },

    renderEmpty() {
      const el = this.emptyEl;
      if (this.sessions.length) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.innerHTML = '';
      const recent = C.store.profiles.slice(0, 6);
      el.append(
        h('div', { class: 'empty-logo', html: C.icons.term }),
        h('h1', { text: 'Cyber' }),
        h('p', { class: 'hint', text: 'Terminal local et SSH, à ta façon.' }),
        h(
          'div',
          { class: 'empty-actions' },
          h('button', { type: 'button', class: 'btn primary', onClick: () => this.openLocal() }, C.icon('term'), 'Shell local'),
          h('button', { type: 'button', class: 'btn', onClick: () => this.newSshDialog() }, C.icon('server'), 'Nouvelle connexion SSH')
        ),
        recent.length
          ? h(
              'div',
              { class: 'empty-recent' },
              recent.map((p) =>
                h('button', { type: 'button', class: 'chip', onClick: () => this.openSsh(p) }, h('i', { class: 'conn-tag', style: { background: p.color || '#b56cff' } }), p.name || p.host)
              )
            )
          : null
      );
    },

    async newSshDialog() {
      const p = await C.connections.edit(this, null);
      if (p) this.openSsh(p);
    },

    async newMenu(anchor) {
      const items = [{ label: 'Shell local', value: 'local', icon: 'term', hint: { windows: 'PowerShell', linux: 'ton shell', android: 'Android' }[C.backend.platform] || '' }];
      if (C.store.profiles.length) {
        items.push('-', { header: 'Connexions SSH' });
        for (const p of C.store.profiles) items.push({ label: p.name || p.host, value: 'p:' + p.id, icon: 'server', hint: `${p.username}@${p.host}`, dot: p.color });
      }
      items.push('-', { label: 'Nouvelle connexion…', value: 'new', icon: 'plus' }, { label: 'Connexion rapide…', value: 'quick', icon: 'link' });
      const v = await C.ui.menu(anchor, items);
      if (!v) return;
      if (v === 'local') this.openLocal();
      else if (v === 'new') this.newSshDialog();
      else if (v === 'quick') {
        const text = await C.ui.prompt('Connexion rapide', { label: 'utilisateur@hôte:port', placeholder: 'pi@192.168.1.20', okLabel: 'Se connecter' });
        if (!text) return;
        const q = C.connections.parseQuick(text);
        if (!q || !q.username) return C.toast('Format : utilisateur@hôte:port', 'bad');
        this.openSsh({ id: '', name: `${q.username}@${q.host}`, auth: 'password', temporary: true, ...q });
      } else if (v.startsWith('p:')) {
        const p = C.store.profiles.find((x) => 'p:' + x.id === v);
        if (p) this.openSsh(p);
      }
    },

    async snippetsMenu(anchor) {
      const list = S().snippets.filter((x) => x.command);
      const items = list.map((x, i) => ({ label: x.name || x.command, hint: x.name ? x.command : '', value: 'i' + i, icon: 'bolt' }));
      if (!items.length) items.push({ label: 'Aucune commande enregistrée', value: null, disabled: true });
      items.push('-', { label: 'Gérer les commandes…', value: 'manage', icon: 'gear' });
      const v = await C.ui.menu(anchor, items);
      if (!v) return;
      if (v === 'manage') return C.settingsUI.open(this, 'commandes');
      const sn = list[Number(v.slice(1))];
      if (!this.active) return C.toast('Ouvre d’abord un terminal', 'bad');
      this.active.send(sn.command + (sn.enter ? '\r' : ''));
      this.active.focus();
    },

    extraAction(action, btn) {
      if (action === 'paste') this.active && this.active.pasteFromClipboard();
      else if (action === 'snippets') this.snippetsMenu(btn);
      else if (action === 'menu') this.toggleSidebar();
      else if (action === 'keyboard') {
        const ta = this.active && this.active.term.textarea;
        if (!ta) return;
        if (document.activeElement === ta) ta.blur();
        else ta.focus();
      }
    },

    /* ---------- dialogues liés aux connexions ---------- */
    askPassword(p) {
      const input = h('input', { type: 'password', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
      const remember = h('input', { type: 'checkbox' });
      const body = h(
        'div',
        { class: 'form' },
        h('p', { class: 'hint', text: `${p.username}@${p.host}:${p.port || 22}` }),
        C.ui.field('Mot de passe', input),
        p.temporary ? null : h('label', { class: 'check' }, remember, h('span', { text: 'Mémoriser sur cet appareil' }))
      );
      return C.ui.dialog({
        title: 'Connexion SSH',
        icon: 'key',
        body,
        buttons: [
          { label: 'Annuler', value: null },
          { label: 'Se connecter', kind: 'primary', value: () => ({ password: input.value, remember: remember.checked }) },
        ],
      });
    },

    async confirmHostKey(s, ev) {
      const changed = !!ev.changed;
      const body = h(
        'div',
        { class: 'form' },
        h('p', {
          class: changed ? 'warn-text' : '',
          text: changed
            ? 'La clé de ce serveur a changé depuis ta dernière connexion. C’est normal après une réinstallation, mais ça peut aussi signaler une interception. Ne continue que si tu sais pourquoi.'
            : 'Première connexion à ce serveur. Vérifie si possible que l’empreinte correspond à celle du serveur, puis fais-lui confiance.',
        }),
        h('div', { class: 'kv' }, h('span', { text: 'Serveur' }), h('code', { text: `${ev.host}:${ev.port}` })),
        h('div', { class: 'kv' }, h('span', { text: 'Type de clé' }), h('code', { text: ev.algo || '?' })),
        h('div', { class: 'kv' }, h('span', { text: 'Empreinte' }), h('code', { class: 'fp', text: ev.fingerprint })),
        changed && ev.expected ? h('div', { class: 'kv' }, h('span', { text: 'Ancienne' }), h('code', { class: 'fp', text: ev.expected })) : null
      );
      const ok = await C.ui.dialog({
        title: changed ? 'Clé du serveur modifiée' : 'Nouveau serveur',
        icon: changed ? 'warn' : 'shield',
        body,
        wide: true,
        cancelValue: false,
        buttons: [
          { label: 'Refuser', value: false },
          { label: changed ? 'Remplacer et continuer' : 'Faire confiance', value: true, kind: changed ? 'danger' : 'primary' },
        ],
      });
      if (ok) {
        C.store.knownHosts[C.store.hostId(ev.host, ev.port)] = { fp: ev.fingerprint, algo: ev.algo || '', added: new Date().toISOString() };
        C.store.saveHosts();
        s.setState('connecting');
      }
      C.backend.answerHostKey(s.id, ok);
      s.focus();
    },

    /* ---------- clavier ---------- */
    handleKey(e, s) {
      if (e.type !== 'keydown') return true;
      const ctrl = e.ctrlKey || e.metaKey;
      const k = e.key;
      const lower = k.length === 1 ? k.toLowerCase() : k;
      const stop = () => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      if (ctrl && e.shiftKey && !e.altKey) {
        switch (lower) {
          case 't':
            this.openLocal();
            return stop();
          case 'n':
            this.newSshDialog();
            return stop();
          case 'w':
            this.closeSession(s);
            return stop();
          case 'c':
            if (s.term.hasSelection()) {
              C.backend.copy(s.term.getSelection());
              C.toast('Copié');
            }
            return stop();
          case 'v':
            s.pasteFromClipboard();
            return stop();
          case 'f':
            this.openSearch();
            return stop();
        }
      }
      if (ctrl && k === 'Tab') {
        this.cycle(e.shiftKey ? -1 : 1);
        return stop();
      }
      if (ctrl && !e.shiftKey && !e.altKey) {
        if (k === ',') {
          C.settingsUI.open(this);
          return stop();
        }
        if (k === '=' || k === '+') {
          this.zoom(1);
          return stop();
        }
        if (k === '-') {
          this.zoom(-1);
          return stop();
        }
        if (k === '0') {
          this.zoom(0);
          return stop();
        }
        if (S().winClipboardKeys && !C.isTouch) {
          if (lower === 'c' && s.term.hasSelection()) {
            C.backend.copy(s.term.getSelection());
            s.term.clearSelection();
            return stop();
          }
          if (lower === 'v') {
            s.pasteFromClipboard();
            return stop();
          }
        }
      }
      if (e.altKey && !ctrl && /^[1-9]$/.test(k) && this.sessions[Number(k) - 1] && !C.isTouch) {
        this.activate(this.sessions[Number(k) - 1]);
        return stop();
      }
      return true;
    },

    globalKey(e) {
      if (e.key === 'Escape' && C.ui.hasLayer()) {
        e.preventDefault();
        C.ui.closeTop();
        return;
      }
      const t = e.target;
      if (t && t.closest && t.closest('.xterm')) return; // géré par handleKey
      if (C.ui.hasLayer()) return;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const ctrl = e.ctrlKey || e.metaKey;
      const lower = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (ctrl && e.shiftKey && lower === 't') {
        e.preventDefault();
        this.openLocal();
      } else if (ctrl && e.shiftKey && lower === 'n') {
        e.preventDefault();
        this.newSshDialog();
      } else if (ctrl && e.key === ',') {
        e.preventDefault();
        C.settingsUI.open(this);
      }
    },

    zoom(dir) {
      const size = dir === 0 ? C.store.defaults.fontSize : C.clamp(S().fontSize + dir, 8, 32);
      C.store.set('fontSize', size);
      C.toast(`Texte : ${size} px`);
    },

    bell(s) {
      const mode = S().bell;
      if (mode === 'visual') {
        s.host.classList.remove('bell');
        void s.host.offsetWidth;
        s.host.classList.add('bell');
      } else if (mode === 'vibrate') C.backend.vibrate(80);
      else if (mode === 'sound') {
        try {
          const ctx = this.audio || (this.audio = new (window.AudioContext || window.webkitAudioContext)());
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.08, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
          o.connect(g).connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.16);
        } catch (e) {}
      }
    },

    back() {
      if (C.ui.closeTop()) return true;
      if (!this.searchEl.hidden) {
        this.closeSearch();
        return true;
      }
      if (!this.isWide() && this.drawerOpen) {
        this.closeSidebarIfOverlay();
        return true;
      }
      return false;
    },

    /* ---------- zoom à deux doigts ---------- */
    setupPinch() {
      let start = 0;
      let base = 0;
      let size = 0;
      const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
      this.termsEl.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 2 && S().pinchZoom && this.active) {
            start = dist(e.touches);
            base = size = S().fontSize;
          }
        },
        { passive: true, capture: true }
      );
      this.termsEl.addEventListener(
        'touchmove',
        (e) => {
          if (!start || e.touches.length !== 2) return;
          e.preventDefault();
          e.stopPropagation();
          const next = C.clamp(Math.round(base * (dist(e.touches) / start)), 8, 32);
          if (next !== size && this.active) {
            size = next;
            this.active.term.options.fontSize = size;
            this.active.doFit();
          }
        },
        { passive: false, capture: true }
      );
      const end = () => {
        if (!start) return;
        start = 0;
        if (size && size !== S().fontSize) C.store.set('fontSize', size);
      };
      this.termsEl.addEventListener('touchend', end, { capture: true });
      this.termsEl.addEventListener('touchcancel', end, { capture: true });
    },

    /* ---------- recherche ---------- */
    setupSearch() {
      const el = this.searchEl;
      const input = h('input', { type: 'search', placeholder: 'Rechercher…', autocapitalize: 'off', spellcheck: 'false' });
      const opts = { caseSensitive: false, regex: false };
      const find = (dir) => {
        const s = this.active;
        if (!s || !s.search || !input.value) return;
        const found = dir < 0 ? s.search.findPrevious(input.value, opts) : s.search.findNext(input.value, opts);
        input.classList.toggle('miss', !found);
      };
      input.addEventListener('input', () => find(1));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') find(e.shiftKey ? -1 : 1);
        if (e.key === 'Escape') this.closeSearch();
      });
      el.append(
        C.icon('search'),
        input,
        h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Précédent', html: C.icons.up, onClick: () => find(-1) }),
        h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Suivant', html: C.icons.down, onClick: () => find(1) }),
        h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Fermer la recherche', html: C.icons.close, onClick: () => this.closeSearch() })
      );
      this.searchInput = input;
    },

    openSearch() {
      if (!this.active || !this.active.search) return;
      this.searchEl.hidden = false;
      const sel = this.active.term.getSelection();
      if (sel && sel.length < 80) this.searchInput.value = sel;
      this.searchInput.focus();
      this.searchInput.select();
    },

    closeSearch() {
      this.searchEl.hidden = true;
      if (this.active && this.active.search && this.active.search.clearDecorations) this.active.search.clearDecorations();
      this.active && this.active.focus();
    },
  };

  C.app = app;
  const start = () => {
    try {
      app.init();
    } catch (e) {
      console.error(e);
      document.body.append(h('pre', { class: 'fatal', text: 'Cyber n’a pas pu démarrer :\n' + (e && e.stack ? e.stack : e) }));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

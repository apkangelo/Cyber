/* Cyber — panneau des réglages */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;
  const ui = () => C.ui;
  const S = () => C.store.settings;
  const set = (path, v) => C.store.set(path, v);

  const SECTIONS = [
    { id: 'apparence', label: 'Apparence' },
    { id: 'couleurs', label: 'Couleurs' },
    { id: 'police', label: 'Police' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'clavier', label: 'Clavier' },
    { id: 'shell', label: 'Shell local' },
    { id: 'ssh', label: 'SSH et clés' },
    { id: 'commandes', label: 'Commandes rapides' },
    { id: 'sauvegarde', label: 'Sauvegarde' },
    { id: 'apropos', label: 'À propos' },
  ];

  let panel = null;
  let current = 'apparence';
  let appRef = null;
  let popLayer = null;

  /* ---------- aperçu d'un thème ---------- */
  function preview(theme) {
    const c = theme.colors;
    const span = (color, text, bold) => h('span', { style: { color, fontWeight: bold ? '700' : '400' }, text });
    return h(
      'div',
      { class: 'theme-preview', style: { background: c.background, color: c.foreground } },
      h('div', {}, span(c.green, 'moi@cyber', true), span(c.foreground, ':'), span(c.blue, '~', true), span(c.foreground, '$ ls')),
      h('div', {}, span(c.blue, 'docs  '), span(c.green, 'run.sh  '), span(c.magenta, 'img.png')),
      h('div', {}, span(c.red, 'erreur '), span(c.yellow, 'attention '), span(c.cyan, 'info')),
      h('div', { class: 'pv-cursor' }, span(c.foreground, '$ '), h('i', { style: { background: c.cursor } })),
      h('div', { class: 'pv-ansi' }, C.themes.ANSI.slice(0, 8).map((k) => h('i', { style: { background: c[k] } })))
    );
  }

  /* ---------- sections ---------- */
  const build = {
    apparence() {
      const grid = h('div', { class: 'theme-grid' });
      for (const t of C.themes.list()) {
        const card = h(
          'button',
          { type: 'button', class: 'theme-card' + (S().theme === t.id ? ' on' : ''), onClick: () => { set('theme', t.id); if (S().accentFollowsTheme) set('accent', t.colors.cursor); refresh(); } },
          preview(t),
          h('span', { class: 'theme-name' }, t.name, t.builtin ? null : h('small', { text: ' perso' }))
        );
        grid.append(card);
      }
      return [
        h('h3', { text: 'Thème' }),
        grid,
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', text: 'Personnaliser les couleurs', onClick: () => show('couleurs') }), h('button', { type: 'button', class: 'btn', text: 'Importer un thème', onClick: importTheme })),
        h('h3', { text: 'Interface' }),
        ui().row('Couleur d’accent', h('div', { class: 'inline' }, ui().color(S().accent, (v) => set('accent', v)), h('button', { type: 'button', class: 'btn small', text: 'Celle du thème', onClick: () => { set('accent', C.themes.get(S().theme).colors.cursor); refresh(); } })), 'Onglet actif, boutons, touches CTRL/ALT…'),
        ui().row('Accent qui suit le thème', ui().toggle(S().accentFollowsTheme, (v) => set('accentFollowsTheme', v))),
        ui().row('Marge autour du texte', ui().range(0, 32, 1, S().padding, (v) => v + ' px', (v) => set('padding', v))),
        ui().row('Position des onglets', ui().segmented([{ value: 'top', label: 'En haut' }, { value: 'bottom', label: 'En bas' }], S().tabsPosition, (v) => set('tabsPosition', v))),
      ];
    },

    couleurs() {
      const theme = C.themes.get(S().theme);
      const nodes = [];
      const intro = theme.builtin
        ? 'Ce thème est intégré : la première modification crée une copie personnelle que tu peux renommer.'
        : 'Thème personnel : tes changements sont enregistrés directement.';
      nodes.push(h('p', { class: 'hint', text: intro }));
      let working = theme;
      const ensureCustom = () => {
        if (!working.builtin) return working;
        const copy = { id: C.uid('t'), name: theme.name + ' (perso)', colors: { ...theme.colors } };
        S().customThemes.push(copy);
        set('theme', copy.id);
        working = C.themes.get(copy.id);
        nameInput.value = copy.name;
        nameInput.disabled = false;
        delBtn.disabled = false;
        return working;
      };
      const nameInput = h('input', { type: 'text', value: theme.name, disabled: theme.builtin });
      nameInput.addEventListener('change', () => {
        const t = ensureCustom();
        const stored = S().customThemes.find((x) => x.id === t.id);
        stored.name = nameInput.value.trim() || 'Mon thème';
        C.store.saveSettings('customThemes');
      });
      const pv = h('div', { class: 'live-preview' }, preview(theme));
      const setColor = (key, value) => {
        const t = ensureCustom();
        const stored = S().customThemes.find((x) => x.id === t.id);
        stored.colors[key] = value;
        C.store.saveSettings('customThemes');
        pv.innerHTML = '';
        pv.append(preview(C.themes.get(t.id)));
      };
      const colorRow = (key) => h('label', { class: 'color-cell' }, ui().color(theme.colors[key], (v) => setColor(key, v)), h('span', { text: C.themes.LABELS[key] }));
      const delBtn = h('button', {
        type: 'button',
        class: 'btn danger',
        text: 'Supprimer ce thème',
        disabled: theme.builtin,
        onClick: async () => {
          if (!(await ui().confirm('Supprimer le thème', `Supprimer « ${nameInput.value} » ?`, 'Supprimer', true))) return;
          S().customThemes = S().customThemes.filter((x) => x.id !== working.id);
          set('theme', 'cyber');
          refresh();
        },
      });
      nodes.push(
        ui().field('Nom du thème', nameInput),
        pv,
        h('h3', { text: 'Base' }),
        h('div', { class: 'color-grid' }, C.themes.BASE_KEYS.map(colorRow)),
        h('h3', { text: 'Les 16 couleurs ANSI' }),
        h('div', { class: 'color-grid' }, C.themes.ANSI.map(colorRow)),
        h(
          'div',
          { class: 'actions' },
          h('button', { type: 'button', class: 'btn', text: 'Afficher le test des couleurs', onClick: () => { appRef.active && appRef.active.term.write('\r\n' + C.themes.sampleAnsi()); close(); } }),
          h('button', { type: 'button', class: 'btn', text: 'Exporter ce thème', onClick: () => exportTheme(C.themes.get(S().theme)) }),
          delBtn
        )
      );
      return nodes;
    },

    police() {
      const custom = h('input', { type: 'text', placeholder: 'Nom exact de la police installée', value: S().customFont });
      custom.addEventListener('change', () => set('customFont', custom.value.trim()));
      const customRow = ui().field('Police personnalisée', custom);
      customRow.hidden = S().fontFamily !== 'custom';
      return [
        h('h3', { text: 'Caractères' }),
        ui().row('Police', ui().select(C.FONT_CHOICES, S().fontFamily, (v) => { set('fontFamily', v); customRow.hidden = v !== 'custom'; })),
        customRow,
        ui().row('Taille', ui().range(8, 32, 1, S().fontSize, (v) => v + ' px', (v) => set('fontSize', v)), C.isTouch ? 'Astuce : pince le terminal avec deux doigts pour zoomer.' : 'Raccourcis : Ctrl + / Ctrl − / Ctrl 0'),
        ui().row('Interligne', ui().range(1, 2, 0.05, S().lineHeight, (v) => v.toFixed(2), (v) => set('lineHeight', v))),
        ui().row('Espacement des lettres', ui().range(0, 6, 0.5, S().letterSpacing, (v) => v + ' px', (v) => set('letterSpacing', v))),
        ui().row('Graisse normale', ui().select([{ value: '300', label: 'Fine' }, { value: 'normal', label: 'Normale' }, { value: '500', label: 'Moyenne' }, { value: '600', label: 'Semi-grasse' }], S().fontWeight, (v) => set('fontWeight', v))),
        ui().row('Graisse du gras', ui().select([{ value: '500', label: 'Moyenne' }, { value: '600', label: 'Semi-grasse' }, { value: 'bold', label: 'Grasse' }, { value: '800', label: 'Très grasse' }], S().fontWeightBold, (v) => set('fontWeightBold', v))),
        ui().row('Gras en couleurs vives', ui().toggle(S().boldBright, (v) => set('boldBright', v))),
        ui().row('Contraste minimum', ui().range(1, 7, 0.5, S().minContrast, (v) => (v === 1 ? 'désactivé' : v.toFixed(1)), (v) => set('minContrast', v)), 'Éclaircit le texte peu lisible sur le fond.'),
      ];
    },

    terminal() {
      return [
        h('h3', { text: 'Curseur' }),
        ui().row('Forme', ui().segmented([{ value: 'block', label: '█ Bloc' }, { value: 'underline', label: '_ Trait bas' }, { value: 'bar', label: '│ Barre' }], S().cursorStyle, (v) => set('cursorStyle', v))),
        ui().row('Clignotement', ui().toggle(S().cursorBlink, (v) => set('cursorBlink', v))),
        h('h3', { text: 'Comportement' }),
        ui().row('Historique', ui().range(1000, 100000, 1000, S().scrollback, (v) => v.toLocaleString('fr-FR') + ' lignes', (v) => set('scrollback', v))),
        ui().row('Sonnerie', ui().select([{ value: 'none', label: 'Aucune' }, { value: 'visual', label: 'Flash' }, { value: 'sound', label: 'Son' }, { value: 'vibrate', label: 'Vibration' }], S().bell, (v) => set('bell', v))),
        ui().row('Copier en sélectionnant', ui().toggle(S().copyOnSelect, (v) => set('copyOnSelect', v))),
        C.isTouch ? null : ui().row('Clic droit : copier / coller', ui().toggle(S().rightClickPaste, (v) => set('rightClickPaste', v))),
        C.isTouch ? null : ui().row('Ctrl+C / Ctrl+V copient et collent', ui().toggle(S().winClipboardKeys, (v) => set('winClipboardKeys', v)), 'Ctrl+C copie s’il y a une sélection, sinon il interrompt la commande.'),
        ui().row('Rendu', ui().select([{ value: 'auto', label: 'Automatique (GPU)' }, { value: 'webgl', label: 'GPU (WebGL)' }, { value: 'dom', label: 'Classique' }], S().renderer, (v) => set('renderer', v)), 'Passe en « Classique » si l’affichage clignote.'),
        ui().row('Demander avant de fermer', ui().toggle(S().confirmClose, (v) => set('confirmClose', v))),
        ui().row('Fermer l’onglet quand la session se termine', ui().toggle(S().closeOnExit, (v) => set('closeOnExit', v))),
        h('h3', { text: 'Au démarrage' }),
        ui().row(
          'Ouvrir',
          ui().select(
            [{ value: 'local', label: 'Un shell local' }, { value: 'none', label: 'Rien (écran d’accueil)' }].concat(C.store.profiles.map((p) => ({ value: 'p:' + p.id, label: 'SSH : ' + (p.name || p.host) }))),
            S().startup,
            (v) => set('startup', v)
          )
        ),
      ];
    },

    clavier() {
      const layout = h('textarea', { rows: 4, spellcheck: 'false', autocapitalize: 'off', class: 'mono' });
      layout.value = S().extraKeysLayout;
      layout.addEventListener('change', () => set('extraKeysLayout', layout.value));
      const names = Object.keys(C.keys.SPECIAL).filter((k) => !/^F([2-9]|1[0-2])$/.test(k));
      return [
        h('h3', { text: 'Touches supplémentaires' }),
        ui().row('Afficher la barre', ui().segmented([{ value: 'auto', label: 'Écran tactile' }, { value: 'always', label: 'Toujours' }, { value: 'never', label: 'Jamais' }], S().extraKeys, (v) => set('extraKeys', v))),
        ui().field('Disposition (une ligne par rangée, touches séparées par des espaces)', layout),
        h('p', { class: 'hint' }, 'Touches spéciales : ', names.join(', '), ', F1 à F12. Tout autre texte est envoyé tel quel (ex. « | », « ~ », « :wq »). CTRL et ALT : un appui = une fois, deux appuis rapides = verrouillé.'),
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', text: 'Disposition par défaut', onClick: () => { set('extraKeysLayout', C.store.defaults.extraKeysLayout); refresh(); } }), h('button', { type: 'button', class: 'btn', text: 'Avec F1–F12', onClick: () => { set('extraKeysLayout', 'ESC / - HOME UP END PGUP\nTAB CTRL ALT LEFT DOWN RIGHT PGDN\nF1 F2 F3 F4 F5 F6 PASTE SNIP'); refresh(); } })),
        ui().row('Vibrer à chaque touche', ui().toggle(S().keyVibrate, (v) => set('keyVibrate', v))),
        ui().row('Zoom à deux doigts', ui().toggle(S().pinchZoom, (v) => set('pinchZoom', v))),
        C.isTouch ? null : h('h3', { text: 'Raccourcis' }),
        C.isTouch
          ? null
          : h('div', { class: 'shortcuts' },
              [
                ['Ctrl+Maj+T', 'Nouveau shell local'],
                ['Ctrl+Maj+N', 'Nouvelle connexion SSH'],
                ['Ctrl+Maj+W', 'Fermer l’onglet'],
                ['Ctrl+Tab / Ctrl+Maj+Tab', 'Onglet suivant / précédent'],
                ['Ctrl+Maj+C / Ctrl+Maj+V', 'Copier / coller'],
                ['Ctrl+Maj+F', 'Rechercher'],
                ['Ctrl + / Ctrl − / Ctrl 0', 'Taille du texte'],
                ['Ctrl+,', 'Réglages'],
              ].map(([k, v]) => h('div', { class: 'shortcut' }, h('kbd', { text: k }), h('span', { text: v })))
            ),
      ];
    },

    shell() {
      const s = S().localShell;
      const isAndroid = C.backend.platform === 'android';
      const isWin = C.backend.platform === 'windows';
      const field = (key, placeholder) => {
        const el = h('input', { type: 'text', placeholder, autocapitalize: 'off', spellcheck: 'false', class: 'mono' });
        el.value = s[key] || '';
        el.addEventListener('change', () => set('localShell.' + key, el.value.trim()));
        return el;
      };
      const rc = h('textarea', { rows: 9, spellcheck: 'false', autocapitalize: 'off', class: 'mono' });
      rc.value = s.rc || '';
      rc.addEventListener('change', () => set('localShell.rc', rc.value));
      const nodes = [
        h('h3', { text: 'Programme lancé' }),
        ui().field('Commande', field('command', isAndroid ? '/system/bin/sh' : isWin ? 'powershell.exe (ou cmd.exe, pwsh, wsl.exe)' : '$SHELL (ex. /bin/bash, /bin/zsh)'), 'Laisse vide pour le shell par défaut.'),
        ui().field('Arguments', field('args', isWin ? '-NoLogo' : '-l')),
        ui().field('Dossier de départ', field('cwd', isAndroid ? 'Dossier de l’appli' : 'Dossier personnel')),
      ];
      if (isAndroid) {
        nodes.push(
          h('h3', { text: 'Script de démarrage' }),
          h('p', { class: 'hint', text: 'Exécuté à chaque ouverture du shell local (variable ENV de mksh) : invite, alias, variables…' }),
          rc,
          h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn', text: 'Remettre le script par défaut', onClick: () => { set('localShell.rc', C.store.DEFAULT_RC); refresh(); } })),
          h('p', { class: 'hint', text: 'Le shell local d’Android donne accès aux commandes du système (ls, cat, ping, top…). Pour un Linux complet, connecte-toi en SSH à un serveur.' })
        );
      }
      return nodes;
    },

    ssh() {
      const keyList = h('div', { class: 'list' });
      const renderKeys = () => {
        keyList.innerHTML = '';
        if (!C.store.keys.length) keyList.append(h('p', { class: 'hint', text: 'Aucune clé. Génère une clé Ed25519 ou importe la tienne.' }));
        for (const k of C.store.keys) {
          keyList.append(
            h(
              'div',
              { class: 'list-item' },
              C.icon('key'),
              h('div', { class: 'li-text' }, h('strong', { text: k.name }), h('small', { class: 'mono', text: `${k.type}${k.encrypted ? ' · protégée' : ''}${k.fingerprint ? ' · ' + k.fingerprint : ''}` })),
              k.publicKey
                ? h('button', { type: 'button', class: 'icon-btn small', title: 'Copier la clé publique', 'aria-label': 'Copier la clé publique', html: C.icons.copy, onClick: () => { C.backend.copy(k.publicKey); C.toast('Clé publique copiée'); } })
                : null,
              h('button', {
                type: 'button',
                class: 'icon-btn small',
                title: 'Supprimer',
                'aria-label': 'Supprimer',
                html: C.icons.trash,
                onClick: async () => {
                  if (!(await ui().confirm('Supprimer la clé', `Supprimer « ${k.name} » ? Les profils qui l’utilisent ne pourront plus se connecter.`, 'Supprimer', true))) return;
                  C.store.keys = C.store.keys.filter((x) => x !== k);
                  C.store.saveKeys();
                  renderKeys();
                },
              })
            )
          );
        }
      };
      renderKeys();

      const hostList = h('div', { class: 'list' });
      const renderHosts = () => {
        hostList.innerHTML = '';
        const entries = Object.entries(C.store.knownHosts);
        if (!entries.length) hostList.append(h('p', { class: 'hint', text: 'Aucun serveur mémorisé pour le moment.' }));
        for (const [id, v] of entries) {
          hostList.append(
            h(
              'div',
              { class: 'list-item' },
              C.icon('shield'),
              h('div', { class: 'li-text' }, h('strong', { text: id }), h('small', { class: 'mono', text: `${v.algo || ''} ${v.fp}` })),
              h('button', {
                type: 'button',
                class: 'icon-btn small',
                title: 'Oublier',
                'aria-label': 'Oublier',
                html: C.icons.trash,
                onClick: () => {
                  delete C.store.knownHosts[id];
                  C.store.saveHosts();
                  renderHosts();
                },
              })
            )
          );
        }
      };
      renderHosts();

      return [
        h('h3', { text: 'Connexion' }),
        ui().row('Maintien de connexion', ui().range(0, 120, 5, S().ssh.keepalive, (v) => (v ? `toutes les ${v} s` : 'désactivé'), (v) => set('ssh.keepalive', v)), 'Évite les coupures sur les réseaux qui ferment les connexions inactives.'),
        ui().row('Délai de connexion', ui().range(5, 60, 5, S().ssh.timeout, (v) => v + ' s', (v) => set('ssh.timeout', v))),
        h('h3', { text: 'Clés' }),
        keyList,
        h(
          'div',
          { class: 'actions' },
          h('button', { type: 'button', class: 'btn primary', text: 'Générer une clé Ed25519', onClick: async () => { if (await generateKeyFlow()) renderKeys(); } }),
          h('button', { type: 'button', class: 'btn', text: 'Importer une clé', onClick: async () => { if (await importKeyFlow()) renderKeys(); } })
        ),
        h('p', { class: 'hint', text: 'Ajoute la clé publique dans ~/.ssh/authorized_keys sur le serveur. Les clés sont stockées sur cet appareil, sans chiffrement supplémentaire.' }),
        h('h3', { text: 'Serveurs de confiance' }),
        hostList,
      ];
    },

    commandes() {
      const list = h('div', { class: 'snippets-edit' });
      const render = () => {
        list.innerHTML = '';
        S().snippets.forEach((sn, i) => {
          const name = h('input', { type: 'text', value: sn.name, placeholder: 'Nom' });
          const cmd = h('input', { type: 'text', value: sn.command, placeholder: 'Commande', class: 'mono', autocapitalize: 'off', spellcheck: 'false' });
          const save = () => {
            sn.name = name.value;
            sn.command = cmd.value;
            C.store.saveSettings('snippets');
          };
          name.addEventListener('change', save);
          cmd.addEventListener('change', save);
          list.append(
            h(
              'div',
              { class: 'snippet-row' },
              h('div', { class: 'snippet-fields' }, name, cmd),
              h('label', { class: 'mini-check', title: 'Appuyer sur Entrée après la commande' }, ui().toggle(sn.enter, (v) => { sn.enter = v; C.store.saveSettings('snippets'); }), h('span', { text: 'Entrée' })),
              h('button', { type: 'button', class: 'icon-btn small', title: 'Supprimer', 'aria-label': 'Supprimer', html: C.icons.trash, onClick: () => { S().snippets.splice(i, 1); C.store.saveSettings('snippets'); render(); } })
            )
          );
        });
      };
      render();
      return [
        h('p', { class: 'hint', text: 'Accessibles par le bouton ⚡ en haut (ou la touche SNIP de la barre). « Entrée » lance la commande directement.' }),
        list,
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn primary', text: 'Ajouter une commande', onClick: () => { S().snippets.push({ id: C.uid('sn'), name: '', command: '', enter: true }); C.store.saveSettings('snippets'); render(); } })),
      ];
    },

    sauvegarde() {
      let withSecrets = false;
      return [
        h('p', { class: 'hint', text: 'Exporte tous tes réglages, thèmes, connexions et serveurs de confiance dans un fichier JSON, pour les retrouver sur un autre appareil (Android ↔ Windows ↔ Linux).' }),
        ui().row('Inclure mots de passe et clés privées', ui().toggle(false, (v) => (withSecrets = v)), 'À ne faire que si tu gardes le fichier en lieu sûr.'),
        h(
          'div',
          { class: 'actions' },
          h('button', { type: 'button', class: 'btn primary', text: 'Exporter', onClick: () => C.backend.saveText('cyber-sauvegarde.json', JSON.stringify(C.store.exportAll(withSecrets), null, 2)) }),
          h('button', { type: 'button', class: 'btn', text: 'Copier dans le presse-papiers', onClick: () => { C.backend.copy(JSON.stringify(C.store.exportAll(withSecrets))); C.toast('Sauvegarde copiée'); } })
        ),
        h('h3', { text: 'Restaurer' }),
        h(
          'div',
          { class: 'actions' },
          h('button', { type: 'button', class: 'btn', text: 'Depuis un fichier', onClick: async () => restore(await C.pickTextFile('.json,application/json,text/plain')) }),
          h('button', { type: 'button', class: 'btn', text: 'Coller une sauvegarde', onClick: async () => restore(await ui().prompt('Coller une sauvegarde', { multiline: true, okLabel: 'Restaurer' })) })
        ),
        h('h3', { text: 'Réinitialiser' }),
        h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn danger', text: 'Remettre les réglages par défaut', onClick: async () => { if (await ui().confirm('Réinitialiser', 'Les réglages reviennent par défaut. Tes connexions, clés et thèmes personnels sont conservés.', 'Réinitialiser', true)) { const themes = S().customThemes; C.store.resetSettings(); S().customThemes = themes; C.store.saveSettings('*'); refresh(); } } })),
      ];
    },

    apropos() {
      return [
        h('div', { class: 'about' }, h('div', { class: 'about-logo', html: C.icons.term }), h('h3', { text: 'Cyber' + (C.backend.version ? ' ' + C.backend.version : '') }), h('p', { text: 'Terminal SSH personnalisable pour Android, Windows et Linux.' }), h('p', { class: 'hint', text: 'Plateforme : ' + C.backend.platformLabel })),
        h('div', { class: 'actions center' }, h('button', { type: 'button', class: 'btn', text: 'Dépôt GitHub', onClick: () => C.backend.openExternal('https://github.com/apk-fold/Cyber') }), h('button', { type: 'button', class: 'btn', text: 'Dernière version', onClick: () => C.backend.openExternal('https://github.com/apk-fold/Cyber/releases/latest') })),
        h('p', { class: 'hint center', text: 'Construit avec xterm.js, ssh2 (PC) et JSch (Android).' }),
      ];
    },
  };

  async function restore(text) {
    if (!text) return;
    try {
      C.store.importAll(JSON.parse(text));
      C.toast('Sauvegarde restaurée', 'good');
      refresh();
    } catch (e) {
      ui().alert('Restauration impossible', e.message);
    }
  }

  function exportTheme(theme) {
    const data = JSON.stringify({ app: 'Cyber', type: 'theme', name: theme.name, colors: theme.colors }, null, 2);
    C.backend.copy(data);
    C.toast('Thème copié dans le presse-papiers');
  }

  async function importTheme() {
    const text = await ui().prompt('Importer un thème', { multiline: true, label: 'Colle le JSON d’un thème Cyber', okLabel: 'Importer' });
    if (!text) return;
    try {
      const d = JSON.parse(text);
      const colors = d.colors || d;
      if (!colors.background || !colors.foreground) throw new Error('Il manque au moins « background » et « foreground ».');
      const base = C.themes.presets[0].colors;
      const t = { id: C.uid('t'), name: d.name || 'Thème importé', colors: { ...base, ...colors } };
      S().customThemes.push(t);
      set('theme', t.id);
      refresh();
      C.toast('Thème importé', 'good');
    } catch (e) {
      ui().alert('Thème invalide', e.message);
    }
  }

  async function generateKeyFlow() {
    const name = await ui().prompt('Nouvelle clé SSH', { label: 'Nom de la clé', value: 'cyber-' + (C.backend.platform || 'cle'), okLabel: 'Générer' });
    if (name == null) return null;
    try {
      const k = await C.keygen.generateEd25519((name.trim() || 'cyber') + '@cyber');
      const entry = { id: C.uid('k'), name: name.trim() || 'Clé Cyber', created: new Date().toISOString(), ...k };
      C.store.keys.push(entry);
      C.store.saveKeys();
      C.backend.copy(entry.publicKey);
      await ui().dialog({
        title: 'Clé créée',
        icon: 'key',
        body: h('div', { class: 'form' }, h('p', { text: 'La clé publique est copiée. Colle-la dans ~/.ssh/authorized_keys sur ton serveur :' }), h('pre', { class: 'pubkey', text: entry.publicKey })),
        buttons: [{ label: 'OK', value: true, kind: 'primary' }],
      });
      return entry;
    } catch (e) {
      ui().alert('Génération impossible', e.message);
      return null;
    }
  }

  async function importKeyFlow() {
    const ta = h('textarea', { rows: 8, class: 'mono', spellcheck: 'false', autocapitalize: 'off', placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----\n…' });
    const nameIn = h('input', { type: 'text', value: 'Ma clé' });
    const body = h(
      'div',
      { class: 'form' },
      ui().field('Nom', nameIn),
      ui().field('Clé privée', ta, 'Formats OpenSSH, PEM (RSA, ECDSA) et PuTTY.'),
      h('button', { type: 'button', class: 'btn small', text: 'Choisir un fichier…', onClick: async () => { const t = await C.pickTextFile(); if (t) ta.value = t; } })
    );
    const ok = await ui().dialog({ title: 'Importer une clé', icon: 'key', body, wide: true, buttons: [{ label: 'Annuler', value: false }, { label: 'Importer', value: true, kind: 'primary' }] });
    if (!ok) return null;
    const info = await C.keygen.inspect(ta.value);
    if (!info.valid) {
      ui().alert('Clé non reconnue', 'Colle une clé privée complète, avec les lignes BEGIN et END.');
      return null;
    }
    const entry = { id: C.uid('k'), name: nameIn.value.trim() || 'Ma clé', created: new Date().toISOString(), privateKey: ta.value.trim() + '\n', type: info.type, publicKey: info.publicKey, fingerprint: info.fingerprint, encrypted: info.encrypted };
    C.store.keys.push(entry);
    C.store.saveKeys();
    C.toast('Clé importée', 'good');
    return entry;
  }

  /* ---------- panneau ---------- */
  function show(id) {
    current = id;
    if (!panel) return;
    panel.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('on', b.dataset.id === id));
    const content = panel.querySelector('.settings-content');
    content.innerHTML = '';
    const title = SECTIONS.find((s) => s.id === id).label;
    content.append(h('h2', { class: 'section-title', text: title }));
    for (const n of [].concat(build[id]())) if (n) content.append(n);
    content.scrollTop = 0;
    const navBtn = panel.querySelector(`.nav-item[data-id="${id}"]`);
    if (navBtn && navBtn.scrollIntoView) navBtn.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function refresh() {
    if (panel) show(current);
  }

  function close() {
    if (!panel) return;
    const p = panel;
    panel = null;
    if (popLayer) popLayer();
    popLayer = null;
    p.classList.remove('show');
    setTimeout(() => p.remove(), 180);
    appRef && appRef.active && appRef.active.focus();
  }

  function open(app, section) {
    appRef = app;
    if (panel) {
      show(section || current);
      return;
    }
    const nav = h('nav', { class: 'settings-nav' }, SECTIONS.map((s) => h('button', { type: 'button', class: 'nav-item', dataset: { id: s.id }, text: s.label, onClick: () => show(s.id) })));
    panel = h(
      'div',
      { class: 'settings', role: 'dialog', 'aria-label': 'Réglages' },
      h('header', { class: 'settings-head' }, h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Fermer', html: C.icons.back, onClick: close }), h('h2', { text: 'Réglages' })),
      h('div', { class: 'settings-body' }, nav, h('div', { class: 'settings-content' }))
    );
    document.getElementById('layers').append(panel);
    popLayer = C.ui.pushLayer({ cancelValue: null, close: () => close() });
    show(section || current);
    requestAnimationFrame(() => panel && panel.classList.add('show'));
  }

  C.settingsUI = { open, close, refresh, generateKeyFlow, importKeyFlow, isOpen: () => !!panel };
})();

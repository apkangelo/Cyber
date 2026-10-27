/* Cyber — thèmes de couleurs */
(function () {
  'use strict';
  const C = window.Cyber;

  const ANSI = [
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightMagenta', 'brightCyan', 'brightWhite',
  ];
  const LABELS = {
    background: 'Fond', foreground: 'Texte', cursor: 'Curseur', cursorAccent: 'Texte sous le curseur',
    selectionBackground: 'Sélection',
    black: 'Noir', red: 'Rouge', green: 'Vert', yellow: 'Jaune', blue: 'Bleu', magenta: 'Magenta', cyan: 'Cyan', white: 'Blanc',
    brightBlack: 'Noir vif', brightRed: 'Rouge vif', brightGreen: 'Vert vif', brightYellow: 'Jaune vif',
    brightBlue: 'Bleu vif', brightMagenta: 'Magenta vif', brightCyan: 'Cyan vif', brightWhite: 'Blanc vif',
  };
  const BASE_KEYS = ['background', 'foreground', 'cursor', 'cursorAccent', 'selectionBackground'];

  const t = (id, name, bg, fg, cursor, sel, ansi) => {
    const colors = { background: bg, foreground: fg, cursor, cursorAccent: bg, selectionBackground: sel };
    ANSI.forEach((k, i) => (colors[k] = ansi[i]));
    return { id, name, colors, builtin: true };
  };

  const PRESETS = [
    t('cyber', 'Cyber néon', '#0b0614', '#e6e1f5', '#b56cff', '#4a2a73',
      ['#1a1426', '#ff4f7b', '#3cf2a5', '#ffd166', '#6c8cff', '#c77dff', '#4dd8ff', '#d9d4e7',
       '#5a5070', '#ff7a9c', '#7dffc4', '#ffe29a', '#9db1ff', '#dfb2ff', '#8be8ff', '#ffffff']),
    t('minuit', 'Minuit', '#0d1117', '#c9d1d9', '#58a6ff', '#264f78',
      ['#161b22', '#ff7b72', '#3fb950', '#d29922', '#58a6ff', '#bc8cff', '#39c5cf', '#b1bac4',
       '#6e7681', '#ffa198', '#56d364', '#e3b341', '#79c0ff', '#d2a8ff', '#56d4dd', '#f0f6fc']),
    t('tokyo', 'Nuit de Tokyo', '#1a1b26', '#c0caf5', '#c0caf5', '#33467c',
      ['#15161e', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#a9b1d6',
       '#414868', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#c0caf5']),
    t('dracula', 'Dracula', '#282a36', '#f8f8f2', '#f8f8f2', '#44475a',
      ['#21222c', '#ff5555', '#50fa7b', '#f1fa8c', '#bd93f9', '#ff79c6', '#8be9fd', '#f8f8f2',
       '#6272a4', '#ff6e6e', '#69ff94', '#ffffa5', '#d6acff', '#ff92df', '#a4ffff', '#ffffff']),
    t('nord', 'Nord', '#2e3440', '#d8dee9', '#d8dee9', '#434c5e',
      ['#3b4252', '#bf616a', '#a3be8c', '#ebcb8b', '#81a1c1', '#b48ead', '#88c0d0', '#e5e9f0',
       '#4c566a', '#bf616a', '#a3be8c', '#ebcb8b', '#81a1c1', '#b48ead', '#8fbcbb', '#eceff4']),
    t('onedark', 'One Dark', '#282c34', '#abb2bf', '#528bff', '#3e4451',
      ['#282c34', '#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#56b6c2', '#abb2bf',
       '#5c6370', '#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#56b6c2', '#ffffff']),
    t('gruvbox', 'Gruvbox', '#282828', '#ebdbb2', '#ebdbb2', '#504945',
      ['#282828', '#cc241d', '#98971a', '#d79921', '#458588', '#b16286', '#689d6a', '#a89984',
       '#928374', '#fb4934', '#b8bb26', '#fabd2f', '#83a598', '#d3869b', '#8ec07c', '#ebdbb2']),
    t('monokai', 'Monokai', '#272822', '#f8f8f2', '#f8f8f0', '#49483e',
      ['#272822', '#f92672', '#a6e22e', '#f4bf75', '#66d9ef', '#ae81ff', '#a1efe4', '#f8f8f2',
       '#75715e', '#f92672', '#a6e22e', '#f4bf75', '#66d9ef', '#ae81ff', '#a1efe4', '#f9f8f5']),
    t('solarized', 'Solarized sombre', '#002b36', '#839496', '#93a1a1', '#073642',
      ['#073642', '#dc322f', '#859900', '#b58900', '#268bd2', '#d33682', '#2aa198', '#eee8d5',
       '#586e75', '#cb4b16', '#586e75', '#657b83', '#839496', '#6c71c4', '#93a1a1', '#fdf6e3']),
    t('matrice', 'Matrice', '#000a00', '#33ff66', '#33ff66', '#0f3d1a',
      ['#001a00', '#1fbf4a', '#33ff66', '#9dff8a', '#2a9d5a', '#5fd38d', '#7dffb0', '#b6ffc9',
       '#1c5c2e', '#4dff7f', '#66ff99', '#ccffbb', '#40c070', '#88f0b0', '#a8ffd0', '#e6ffe9']),
    t('ambre', 'Ambre rétro', '#140c00', '#ffb000', '#ffcc33', '#4d3300',
      ['#1f1300', '#ff7a00', '#ffb000', '#ffd24d', '#cc8a00', '#ff9a33', '#ffc966', '#ffe0a3',
       '#6b4a00', '#ff9933', '#ffc233', '#ffe680', '#e6a400', '#ffb366', '#ffd999', '#fff2d6']),
    t('papier', 'Papier (clair)', '#fbf9f4', '#2a2733', '#7c3aed', '#d9ccf5',
      ['#2a2733', '#c4314b', '#2e8540', '#a66a00', '#2459c7', '#8a3bd1', '#12808a', '#d5d1c8',
       '#6f6a7a', '#e0485f', '#3aa655', '#c98a00', '#3a72e8', '#a65ff0', '#1ba2ae', '#ffffff']),
  ];

  const themes = {
    ANSI,
    LABELS,
    BASE_KEYS,
    ALL_KEYS: BASE_KEYS.concat(ANSI),
    presets: PRESETS,

    list() {
      const custom = (C.store && C.store.settings.customThemes) || [];
      return PRESETS.concat(custom.map((x) => ({ ...x, builtin: false })));
    },

    get(id) {
      return this.list().find((x) => x.id === id) || PRESETS[0];
    },

    /** Thème d'une session : thème du profil SSH s'il en a un, sinon le thème global */
    forSpec(spec) {
      const s = C.store.settings;
      const pid = spec && spec.profile && spec.profile.theme;
      return this.get(pid || s.theme);
    },

    /** Options "theme" pour xterm.js */
    toXterm(theme) {
      const c = theme.colors;
      const out = {};
      for (const k of this.ALL_KEYS) if (c[k]) out[k] = c[k];
      out.cursorAccent = c.cursorAccent || c.background;
      // une sélection légèrement transparente laisse lire le texte dessous
      out.selectionBackground = c.selectionBackground;
      out.selectionInactiveBackground = C.mix(c.selectionBackground, c.background, 0.4);
      return out;
    },

    isLight(theme) {
      return C.luminance(theme.colors.background) > 0.45;
    },

    /** Applique les couleurs du thème à l'interface autour du terminal */
    applyChrome(theme, accent) {
      const c = theme.colors;
      const light = this.isLight(theme);
      const root = document.documentElement.style;
      const chrome = C.mix(c.background, c.foreground, light ? 0.05 : 0.06);
      root.setProperty('--term-bg', c.background);
      root.setProperty('--term-fg', c.foreground);
      root.setProperty('--chrome', chrome);
      root.setProperty('--chrome-2', C.mix(c.background, c.foreground, light ? 0.1 : 0.11));
      root.setProperty('--chrome-3', C.mix(c.background, c.foreground, light ? 0.16 : 0.18));
      root.setProperty('--line', C.mix(c.background, c.foreground, light ? 0.14 : 0.16));
      root.setProperty('--text', light ? C.mix(c.foreground, '#000000', 0.2) : C.mix(c.foreground, '#ffffff', 0.15));
      root.setProperty('--muted', C.mix(c.foreground, c.background, 0.45));
      root.setProperty('--accent', accent || c.cursor);
      root.setProperty('--accent-soft', C.mix(c.background, accent || c.cursor, 0.22));
      root.setProperty('--accent-text', C.luminance(accent || c.cursor) > 0.5 ? '#111111' : '#ffffff');
      root.setProperty('--good', c.green);
      root.setProperty('--bad', c.red);
      root.setProperty('--warn', c.yellow);
      document.documentElement.dataset.light = light ? '1' : '0';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', chrome);
      return chrome;
    },

    /** Petite démo colorée pour les aperçus et le test des couleurs */
    sampleAnsi() {
      const rows = [];
      const names = ['noir', 'rouge', 'vert', 'jaune', 'bleu', 'magenta', 'cyan', 'blanc'];
      rows.push('\x1b[1mCouleurs du thème\x1b[0m');
      let line1 = '', line2 = '';
      for (let i = 0; i < 8; i++) {
        line1 += `\x1b[4${i}m  \x1b[0m\x1b[3${i}m ${names[i].padEnd(8)}\x1b[0m`;
        line2 += `\x1b[10${i}m  \x1b[0m\x1b[9${i}m ${(names[i] + '+').padEnd(8)}\x1b[0m`;
      }
      rows.push(line1, line2, '');
      let grad = '';
      for (let i = 0; i < 48; i++) {
        const r = Math.round(255 * Math.sin((i / 48) * Math.PI));
        const g = Math.round((255 * i) / 48);
        const b = 255 - g;
        grad += `\x1b[48;2;${r};${g};${b}m \x1b[0m`;
      }
      rows.push('Dégradé 24 bits : ' + grad);
      rows.push('\x1b[1mgras\x1b[0m  \x1b[3mitalique\x1b[0m  \x1b[4msouligné\x1b[0m  \x1b[7minversé\x1b[0m  \x1b[2matténué\x1b[0m');
      return rows.join('\r\n') + '\r\n';
    },
  };

  C.themes = themes;
})();

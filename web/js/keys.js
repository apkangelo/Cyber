/* Cyber — barre de touches supplémentaires (comme Termux) et modificateurs CTRL / ALT */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;

  // Touches spéciales : libellé et séquence envoyée
  const SPECIAL = {
    ESC: { label: 'ESC', seq: '\x1b' },
    TAB: { label: '⇥', seq: '\t' },
    CTRL: { label: 'CTRL', mod: 'ctrl' },
    ALT: { label: 'ALT', mod: 'alt' },
    SHIFT: { label: '⇧', mod: 'shift' },
    UP: { label: '↑', csi: 'A' },
    DOWN: { label: '↓', csi: 'B' },
    RIGHT: { label: '→', csi: 'C' },
    LEFT: { label: '←', csi: 'D' },
    HOME: { label: 'HOME', csi: 'H' },
    END: { label: 'END', csi: 'F' },
    PGUP: { label: 'PG↑', tilde: 5 },
    PGDN: { label: 'PG↓', tilde: 6 },
    INS: { label: 'INS', tilde: 2 },
    DEL: { label: 'DEL', tilde: 3 },
    BKSP: { label: '⌫', seq: '\x7f' },
    ENTER: { label: '⏎', seq: '\r' },
    SPACE: { label: '␣', seq: ' ' },
    PASTE: { label: '📋', action: 'paste' },
    SNIP: { label: '⚡', action: 'snippets' },
    KBD: { label: '⌨', action: 'keyboard' },
    MENU: { label: '☰', action: 'menu' },
  };
  for (let i = 1; i <= 12; i++) SPECIAL['F' + i] = { label: 'F' + i, fn: i };
  const FN = { 1: 'OP', 2: 'OQ', 3: 'OR', 4: 'OS', 5: '[15~', 6: '[17~', 7: '[18~', 8: '[19~', 9: '[20~', 10: '[21~', 11: '[23~', 12: '[24~' };

  const mods = { ctrl: 0, alt: 0, shift: 0 }; // 0 = inactif, 1 = une fois, 2 = verrouillé
  let bar = null;

  function modParam() {
    // paramètre xterm : 1 + shift(1) + alt(2) + ctrl(4)
    return 1 + (mods.shift ? 1 : 0) + (mods.alt ? 2 : 0) + (mods.ctrl ? 4 : 0);
  }

  function releaseOneShot() {
    let changed = false;
    for (const k of Object.keys(mods)) {
      if (mods[k] === 1) {
        mods[k] = 0;
        changed = true;
      }
    }
    if (changed) renderMods();
  }

  function renderMods() {
    if (!bar) return;
    bar.querySelectorAll('[data-mod]').forEach((b) => {
      const m = mods[b.dataset.mod];
      b.classList.toggle('on', m === 1);
      b.classList.toggle('locked', m === 2);
    });
  }

  /** Séquence d'une touche spéciale en tenant compte des modificateurs et du mode curseur */
  function sequenceFor(def, term) {
    const p = modParam();
    if (def.csi) {
      if (p > 1) return `\x1b[1;${p}${def.csi}`;
      const app = term && term.modes && term.modes.applicationCursorKeysMode;
      if (app && 'ABCD'.includes(def.csi)) return '\x1bO' + def.csi;
      return '\x1b[' + def.csi;
    }
    if (def.tilde) return p > 1 ? `\x1b[${def.tilde};${p}~` : `\x1b[${def.tilde}~`;
    if (def.fn) {
      const s = FN[def.fn];
      if (p > 1) return s.startsWith('O') ? `\x1b[1;${p}${s[1]}` : `\x1b${s.replace('~', ';' + p + '~')}`;
      return '\x1b' + s;
    }
    if (def.seq === '\t' && mods.shift) return '\x1b[Z';
    let seq = def.seq;
    if (mods.alt) seq = '\x1b' + seq;
    return seq;
  }

  const keys = {
    SPECIAL,

    /** Applique CTRL / ALT « collants » à un texte tapé au clavier */
    applyModifiers(data) {
      if (!mods.ctrl && !mods.alt && !mods.shift) return data;
      let out = data;
      if (data.length === 1) {
        let ch = data;
        if (mods.shift) ch = ch.toUpperCase();
        if (mods.ctrl) {
          const c = ch.toLowerCase();
          if (c >= 'a' && c <= 'z') ch = String.fromCharCode(c.charCodeAt(0) - 96);
          else if (c === ' ' || c === '@' || c === '2') ch = '\x00';
          else if (c === '[' || c === '3') ch = '\x1b';
          else if (c === '\\' || c === '4') ch = '\x1c';
          else if (c === ']' || c === '5') ch = '\x1d';
          else if (c === '^' || c === '6') ch = '\x1e';
          else if (c === '_' || c === '-' || c === '7') ch = '\x1f';
          else if (c === '?' || c === '8') ch = '\x7f';
        }
        if (mods.alt) ch = '\x1b' + ch;
        out = ch;
      }
      releaseOneShot();
      return out;
    },

    hasModifier() {
      return !!(mods.ctrl || mods.alt || mods.shift);
    },

    /** Construit la barre selon la disposition des réglages */
    render(container, app) {
      bar = container;
      const s = C.store.settings;
      container.innerHTML = '';
      const show = s.extraKeys === 'always' || (s.extraKeys === 'auto' && C.isTouch);
      container.hidden = !show;
      document.documentElement.classList.toggle('has-extra-keys', show);
      if (!show) return;
      const lines = String(s.extraKeysLayout || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 4);
      for (const line of lines) {
        const row = h('div', { class: 'xk-row' });
        for (const token of line.split(/\s+/)) {
          const def = SPECIAL[token.toUpperCase()] || { label: token, seq: token };
          const btn = h('button', { type: 'button', class: 'xk', tabindex: '-1', text: def.label });
          if (def.mod) btn.dataset.mod = def.mod;
          let lastTap = 0;
          let repeatTimer = null;
          let repeatDelay = null;
          const fire = () => {
            const sess = app.active;
            if (def.mod) {
              const now = Date.now();
              if (mods[def.mod] === 0) mods[def.mod] = now - lastTap < 350 ? 2 : 1;
              else if (mods[def.mod] === 1 && now - lastTap < 350) mods[def.mod] = 2;
              else mods[def.mod] = 0;
              lastTap = now;
              renderMods();
              return;
            }
            if (def.action) {
              app.extraAction(def.action, btn);
              return;
            }
            if (!sess) return;
            const seq = sequenceFor(def, sess.term);
            releaseOneShot();
            sess.send(seq);
          };
          const stopRepeat = () => {
            clearTimeout(repeatDelay);
            clearInterval(repeatTimer);
            repeatDelay = repeatTimer = null;
          };
          btn.addEventListener('pointerdown', (e) => {
            e.preventDefault(); // garde le clavier à l'écran
            if (s.keyVibrate) C.backend.vibrate(12);
            btn.classList.add('pressed');
            fire();
            // répétition pour les flèches et l'effacement
            if (def.csi || def.seq === '\x7f') {
              repeatDelay = setTimeout(() => (repeatTimer = setInterval(fire, 60)), 420);
            }
          });
          ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) =>
            btn.addEventListener(t, () => {
              btn.classList.remove('pressed');
              stopRepeat();
            })
          );
          btn.addEventListener('contextmenu', (e) => e.preventDefault());
          row.append(btn);
        }
        container.append(row);
      }
      renderMods();
    },
  };

  C.keys = keys;
})();

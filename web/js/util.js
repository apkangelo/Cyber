/* Cyber — petites fonctions communes */
(function () {
  'use strict';
  const C = (window.Cyber = window.Cyber || {});

  C.$ = (sel, root = document) => root.querySelector(sel);
  C.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Crée un élément : h('button', { class: 'x', onClick: fn }, 'texte', autreElement) */
  C.h = function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v; // réservé aux icônes SVG internes
        else if (k === 'style' && typeof v === 'object') {
          for (const [sk, sv] of Object.entries(v)) {
            if (sk.startsWith('--')) el.style.setProperty(sk, sv);
            else el.style[sk] = sv;
          }
        }
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k === 'value') el.value = v;
        else if (k === 'checked') el.checked = !!v;
        else if (/^on[A-Z]/.test(k) && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };

  C.uid = (prefix = '') =>
    prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

  C.clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  C.debounce = (fn, ms) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  C.b64ToBytes = (b64) => {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  C.bytesToB64 = (u8) => {
    let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  };

  C.isTouch = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- couleurs ---------- */
  C.parseColor = (c) => {
    if (!c) return [0, 0, 0];
    c = String(c).trim();
    let m = c.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
      let hex = m[1];
      if (hex.length === 3 || hex.length === 4) hex = hex.split('').map((x) => x + x).join('');
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    }
    m = c.match(/rgba?\(([^)]+)\)/i);
    if (m) return m[1].split(',').slice(0, 3).map((x) => parseFloat(x) || 0);
    return [0, 0, 0];
  };
  C.toHex = (rgb) => '#' + rgb.map((v) => C.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  C.mix = (a, b, t) => {
    const x = C.parseColor(a), y = C.parseColor(b);
    return C.toHex(x.map((v, i) => v + (y[i] - v) * t));
  };
  C.luminance = (c) => {
    const [r, g, b] = C.parseColor(c).map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  /** Ramène une couleur (éventuellement rgba) à un #rrggbb pour <input type=color> */
  C.hex6 = (c) => C.toHex(C.parseColor(c));

  /* ---------- notifications ---------- */
  C.toast = (msg, kind = '') => {
    const root = document.getElementById('toasts');
    if (!root) return;
    const el = C.h('div', { class: 'toast ' + kind }, msg);
    root.append(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 2600);
  };

  /* ---------- icônes (SVG maison) ---------- */
  const svg = (d, extra = '') =>
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
  C.icons = {
    menu: svg('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    gear: svg('<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    bolt: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    close: svg('<path d="M6 6l12 12M18 6 6 18"/>', 'width="16" height="16"'),
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    term: svg('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9l3 3-3 3M12 15h5"/>'),
    server: svg('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
    key: svg('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14 9l2 2"/>'),
    edit: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>', 'width="18" height="18"'),
    trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', 'width="18" height="18"'),
    copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>', 'width="18" height="18"'),
    dots: svg('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
    search: svg('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/>', 'width="18" height="18"'),
    up: svg('<path d="M6 15l6-6 6 6"/>', 'width="18" height="18"'),
    down: svg('<path d="M6 9l6 6 6-6"/>', 'width="18" height="18"'),
    shield: svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    warn: svg('<path d="M12 3 2 21h20z"/><path d="M12 10v5M12 18h.01"/>'),
    link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
  };
  C.icon = (name) => {
    const s = document.createElement('span');
    s.className = 'ico';
    s.innerHTML = C.icons[name] || '';
    return s;
  };

  /** Télécharge un texte sous forme de fichier (bureau et navigateur) */
  C.downloadText = (name, text) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = name;
    document.body.append(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  };

  /** Ouvre un sélecteur de fichier et renvoie son contenu texte */
  C.pickTextFile = (accept = '') =>
    new Promise((resolve) => {
      const input = C.h('input', { type: 'file', accept, style: { display: 'none' } });
      input.addEventListener('change', () => {
        const f = input.files && input.files[0];
        if (!f) return resolve(null);
        const r = new FileReader();
        r.onload = () => resolve(String(r.result || ''));
        r.onerror = () => resolve(null);
        r.readAsText(f);
        input.remove();
      });
      document.body.append(input);
      input.click();
    });
})();

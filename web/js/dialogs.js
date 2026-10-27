/* Cyber — fenêtres de dialogue, menus et petites aides de formulaire */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;
  const stack = []; // couches ouvertes (dialogues, menus, panneaux), la dernière est au-dessus

  function layersRoot() {
    return document.getElementById('layers');
  }

  const ui = {
    /** Ferme la couche du dessus ; renvoie true si quelque chose a été fermé */
    closeTop() {
      const top = stack[stack.length - 1];
      if (!top) return false;
      top.close(top.cancelValue);
      return true;
    },
    hasLayer() {
      return stack.length > 0;
    },

    /** Enregistre une couche (utilisé par le panneau des réglages) */
    pushLayer(layer) {
      stack.push(layer);
      return () => {
        const i = stack.indexOf(layer);
        if (i >= 0) stack.splice(i, 1);
      };
    },

    /**
     * Dialogue générique.
     * buttons: [{ label, value, kind: 'primary'|'danger'|'', validate?: () => bool }]
     */
    dialog({ title, body, buttons = [{ label: 'OK', value: true, kind: 'primary' }], cancelValue = null, wide = false, icon }) {
      return new Promise((resolve) => {
        const prevFocus = document.activeElement;
        const backdrop = h('div', { class: 'modal-backdrop' });
        const card = h('div', { class: 'modal' + (wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true' });
        const head = h('div', { class: 'modal-head' }, icon ? C.icon(icon) : null, h('h2', { text: title || '' }));
        const content = h('div', { class: 'modal-body' });
        if (typeof body === 'string') content.append(h('p', { text: body }));
        else if (body) content.append(body);
        const foot = h('div', { class: 'modal-foot' });
        let done = false;
        const layer = {
          cancelValue,
          close(v) {
            if (done) return;
            done = true;
            const i = stack.indexOf(layer);
            if (i >= 0) stack.splice(i, 1);
            backdrop.classList.remove('show');
            setTimeout(() => backdrop.remove(), 160);
            if (prevFocus && prevFocus.focus) {
              try {
                prevFocus.focus();
              } catch (e) {}
            }
            resolve(v);
          },
        };
        for (const b of buttons) {
          foot.append(
            h('button', {
              type: 'button',
              class: 'btn ' + (b.kind || ''),
              onClick: () => {
                if (b.validate && !b.validate()) return;
                layer.close(typeof b.value === 'function' ? b.value() : b.value);
              },
              text: b.label,
            })
          );
        }
        card.append(head, content, foot);
        backdrop.append(card);
        backdrop.addEventListener('pointerdown', (e) => {
          if (e.target === backdrop) layer.close(cancelValue);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            layer.close(cancelValue);
          } else if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') {
            const primary = buttons.find((b) => b.kind === 'primary');
            if (primary) {
              e.preventDefault();
              if (primary.validate && !primary.validate()) return;
              layer.close(typeof primary.value === 'function' ? primary.value() : primary.value);
            }
          }
        });
        stack.push(layer);
        layersRoot().append(backdrop);
        requestAnimationFrame(() => {
          backdrop.classList.add('show');
          const first = card.querySelector('input:not([type=checkbox]):not([disabled]), textarea, select');
          if (first && !C.isTouch) first.focus();
          else card.querySelector('.btn.primary, .btn')?.focus({ preventScroll: true });
        });
      });
    },

    confirm(title, message, okLabel = 'Confirmer', danger = false) {
      return ui.dialog({
        title,
        body: message,
        buttons: [
          { label: 'Annuler', value: false },
          { label: okLabel, value: true, kind: danger ? 'danger' : 'primary' },
        ],
        cancelValue: false,
      });
    },

    alert(title, message) {
      return ui.dialog({ title, body: message, buttons: [{ label: 'OK', value: true, kind: 'primary' }], cancelValue: true });
    },

    prompt(title, { label = '', value = '', placeholder = '', type = 'text', okLabel = 'OK', multiline = false } = {}) {
      const input = multiline
        ? h('textarea', { rows: 8, placeholder, spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off' })
        : h('input', { type, placeholder, spellcheck: 'false', autocapitalize: 'off', autocomplete: type === 'password' ? 'off' : 'off' });
      input.value = value;
      const body = h('div', { class: 'form' }, label ? ui.field(label, input) : input);
      return ui.dialog({
        title,
        body,
        buttons: [
          { label: 'Annuler', value: null },
          { label: okLabel, value: () => input.value, kind: 'primary' },
        ],
      });
    },

    /** Menu contextuel accroché à un élément */
    menu(anchor, items) {
      return new Promise((resolve) => {
        const root = h('div', { class: 'menu-backdrop' });
        const menu = h('div', { class: 'menu', role: 'menu' });
        let done = false;
        const layer = {
          cancelValue: null,
          close(v) {
            if (done) return;
            done = true;
            const i = stack.indexOf(layer);
            if (i >= 0) stack.splice(i, 1);
            root.remove();
            resolve(v);
          },
        };
        for (const it of items) {
          if (it === '-') {
            menu.append(h('div', { class: 'menu-sep' }));
            continue;
          }
          if (it.header) {
            menu.append(h('div', { class: 'menu-header', text: it.header }));
            continue;
          }
          menu.append(
            h(
              'button',
              {
                type: 'button',
                class: 'menu-item' + (it.danger ? ' danger' : ''),
                role: 'menuitem',
                disabled: it.disabled,
                onClick: () => layer.close(it.value),
              },
              it.icon ? C.icon(it.icon) : null,
              h('span', { class: 'menu-label' }, it.label, it.hint ? h('small', { text: it.hint }) : null),
              it.dot ? h('i', { class: 'dot', style: { background: it.dot } }) : null
            )
          );
        }
        root.append(menu);
        root.addEventListener('pointerdown', (e) => {
          if (e.target === root) layer.close(null);
        });
        root.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            layer.close(null);
          }
        });
        stack.push(layer);
        layersRoot().append(root);
        // position sous l'ancre, sans sortir de l'écran
        const r = anchor.getBoundingClientRect();
        const mw = Math.min(320, window.innerWidth - 16);
        menu.style.width = mw + 'px';
        let left = Math.min(r.left, window.innerWidth - mw - 8);
        left = Math.max(8, left);
        menu.style.left = left + 'px';
        const below = r.bottom + 6;
        menu.style.top = below + 'px';
        requestAnimationFrame(() => {
          const mh = menu.offsetHeight;
          if (below + mh > window.innerHeight - 8) {
            menu.style.top = Math.max(8, Math.min(r.top - mh - 6, window.innerHeight - mh - 8)) + 'px';
          }
          menu.classList.add('show');
          menu.querySelector('.menu-item:not([disabled])')?.focus({ preventScroll: true });
        });
      });
    },

    /* ---------- aides de formulaire ---------- */
    field(label, control, hint) {
      // <label> seulement autour d'un vrai champ : sinon un clic sur le texte déclencherait un bouton
      const tag = control && /^(INPUT|SELECT|TEXTAREA)$/.test(control.tagName) ? 'label' : 'div';
      return h(tag, { class: 'field' }, h('span', { class: 'field-label', text: label }), control, hint ? h('small', { class: 'hint', text: hint }) : null);
    },

    toggle(checked, onChange) {
      const input = h('input', { type: 'checkbox', class: 'switch-input' });
      input.checked = !!checked;
      input.addEventListener('change', () => onChange && onChange(input.checked));
      return h('span', { class: 'switch' }, input, h('i'));
    },

    row(label, control, hint) {
      return h('div', { class: 'row' }, h('div', { class: 'row-text' }, h('span', { class: 'row-label', text: label }), hint ? h('small', { class: 'hint', text: hint }) : null), h('div', { class: 'row-control' }, control));
    },

    select(options, value, onChange) {
      const sel = h('select');
      for (const o of options) {
        const opt = h('option', { value: o.value, text: o.label });
        if (String(o.value) === String(value)) opt.selected = true;
        sel.append(opt);
      }
      sel.addEventListener('change', () => onChange && onChange(sel.value));
      return sel;
    },

    segmented(options, value, onChange) {
      const wrap = h('div', { class: 'segmented', role: 'radiogroup' });
      const render = (v) => {
        wrap.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.value === String(v)));
      };
      for (const o of options) {
        wrap.append(
          h('button', {
            type: 'button',
            dataset: { value: String(o.value) },
            text: o.label,
            onClick: () => {
              render(o.value);
              onChange && onChange(o.value);
            },
          })
        );
      }
      render(value);
      return wrap;
    },

    range(min, max, step, value, format, onChange) {
      const out = h('output', { text: format(value) });
      const input = h('input', { type: 'range', min, max, step });
      input.value = value;
      input.addEventListener('input', () => {
        out.textContent = format(Number(input.value));
        onChange && onChange(Number(input.value));
      });
      return h('div', { class: 'range' }, input, out);
    },

    color(value, onChange) {
      const input = h('input', { type: 'color' });
      input.value = C.hex6(value);
      input.addEventListener('input', () => onChange && onChange(input.value));
      return input;
    },
  };

  C.ui = ui;
})();

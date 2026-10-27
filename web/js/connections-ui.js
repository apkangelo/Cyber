/* Cyber — panneau des connexions SSH : liste, connexion rapide, éditeur de profil */
(function () {
  'use strict';
  const C = window.Cyber;
  const h = C.h;
  const ui = () => C.ui;

  const TAG_COLORS = ['#b56cff', '#4dd8ff', '#3cf2a5', '#ffd166', '#ff4f7b', '#6c8cff', '#ff9a33', '#e6e1f5'];

  /** « user@hôte:port » → profil temporaire */
  function parseQuick(text) {
    const m = String(text || '').trim().match(/^(?:ssh\s+)?(?:([^@\s]+)@)?(\[[^\]]+\]|[^:\s]+)(?::(\d+))?$/);
    if (!m) return null;
    return { username: m[1] || '', host: m[2].replace(/^\[|\]$/g, ''), port: m[3] ? Number(m[3]) : 22 };
  }

  const connections = {
    TAG_COLORS,
    parseQuick,

    render(app) {
      const el = document.getElementById('sidebar');
      el.innerHTML = '';
      const quick = h('input', {
        type: 'text',
        placeholder: 'utilisateur@hôte:port',
        autocapitalize: 'off',
        autocomplete: 'off',
        spellcheck: 'false',
        enterkeyhint: 'go',
        'aria-label': 'Connexion rapide',
      });
      const go = async () => {
        const q = parseQuick(quick.value);
        if (!q) return C.toast('Format : utilisateur@hôte:port', 'bad');
        if (!q.username) {
          const u = await ui().prompt('Utilisateur', { label: `Nom d'utilisateur sur ${q.host}`, value: 'root' });
          if (!u) return;
          q.username = u.trim();
        }
        quick.value = '';
        app.closeSidebarIfOverlay();
        app.openSsh({ id: '', name: `${q.username}@${q.host}`, auth: 'password', ...q, temporary: true });
      };
      quick.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') go();
      });

      const list = h('div', { class: 'conn-list' });
      const profiles = C.store.profiles;
      if (!profiles.length) {
        list.append(
          h('div', { class: 'conn-empty' }, h('p', { text: 'Aucune connexion enregistrée.' }), h('p', { class: 'hint', text: 'Ajoute un serveur pour t’y connecter en un geste.' }))
        );
      }
      for (const p of profiles) {
        const card = h(
          'div',
          { class: 'conn', role: 'button', tabindex: '0' },
          h('i', { class: 'conn-tag', style: { background: p.color || TAG_COLORS[0] } }),
          h('div', { class: 'conn-text' }, h('strong', { text: p.name || p.host }), h('small', { text: `${p.username}@${p.host}${Number(p.port) !== 22 ? ':' + p.port : ''}` })),
          h('button', {
            type: 'button',
            class: 'icon-btn small',
            title: 'Options',
            'aria-label': 'Options',
            html: C.icons.dots,
            onClick: async (e) => {
              e.stopPropagation();
              const v = await ui().menu(e.currentTarget, [
                { label: 'Se connecter', value: 'open', icon: 'link' },
                { label: 'Modifier', value: 'edit', icon: 'edit' },
                { label: 'Dupliquer', value: 'dup', icon: 'copy' },
                '-',
                { label: 'Supprimer', value: 'del', icon: 'trash', danger: true },
              ]);
              if (v === 'open') {
                app.closeSidebarIfOverlay();
                app.openSsh(p);
              } else if (v === 'edit') connections.edit(app, p);
              else if (v === 'dup') {
                const copy = { ...JSON.parse(JSON.stringify(p)), id: C.uid('p'), name: (p.name || p.host) + ' (copie)' };
                C.store.profiles.push(copy);
                C.store.saveProfiles();
              } else if (v === 'del') {
                if (await ui().confirm('Supprimer la connexion', `Supprimer « ${p.name || p.host} » ?`, 'Supprimer', true)) {
                  C.store.profiles = C.store.profiles.filter((x) => x !== p);
                  C.store.saveProfiles();
                }
              }
            },
          })
        );
        const open = () => {
          app.closeSidebarIfOverlay();
          app.openSsh(p);
        };
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') open();
        });
        list.append(card);
      }

      el.append(
        h(
          'div',
          { class: 'side-head' },
          h('h2', { text: 'Connexions' }),
          h('button', { type: 'button', class: 'icon-btn', title: 'Nouvelle connexion', 'aria-label': 'Nouvelle connexion', html: C.icons.plus, onClick: () => connections.edit(app, null) })
        ),
        h('div', { class: 'quick' }, quick, h('button', { type: 'button', class: 'btn primary small', text: 'Go', onClick: go })),
        list,
        h(
          'div',
          { class: 'side-foot' },
          h('button', { type: 'button', class: 'btn ghost', onClick: () => { app.closeSidebarIfOverlay(); app.openLocal(); } }, C.icon('term'), 'Shell local'),
          h('button', { type: 'button', class: 'btn ghost', onClick: () => { app.closeSidebarIfOverlay(); C.settingsUI.open(app, 'ssh'); } }, C.icon('key'), 'Clés SSH')
        )
      );
    },

    /** Éditeur de profil (création si profile est null) */
    async edit(app, profile) {
      const isNew = !profile;
      const p = profile
        ? JSON.parse(JSON.stringify(profile))
        : { id: C.uid('p'), name: '', host: '', port: 22, username: '', auth: 'password', password: '', keyId: '', passphrase: '', startupCommand: '', theme: '', color: TAG_COLORS[C.store.profiles.length % TAG_COLORS.length] };

      const inp = (key, attrs = {}) => {
        const el = h('input', { type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false', ...attrs });
        el.value = p[key] == null ? '' : p[key];
        el.addEventListener('input', () => (p[key] = attrs.type === 'number' ? Number(el.value) : el.value));
        return el;
      };

      const name = inp('name', { placeholder: 'Mon serveur' });
      const host = inp('host', { placeholder: '192.168.1.10 ou exemple.fr', inputmode: 'url' });
      const port = inp('port', { type: 'number', min: 1, max: 65535 });
      const user = inp('username', { placeholder: 'root' });
      const pass = inp('password', { type: 'password', placeholder: 'Vide = demandé à chaque connexion' });
      const passphrase = inp('passphrase', { type: 'password', placeholder: 'Vide = demandée si besoin' });
      const startup = inp('startupCommand', { placeholder: 'ex. tmux attach || tmux' });

      const keyOptions = () => [{ value: '', label: C.store.keys.length ? 'Choisir une clé…' : 'Aucune clé : crée-en une dans Réglages › SSH' }].concat(C.store.keys.map((k) => ({ value: k.id, label: `${k.name} (${k.type})` })));
      let keySel = ui().select(keyOptions(), p.keyId, (v) => (p.keyId = v));
      const keyWrap = h('div', { class: 'inline' }, keySel, h('button', {
        type: 'button',
        class: 'btn small',
        text: 'Nouvelle clé',
        onClick: async () => {
          const k = await C.settingsUI.generateKeyFlow();
          if (k) {
            p.keyId = k.id;
            const fresh = ui().select(keyOptions(), p.keyId, (v) => (p.keyId = v));
            keySel.replaceWith(fresh);
            keySel = fresh;
          }
        },
      }));

      const passField = ui().field('Mot de passe', pass, 'Enregistré en clair sur cet appareil. Laisse vide pour le saisir à chaque fois.');
      const keyField = ui().field('Clé privée', keyWrap);
      const phraseField = ui().field('Phrase de passe de la clé', passphrase);
      const syncAuth = () => {
        passField.hidden = p.auth !== 'password';
        keyField.hidden = phraseField.hidden = p.auth !== 'key';
      };
      const auth = ui().segmented(
        [
          { value: 'password', label: 'Mot de passe' },
          { value: 'key', label: 'Clé SSH' },
        ],
        p.auth,
        (v) => {
          p.auth = v;
          syncAuth();
        }
      );
      syncAuth();

      const themeSel = ui().select([{ value: '', label: 'Thème global' }].concat(C.themes.list().map((t) => ({ value: t.id, label: t.name }))), p.theme, (v) => (p.theme = v));

      const swatches = h('div', { class: 'swatches' });
      const renderSw = () => {
        swatches.innerHTML = '';
        for (const c of TAG_COLORS) {
          swatches.append(h('button', { type: 'button', class: 'swatch' + (p.color === c ? ' on' : ''), style: { background: c }, 'aria-label': c, onClick: () => { p.color = c; renderSw(); } }));
        }
      };
      renderSw();

      const body = h(
        'div',
        { class: 'form' },
        ui().field('Nom', name),
        h('div', { class: 'grid-2' }, ui().field('Hôte', host), ui().field('Port', port)),
        ui().field('Utilisateur', user),
        ui().field('Authentification', auth),
        passField,
        keyField,
        phraseField,
        ui().field('Commande au démarrage', startup, 'Envoyée juste après la connexion.'),
        h('div', { class: 'grid-2' }, ui().field('Thème', themeSel), ui().field('Couleur', swatches))
      );

      const result = await ui().dialog({
        title: isNew ? 'Nouvelle connexion' : 'Modifier la connexion',
        icon: 'server',
        body,
        wide: true,
        buttons: [
          { label: 'Annuler', value: null },
          {
            label: 'Enregistrer',
            kind: 'primary',
            value: () => p,
            validate: () => {
              if (!String(p.host).trim()) {
                C.toast('Indique l’hôte', 'bad');
                host.focus();
                return false;
              }
              if (!String(p.username).trim()) {
                C.toast('Indique l’utilisateur', 'bad');
                user.focus();
                return false;
              }
              return true;
            },
          },
        ],
      });
      if (!result) return null;
      result.host = String(result.host).trim();
      result.username = String(result.username).trim();
      result.port = Number(result.port) || 22;
      if (!result.name) result.name = `${result.username}@${result.host}`;
      if (isNew) C.store.profiles.push(result);
      else Object.assign(profile, result);
      C.store.saveProfiles();
      return isNew ? result : profile;
    },
  };

  C.connections = connections;
})();

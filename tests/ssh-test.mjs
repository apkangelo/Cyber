// Test réel de la partie SSH des versions PC (desktop/ssh-core.js) contre un serveur OpenSSH local.
// Prérequis : serveur sur 127.0.0.1:2222, utilisateur « cyber », mot de passe « cyber », clé tests/out/id_ed25519.pub autorisée.
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { openSsh } = require('../desktop/ssh-core.js');

const base = { host: '127.0.0.1', port: 2222, username: 'cyber', cols: 100, rows: 30, timeout: 20, keepalive: 0 };
let known = '';

function run(name, opts, { answerHostKey = true, script = [], expect = null, expectError = null } = {}) {
  return new Promise((resolve, reject) => {
    let out = '';
    let error = null;
    let hostkey = null;
    let ready = false;
    const timer = setTimeout(() => reject(new Error(`${name} : délai dépassé\n${out}`)), 40000);
    const s = openSsh(opts, {
      onData: (d) => {
        out += d.toString();
        if (expect && out.includes(expect) && !s.sentExit) {
          s.sentExit = true;
          s.write('exit\r');
        }
      },
      onReady: () => {
        ready = true;
        for (const line of script) s.write(line);
      },
      onStatus: () => {},
      onHostKey: (info, answer) => {
        hostkey = info;
        answer(answerHostKey);
      },
      onError: (m) => (error = m),
      onExit: (code) => {
        clearTimeout(timer);
        resolve({ out, error, hostkey, ready, code });
      },
    });
  }).then((r) => {
    if (expectError) {
      if (!r.error || !r.error.includes(expectError)) throw new Error(`${name} : erreur attendue « ${expectError} », reçu « ${r.error} »`);
    } else {
      if (r.error) throw new Error(`${name} : ${r.error}`);
      if (expect && !r.out.includes(expect)) throw new Error(`${name} : « ${expect} » absent de la sortie :\n${r.out}`);
    }
    console.log(`✔ ${name}`);
    return r;
  });
}

// 1. première connexion par mot de passe : l'empreinte est demandée puis acceptée
const first = await run('mot de passe + nouvelle empreinte', { ...base, password: 'cyber' }, { script: ['echo cyber-$((6*7))\r'], expect: 'cyber-42' });
if (!first.hostkey || !/^SHA256:/.test(first.hostkey.fingerprint) || first.hostkey.changed) throw new Error('empreinte non proposée correctement');
known = first.hostkey.fingerprint;
console.log('  empreinte :', first.hostkey.algo, known);

// 2. empreinte connue : aucune question
const second = await run('empreinte mémorisée', { ...base, password: 'cyber', knownFingerprint: known }, { script: ['echo deux-$((1+1))\r'], expect: 'deux-2' });
if (second.hostkey) throw new Error('la question d’empreinte n’aurait pas dû revenir');

// 3. empreinte différente : signalée comme modifiée, et refus = connexion annulée
const third = await run('empreinte modifiée refusée', { ...base, password: 'cyber', knownFingerprint: 'SHA256:faux' }, { answerHostKey: false, expectError: 'Clé du serveur refusée' });
if (!third.hostkey || !third.hostkey.changed) throw new Error('changement d’empreinte non signalé');

// 4. mauvais mot de passe
await run('mauvais mot de passe', { ...base, password: 'faux', knownFingerprint: known }, { expectError: 'Authentification refusée' });

// 5. clé Ed25519 générée par l'interface + commande au démarrage + taille du terminal
const key = fs.readFileSync(new URL('./out/id_ed25519', import.meta.url), 'utf8');
await run('clé Ed25519 + commande de démarrage', { ...base, privateKey: key, knownFingerprint: known, startupCommand: 'echo depart-ok; stty size' }, { expect: '30 100' });

// 6. port fermé
await run('port fermé', { ...base, port: 2299, password: 'x' }, { expectError: 'Connexion refusée' });

console.log('Tous les tests SSH sont passés.');
process.exit(0);

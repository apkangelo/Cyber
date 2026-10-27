// Génère une clé Ed25519 avec le code de l'interface (web/js/keygen.js) pour le test SSH par clé.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWeb } from './load-web.mjs';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out');
fs.mkdirSync(out, { recursive: true });
const C = loadWeb(['util.js', 'keygen.js']);
const key = await C.keygen.generateEd25519('test@cyber');
const info = await C.keygen.inspect(key.privateKey);
if (!info.valid || info.type !== 'ssh-ed25519' || info.publicKey + ' test@cyber' !== key.publicKey || info.fingerprint !== key.fingerprint) {
  console.error('✖ relecture de la clé incohérente', info, key);
  process.exit(1);
}
fs.writeFileSync(path.join(out, 'id_ed25519'), key.privateKey, { mode: 0o600 });
fs.writeFileSync(path.join(out, 'id_ed25519.pub'), key.publicKey + '\n');
console.log('✔ clé générée :', key.fingerprint);

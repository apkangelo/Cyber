// Charge des scripts de l'interface (web/js) dans un contexte Node pour les tester sans navigateur.
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export function loadWeb(files) {
  const window = { matchMedia: () => ({ matches: false }), crypto: globalThis.crypto };
  const ctx = { window, atob, btoa, crypto: globalThis.crypto, TextEncoder, TextDecoder, console, setTimeout, clearTimeout };
  vm.createContext(ctx);
  for (const f of files) {
    const p = path.join(root, 'web', 'js', f);
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
  }
  return window.Cyber;
}

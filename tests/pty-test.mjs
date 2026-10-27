// Test du shell local des versions PC (desktop/local-core.js, node-pty).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { openLocal, splitArgs } = require('../desktop/local-core.js');

const args = splitArgs(`-a "deux mots" 'trois quatre' cinq`);
if (JSON.stringify(args) !== JSON.stringify(['-a', 'deux mots', 'trois quatre', 'cinq'])) throw new Error('splitArgs : ' + JSON.stringify(args));

await new Promise((resolve, reject) => {
  let out = '';
  const timer = setTimeout(() => reject(new Error('délai dépassé :\n' + out)), 15000);
  const win = process.platform === 'win32';
  const s = openLocal(
    { command: win ? 'cmd.exe' : '/bin/sh', cols: 90, rows: 20 },
    {
      onReady: () => {
        s.write(win ? 'echo pty-ok\r' : 'echo pty-$((3*4)); stty size\r');
      },
      onData: (d) => {
        out += d;
        if ((out.includes('pty-12') && out.includes('20 90')) || (win && out.includes('pty-ok'))) {
          if (!s.done) {
            s.done = true;
            s.write('exit\r');
          }
        }
      },
      onExit: (code) => {
        clearTimeout(timer);
        if (!s.done) return reject(new Error('sortie inattendue :\n' + out));
        console.log('✔ shell local (code ' + code + ')');
        resolve();
      },
    }
  );
});
console.log('Test du shell local passé.');

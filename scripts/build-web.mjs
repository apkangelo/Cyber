// Prépare l'interface : copie web/ vers www/ (Electron) et vers les assets Android,
// avec xterm.js, ses modules et les polices intégrées depuis node_modules.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = join(root, 'node_modules');
const out = join(root, 'www');
const androidAssets = join(root, 'android', 'app', 'src', 'main', 'assets', 'www');

const fail = (msg) => {
  console.error('✖ ' + msg);
  process.exit(1);
};

if (!existsSync(nm)) fail('node_modules introuvable : lance « npm install » d’abord.');

rmSync(out, { recursive: true, force: true });
cpSync(join(root, 'web'), out, { recursive: true });
mkdirSync(join(out, 'vendor'), { recursive: true });
mkdirSync(join(out, 'fonts'), { recursive: true });

// xterm.js et ses modules (obligatoires)
const vendor = [
  ['@xterm/xterm/lib/xterm.js', 'xterm.js'],
  ['@xterm/xterm/css/xterm.css', 'xterm.css'],
  ['@xterm/addon-fit/lib/addon-fit.js', 'addon-fit.js'],
  ['@xterm/addon-web-links/lib/addon-web-links.js', 'addon-web-links.js'],
  ['@xterm/addon-search/lib/addon-search.js', 'addon-search.js'],
  ['@xterm/addon-unicode11/lib/addon-unicode11.js', 'addon-unicode11.js'],
  ['@xterm/addon-webgl/lib/addon-webgl.js', 'addon-webgl.js'],
];
for (const [src, dest] of vendor) {
  const p = join(nm, src);
  if (!existsSync(p)) fail(`fichier manquant : node_modules/${src}`);
  copyFileSync(p, join(out, 'vendor', dest));
}

// Polices (facultatives : le terminal retombe sur une police du système)
const fonts = [
  ['@fontsource/jetbrains-mono', 'jetbrains-mono'],
  ['@fontsource/fira-code', 'fira-code'],
];
for (const [pkg, name] of fonts) {
  const dir = join(nm, pkg, 'files');
  if (!existsSync(dir)) {
    console.warn(`⚠ police ${name} absente (${pkg})`);
    continue;
  }
  const files = readdirSync(dir);
  for (const weight of ['400', '700']) {
    const f = files.find((x) => x === `${name}-latin-${weight}-normal.woff2`) || files.find((x) => x.includes(`latin-${weight}-normal`) && x.endsWith('.woff2') && !x.includes('ext'));
    if (f) copyFileSync(join(dir, f), join(out, 'fonts', `${name}-${weight}.woff2`));
    else console.warn(`⚠ ${name} ${weight} introuvable dans ${pkg}`);
  }
}

// Version affichée dans « À propos »
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
writeFileSync(join(out, 'version.json'), JSON.stringify({ version: pkg.version }) + '\n');

// Copie pour l'APK
if (existsSync(join(root, 'android', 'app'))) {
  rmSync(androidAssets, { recursive: true, force: true });
  mkdirSync(dirname(androidAssets), { recursive: true });
  cpSync(out, androidAssets, { recursive: true });
}

console.log('✔ Interface prête dans www/' + (existsSync(androidAssets) ? ' et android/app/src/main/assets/www/' : ''));

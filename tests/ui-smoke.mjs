// Test de fumée de l'interface (www/) dans Chromium, avec la petite démo intégrée (sans partie native).
// Usage : node tests/ui-smoke.mjs [dossier www]
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const www = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, 'www');
const url = pathToFileURL(path.join(www, 'index.html')).href;

const errors = [];
const browser = await chromium.launch();
const check = (cond, msg) => {
  if (!cond) throw new Error(msg);
  console.log('✔ ' + msg);
};

async function scenario(viewport, touch) {
  const ctx = await browser.newContext({ viewport, hasTouch: touch, isMobile: touch, locale: 'fr-FR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${viewport.width}px] ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${viewport.width}px] console : ${m.text()}`);
  });
  await page.goto(url);
  await page.waitForSelector('.term-host.active .xterm', { timeout: 10000 });
  check(true, `terminal affiché (${viewport.width}px)`);

  // taper une commande dans la démo
  await page.waitForFunction(() => window.Cyber.app.active && window.Cyber.app.active.state === 'connected');
  await page.evaluate(() => window.Cyber.app.active.term.focus());
  await page.keyboard.type('aide');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => {
    const b = window.Cyber.app.active.term.buffer.active;
    let t = '';
    for (let i = 0; i < b.length; i++) t += b.getLine(i).translateToString(true) + '\n';
    return t.includes('Commandes de la démo');
  }, null, { timeout: 5000 });
  check(true, 'la démo répond à « aide »');

  // nouvel onglet puis fermeture
  await page.evaluate(() => window.Cyber.app.openLocal());
  check((await page.locator('#tabs .tab').count()) === 2, 'deuxième onglet ouvert');
  await page.evaluate(() => window.Cyber.app.closeSession(window.Cyber.app.active, true));
  check((await page.locator('#tabs .tab').count()) === 1, 'onglet fermé');

  // réglages : toutes les sections
  await page.click('#btn-settings');
  await page.waitForSelector('.settings.show');
  for (const id of ['apparence', 'couleurs', 'police', 'terminal', 'clavier', 'shell', 'ssh', 'commandes', 'sauvegarde', 'apropos']) {
    await page.click(`.nav-item[data-id="${id}"]`);
    await page.waitForSelector('.settings-content .section-title');
  }
  check(true, 'toutes les sections des réglages s’ouvrent');

  // changer de thème
  await page.click('.nav-item[data-id="apparence"]');
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim());
  await page.locator('.theme-card').nth(3).click();
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--term-bg').trim());
  check(before !== after && after === (await page.evaluate(() => window.Cyber.store.settings.theme && window.Cyber.themes.get(window.Cyber.store.settings.theme).colors.background)), 'le thème s’applique (' + before + ' → ' + after + ')');
  const termBg = await page.evaluate(() => window.Cyber.app.active.term.options.theme.background);
  check(termBg === after, 'le terminal suit le thème');

  // modifier une couleur crée un thème personnel
  await page.click('.nav-item[data-id="couleurs"]');
  await page.locator('.color-grid input[type=color]').first().evaluate((el) => {
    el.value = '#123456';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.waitForTimeout(150);
  const custom = await page.evaluate(() => window.Cyber.store.settings.customThemes.length);
  check(custom === 1, 'thème personnel créé à la première modification');

  // générer une clé SSH
  await page.click('.nav-item[data-id="ssh"]');
  await page.getByRole('button', { name: 'Générer une clé Ed25519' }).click();
  await page.getByRole('button', { name: 'Générer', exact: true }).click();
  await page.waitForSelector('pre.pubkey', { timeout: 5000 });
  const pub = await page.locator('pre.pubkey').textContent();
  check(/^ssh-ed25519 AAAA/.test(pub), 'clé Ed25519 générée dans le navigateur');
  await page.getByRole('button', { name: 'OK' }).click();

  // fermer les réglages
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('.settings'));
  check(true, 'réglages fermés');

  // créer une connexion SSH
  if (!(await page.evaluate(() => document.getElementById('app').classList.contains('sidebar-open')))) {
    await page.click('#btn-menu');
    await page.waitForTimeout(300);
  }
  await page.click('#sidebar .side-head .icon-btn');
  await page.getByLabel('Nom').fill('Serveur de test');
  await page.getByLabel('Hôte').fill('192.168.1.20');
  await page.getByLabel('Utilisateur').fill('pi');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await page.waitForSelector('#sidebar .conn');
  check((await page.locator('#sidebar .conn strong').first().textContent()) === 'Serveur de test', 'connexion enregistrée et listée');

  // barre de touches supplémentaires
  await page.evaluate(() => window.Cyber.store.set('extraKeys', 'always'));
  await page.waitForTimeout(200);
  check((await page.locator('#extra-keys .xk').count()) >= 14, 'barre de touches affichée');
  await page.evaluate(() => window.Cyber.app.active.term.focus());
  await page.locator('#extra-keys .xk', { hasText: 'CTRL' }).dispatchEvent('pointerdown');
  await page.locator('#extra-keys .xk', { hasText: 'CTRL' }).dispatchEvent('pointerup');
  check(await page.evaluate(() => window.Cyber.keys.hasModifier()), 'CTRL collant activé');
  const ctrlC = await page.evaluate(() => window.Cyber.keys.applyModifiers('c'));
  check(ctrlC === '\x03', 'CTRL + c donne ^C');

  // sauvegarde : export puis import
  const ok = await page.evaluate(() => {
    const data = window.Cyber.store.exportAll(true);
    window.Cyber.store.importAll(JSON.parse(JSON.stringify(data)));
    return window.Cyber.store.profiles.length === 1 && window.Cyber.store.keys.length === 1;
  });
  check(ok, 'export puis import de la sauvegarde');

  await page.screenshot({ path: path.join(root, 'tests', 'out', `ui-${viewport.width}.png`) });
  await ctx.close();
}

try {
  await scenario({ width: 1280, height: 800 }, false);
  await scenario({ width: 412, height: 860 }, true);
} finally {
  await browser.close();
}
if (errors.length) {
  console.error('✖ erreurs dans la page :\n' + errors.join('\n'));
  process.exit(1);
}
console.log('Interface OK.');

'use strict';
// Session SSH interactive (bibliothèque ssh2), indépendante d'Electron pour pouvoir être testée.
const { Client } = require('ssh2');
const crypto = require('crypto');

function fingerprint(key) {
  return 'SHA256:' + crypto.createHash('sha256').update(key).digest('base64').replace(/=+$/, '');
}

function keyAlgo(key) {
  try {
    const n = key.readUInt32BE(0);
    return key.subarray(4, 4 + n).toString('ascii');
  } catch (e) {
    return '';
  }
}

function friendly(err) {
  const msg = String((err && err.message) || err || '');
  const code = err && err.code;
  if (code === 'ECONNREFUSED') return 'Connexion refusée : le port est fermé ou SSH n’est pas démarré sur le serveur.';
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') return 'Hôte introuvable : vérifie l’adresse.';
  if (code === 'EHOSTUNREACH' || code === 'ENETUNREACH') return 'Serveur injoignable depuis ce réseau.';
  if (code === 'ETIMEDOUT' || /Timed out while waiting for handshake/i.test(msg)) return 'Délai dépassé : le serveur ne répond pas.';
  if (code === 'ECONNRESET') return 'La connexion a été coupée par le serveur.';
  if (/All configured authentication methods failed|Too many authentication failures/i.test(msg) || (err && err.level === 'client-authentication'))
    return 'Authentification refusée : utilisateur, mot de passe ou clé incorrect.';
  if (/Host denied/i.test(msg)) return 'Clé du serveur refusée.';
  if (/passphrase|privateKey|Unsupported key format|Cannot parse/i.test(msg)) return 'Clé privée illisible, ou phrase de passe manquante ou incorrecte.';
  return msg || 'Erreur SSH inconnue.';
}

/**
 * Ouvre une session SSH.
 * o  : { host, port, username, password, privateKey, passphrase, cols, rows, knownFingerprint, keepalive, timeout, startupCommand }
 * cb : { onData(buf), onReady(), onStatus(text), onHostKey(info, answer), onError(message), onExit(code) }
 */
function openSsh(o, cb) {
  const conn = new Client();
  let stream = null;
  let closedByUser = false;
  let errored = false;
  let exitCode = null;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    cb.onExit(errored ? null : exitCode);
  };

  conn.on('ready', () => {
    conn.shell({ term: 'xterm-256color', cols: o.cols || 80, rows: o.rows || 24 }, (err, s) => {
      if (err) {
        errored = true;
        cb.onError('Impossible d’ouvrir le terminal distant : ' + err.message);
        conn.end();
        return;
      }
      stream = s;
      cb.onReady();
      s.on('data', (d) => cb.onData(d));
      s.stderr.on('data', (d) => cb.onData(d));
      s.on('exit', (code) => {
        exitCode = code;
      });
      s.on('close', () => conn.end());
      if (o.startupCommand) s.write(o.startupCommand + '\r');
    });
  });
  conn.on('keyboard-interactive', (name, instructions, lang, prompts, done) => done(prompts.map(() => o.password || '')));
  conn.on('banner', (msg) => {
    if (msg && cb.onBanner) cb.onBanner(msg);
  });
  conn.on('error', (err) => {
    if (closedByUser) return;
    errored = true;
    cb.onError(friendly(err));
  });
  conn.on('close', finish);

  const timeout = Math.max(5, Number(o.timeout) || 20);
  const cfg = {
    host: o.host,
    port: Number(o.port) || 22,
    username: o.username,
    // première connexion : on laisse le temps de vérifier l'empreinte
    readyTimeout: (o.knownFingerprint ? timeout : timeout + 90) * 1000,
    keepaliveInterval: (Number(o.keepalive) || 0) * 1000,
    keepaliveCountMax: 3,
    tryKeyboard: true,
    hostVerifier: (key, verify) => {
      const fp = fingerprint(key);
      if (o.knownFingerprint && fp === o.knownFingerprint) return verify(true);
      cb.onHostKey(
        { host: o.host, port: Number(o.port) || 22, algo: keyAlgo(key), fingerprint: fp, changed: !!o.knownFingerprint, expected: o.knownFingerprint || '' },
        (ok) => verify(!!ok)
      );
    },
  };
  if (o.password) cfg.password = o.password;
  if (o.privateKey) {
    cfg.privateKey = o.privateKey;
    if (o.passphrase) cfg.passphrase = o.passphrase;
  }
  try {
    conn.connect(cfg);
  } catch (e) {
    errored = true;
    cb.onError(friendly(e));
    setImmediate(finish);
  }

  return {
    write(d) {
      if (stream) stream.write(d);
    },
    resize(cols, rows) {
      if (stream) stream.setWindow(Math.max(rows, 1), Math.max(cols, 1), 0, 0);
    },
    close() {
      closedByUser = true;
      try {
        if (stream) stream.close();
      } catch (e) {}
      conn.end();
    },
  };
}

module.exports = { openSsh, fingerprint, friendly };

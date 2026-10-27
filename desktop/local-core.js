'use strict';
// Shell local avec un vrai pseudo-terminal (node-pty : ConPTY sous Windows, forkpty sous Linux).
const os = require('os');
const fs = require('fs');
const path = require('path');

let pty = null;
let ptyError = null;
try {
  pty = require('node-pty');
} catch (e) {
  ptyError = e;
}

/** Découpe « -a "deux mots" 'trois' » en arguments */
function splitArgs(text) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(String(text || '')))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

function defaultShell() {
  if (process.platform === 'win32') return 'powershell.exe';
  return process.env.SHELL || (fs.existsSync('/bin/bash') ? '/bin/bash' : '/bin/sh');
}

function resolveCwd(cwd) {
  let dir = String(cwd || '').trim();
  if (!dir) return os.homedir();
  if (dir === '~' || dir.startsWith('~/') || dir.startsWith('~\\')) dir = path.join(os.homedir(), dir.slice(1));
  try {
    if (fs.statSync(dir).isDirectory()) return dir;
  } catch (e) {}
  return os.homedir();
}

/**
 * o  : { command, args, cwd, cols, rows }
 * cb : { onData(str), onReady(), onExit(code) }
 */
function openLocal(o, cb) {
  if (!pty) throw new Error('Le module node-pty est indisponible : ' + (ptyError ? ptyError.message : 'inconnu'));
  const command = String(o.command || '').trim() || defaultShell();
  const args = splitArgs(o.args);
  const env = Object.assign({}, process.env, { TERM: 'xterm-256color', COLORTERM: 'truecolor', TERM_PROGRAM: 'Cyber' });
  let p;
  try {
    p = pty.spawn(command, args, {
      name: 'xterm-256color',
      cols: Math.max(o.cols || 80, 1),
      rows: Math.max(o.rows || 24, 1),
      cwd: resolveCwd(o.cwd),
      env,
    });
  } catch (e) {
    throw new Error(`Impossible de lancer « ${command} » : ${e.message}`);
  }
  p.onData((d) => cb.onData(d));
  p.onExit(({ exitCode }) => cb.onExit(exitCode));
  setImmediate(() => cb.onReady());
  return {
    pid: p.pid,
    write(d) {
      p.write(d);
    },
    resize(cols, rows) {
      try {
        p.resize(Math.max(cols, 1), Math.max(rows, 1));
      } catch (e) {}
    },
    close() {
      try {
        p.kill();
      } catch (e) {}
    },
  };
}

module.exports = { openLocal, splitArgs, defaultShell, available: () => !!pty, loadError: () => ptyError };

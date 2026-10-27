/* Cyber — génération et lecture de clés SSH (format OpenSSH) */
(function () {
  'use strict';
  const C = window.Cyber;
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const concat = (...parts) => {
    const arrs = parts.map((p) => (p instanceof Uint8Array ? p : new Uint8Array(p)));
    const out = new Uint8Array(arrs.reduce((n, a) => n + a.length, 0));
    let o = 0;
    for (const a of arrs) {
      out.set(a, o);
      o += a.length;
    }
    return out;
  };
  const u32 = (n) => new Uint8Array([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
  const sshStr = (bytes) => concat(u32(bytes.length), bytes);

  async function sha256Fingerprint(blob) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', blob));
    return 'SHA256:' + C.bytesToB64(digest).replace(/=+$/, '');
  }

  function pem(label, body) {
    const b64 = C.bytesToB64(body).match(/.{1,70}/g).join('\n');
    return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----\n`;
  }

  /** Lit un champ string SSH (uint32 + octets) */
  function reader(buf) {
    let o = 0;
    return {
      u32() {
        const v = ((buf[o] << 24) | (buf[o + 1] << 16) | (buf[o + 2] << 8) | buf[o + 3]) >>> 0;
        o += 4;
        return v;
      },
      bytes() {
        const n = this.u32();
        if (n > buf.length - o) throw new Error('clé tronquée');
        const v = buf.subarray(o, o + n);
        o += n;
        return v;
      },
      str() {
        return dec.decode(this.bytes());
      },
      raw(n) {
        const v = buf.subarray(o, o + n);
        o += n;
        return v;
      },
    };
  }

  const keygen = {
    supported() {
      return !!(window.crypto && crypto.subtle && crypto.subtle.generateKey);
    },

    /** Crée une paire Ed25519 au format OpenSSH */
    async generateEd25519(comment) {
      let kp;
      try {
        kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
      } catch (e) {
        throw new Error("Ce système ne sait pas générer de clé Ed25519 (WebView trop ancienne). Importe une clé existante à la place.");
      }
      const pub = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey));
      const pkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', kp.privateKey));
      const seed = pkcs8.slice(pkcs8.length - 32);
      const type = enc.encode('ssh-ed25519');
      const pubBlob = concat(sshStr(type), sshStr(pub));
      const check = crypto.getRandomValues(new Uint32Array(1))[0];
      let priv = concat(u32(check), u32(check), sshStr(type), sshStr(pub), sshStr(concat(seed, pub)), sshStr(enc.encode(comment)));
      for (let i = 1; priv.length % 8 !== 0; i++) priv = concat(priv, [i & 255]);
      const body = concat(
        enc.encode('openssh-key-v1\0'),
        sshStr(enc.encode('none')),
        sshStr(enc.encode('none')),
        sshStr(new Uint8Array(0)),
        u32(1),
        sshStr(pubBlob),
        sshStr(priv)
      );
      return {
        type: 'ssh-ed25519',
        privateKey: pem('OPENSSH PRIVATE KEY', body),
        publicKey: `ssh-ed25519 ${C.bytesToB64(pubBlob)} ${comment}`,
        fingerprint: await sha256Fingerprint(pubBlob),
        encrypted: false,
      };
    },

    /** Analyse une clé privée collée ou importée : type, clé publique si lisible, chiffrée ou non */
    async inspect(text) {
      text = String(text || '').trim();
      const info = { type: 'inconnu', publicKey: '', fingerprint: '', encrypted: false, valid: false };
      const m = text.match(/-----BEGIN ([A-Z0-9 ]+)-----([\s\S]+?)-----END \1-----/);
      if (!m) {
        const putty = text.match(/^PuTTY-User-Key-File-\d+:\s*(\S+)/m);
        if (putty) {
          info.type = putty[1];
          info.valid = true;
          info.encrypted = /^Encryption:\s*(?!none)/m.test(text);
        }
        return info;
      }
      const label = m[1];
      info.valid = true;
      if (label === 'OPENSSH PRIVATE KEY') {
        try {
          const body = C.b64ToBytes(m[2].replace(/\s+/g, ''));
          const magic = dec.decode(body.subarray(0, 15));
          if (magic !== 'openssh-key-v1\0') throw new Error('format');
          const r = reader(body);
          r.raw(15);
          const cipher = r.str();
          r.str();
          r.bytes();
          const n = r.u32();
          if (n < 1) throw new Error('vide');
          const pubBlob = r.bytes();
          const pr = reader(pubBlob);
          info.type = pr.str();
          info.encrypted = cipher !== 'none';
          info.publicKey = `${info.type} ${C.bytesToB64(pubBlob)}`;
          info.fingerprint = await sha256Fingerprint(pubBlob);
        } catch (e) {
          info.valid = false;
        }
      } else {
        info.type = label.replace(' PRIVATE KEY', '').toLowerCase() || 'pkcs8';
        info.encrypted = /ENCRYPTED/.test(label) || /Proc-Type:\s*4,ENCRYPTED/.test(text);
      }
      return info;
    },
  };

  C.keygen = keygen;
})();

#!/usr/bin/env bash
# Démarre un serveur OpenSSH de test sur le port 2222 (utilisateur cyber / mot de passe cyber + clé tests/out/id_ed25519.pub).
set -euo pipefail
cd "$(dirname "$0")/.."
docker run -d --name sshd -p 2222:2222 \
  -e PUID=1000 -e PGID=1000 -e PASSWORD_ACCESS=true \
  -e USER_NAME=cyber -e USER_PASSWORD=cyber \
  -e PUBLIC_KEY="$(cat tests/out/id_ed25519.pub)" \
  lscr.io/linuxserver/openssh-server:latest
for i in $(seq 1 90); do
  if docker logs sshd 2>&1 | grep -q "done"; then break; fi
  sleep 1
done
for i in $(seq 1 30); do (echo > /dev/tcp/127.0.0.1/2222) 2>/dev/null && break; sleep 1; done
sleep 2

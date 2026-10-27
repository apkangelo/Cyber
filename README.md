<p align="center"><img src="build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** et **shell local** pour **Android, Windows et Linux**, dans l'esprit de Termux, avec une interface
qu'on règle dans les moindres détails : thèmes, chacune des 16 couleurs, police, curseur, barre de touches, commandes
rapides… Les trois versions partagent la même interface et le même format de sauvegarde : tes réglages et tes
serveurs passent du téléphone au PC en un fichier.

Pensé pour le Galaxy Z Fold : plié, les connexions s'ouvrent dans un tiroir ; déplié (ou sur PC), elles restent
affichées à gauche.

## Télécharger

| Système | Fichier | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 ou plus récent |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | installeur |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | sans installation |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` puis lancer |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | extraire puis lancer `./cyber` |

Toutes les versions sont dans l'onglet [*Releases*](https://github.com/apk-fold/Cyber/releases), avec leurs
empreintes SHA-256. Elles sont compilées automatiquement par GitHub Actions à chaque modification du code.

- **Android** : ouvre `Cyber.apk`, autorise l'installation depuis cette source, puis *Installer*. Les mises à jour
  s'installent par-dessus sans perdre tes réglages (même clé de signature).
- **Windows** : les fichiers ne sont pas signés, SmartScreen demandera *Informations complémentaires → Exécuter quand
  même*.

## Ce que fait Cyber

### Terminal
- Moteur [xterm.js](https://xtermjs.org) : 256 couleurs et couleurs 24 bits, Unicode, liens cliquables, rendu GPU.
- **Onglets** illimités (renommer, dupliquer, reconnecter, copier tout le texte), **recherche** dans l'historique,
  historique réglable jusqu'à 100 000 lignes.
- Copier/coller au clic droit, à la sélection ou avec Ctrl+C / Ctrl+V (au choix).

### Shell local
- **Android** : le shell du système (`/system/bin/sh`) dans un **vrai pseudo-terminal** (module natif), avec un
  **script de démarrage** modifiable dans les réglages (invite, alias, variables).
- **Windows** : PowerShell par défaut, ou `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux** : ton shell (`$SHELL`).
- Commande, arguments et dossier de départ réglables.

### SSH
- **Profils** enregistrés (nom, hôte, port, utilisateur, couleur, thème propre à chaque serveur) et **connexion
  rapide** `utilisateur@hôte:port`.
- Mot de passe (demandé à chaque fois ou mémorisé) ou **clé SSH** : génération de clés **Ed25519** dans l'appli
  (clé publique copiée en un geste), import de clés OpenSSH, PEM et PuTTY, phrases de passe.
- **Vérification de l'empreinte** du serveur à la première connexion et alerte si elle change.
- Maintien de connexion, délai réglable, **commande au démarrage** (ex. `tmux attach || tmux`).
- Sur Android, une notification garde les sessions ouvertes quand l'appli passe en arrière-plan.

### Personnalisation
- **12 thèmes** : Cyber néon, Minuit, Nuit de Tokyo, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrice,
  Ambre rétro, Papier (clair).
- **Éditeur de couleurs** : fond, texte, curseur, sélection et les 16 couleurs ANSI, avec aperçu en direct ; export
  et import de thèmes.
- Couleur d'accent de l'interface, marge, onglets en haut ou en bas.
- Police : JetBrains Mono et Fira Code intégrées, ou n'importe quelle police installée ; taille, interligne,
  espacement, graisses, contraste minimum.
- Curseur bloc, trait bas ou barre, clignotant ou non ; sonnerie flash, son ou vibration.

### Clavier tactile
- **Barre de touches** façon Termux (ESC, TAB, CTRL, ALT, flèches, HOME, END, PG↑/PG↓, F1–F12…) dont tu écris la
  disposition toi-même, sur 1 à 4 rangées. Toute autre touche envoie son texte (`|`, `~`, `:wq`…).
- CTRL et ALT « collants » : un appui = une fois, deux appuis rapides = verrouillé.
- **Zoom à deux doigts** sur le terminal, vibration à l'appui (désactivable).

### Commandes rapides
Le bouton ⚡ envoie une commande enregistrée dans l'onglet actif, avec ou sans Entrée.

### Sauvegarde
Export en JSON de tous les réglages, thèmes, connexions et serveurs de confiance (mots de passe et clés privées
seulement si tu le demandes), puis restauration sur un autre appareil.

## Raccourcis (PC)

| Raccourci | Action |
|---|---|
| Ctrl+Maj+T | Nouveau shell local |
| Ctrl+Maj+N | Nouvelle connexion SSH |
| Ctrl+Maj+W | Fermer l'onglet |
| Ctrl+Tab / Ctrl+Maj+Tab | Onglet suivant / précédent |
| Alt+1 … Alt+9 | Aller à l'onglet n |
| Ctrl+Maj+C / Ctrl+Maj+V | Copier / coller |
| Ctrl+Maj+F | Rechercher |
| Ctrl + / Ctrl − / Ctrl 0 | Taille du texte |
| Ctrl+, | Réglages |

## Compiler soi-même

Il faut [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # lance la version PC en développement
npm run dist:win       # installeur + version portable Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (à lancer sous Linux)
```

Pour l'APK (JDK 21 et SDK Android, ou Android Studio) :

```sh
npm install
npm run build:web      # copie l'interface dans android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Le module natif du shell local (`android/app/src/main/cpp`) est compilé avec le NDK, qu'Android Studio installe
au besoin.

## Signature de l'APK

Toutes les versions sont signées avec **la même clé** (`signing/cyber.jks`) pour que les mises à jour s'installent
par-dessus. Cette clé est publique dans le dépôt : n'installe Cyber que depuis ce dépôt. Pour utiliser une clé privée,
ajoute dans *Settings › Secrets › Actions* les secrets `CYBER_KEYSTORE_B64` (le fichier .jks en base64),
`CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` et `CYBER_KEY_PASSWORD` (changer de clé impose de désinstaller l'ancienne
version : exporte d'abord ta sauvegarde).

## Bon à savoir

- Réglages, connexions, clés et serveurs de confiance sont stockés **sur l'appareil uniquement**, sans chiffrement
  supplémentaire. Ne mémorise pas de mot de passe sur un appareil partagé.
- Le shell local d'Android donne accès aux commandes du système (`ls`, `cat`, `ping`, `top`…), pas à un Linux complet
  avec gestionnaire de paquets comme Termux : pour ça, connecte-toi en SSH à un serveur (ou à Termux lui-même avec
  `sshd`).

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `web/` | Interface commune (HTML, CSS, JavaScript) |
| `desktop/` | Version Windows et Linux (Electron, ssh2, node-pty) |
| `android/` | Version Android (WebView, JSch, pseudo-terminal en C) |
| `scripts/` | Préparation de l'interface et aide à la compilation |
| `tests/` | Tests SSH réels, shell local et interface (lancés à chaque compilation) |
| `signing/` | Clé de signature de l'APK |

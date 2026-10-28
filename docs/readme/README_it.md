<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · **Italiano**
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminale **SSH** e **shell locale** per **Android, Windows e Linux**, nello spirito di Termux, con un'interfaccia che si regola nei minimi dettagli: temi, ognuno dei 16 colori, carattere, cursore, barra dei tasti, comandi rapidi… Le tre versioni condividono la stessa interfaccia e lo stesso formato di backup: le tue impostazioni e i tuoi server passano dal telefono al PC con un solo file.

Pensato per il Galaxy Z Fold: da chiuso, le connessioni si aprono in un cassetto; da aperto (o sul PC), restano visibili a sinistra.

## Scaricare

| Sistema | File | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 o successivo |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | programma di installazione |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | senza installazione |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` poi avvialo |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | estrai e avvia `./cyber` |

Tutte le versioni sono nella scheda [*Releases*](https://github.com/apk-fold/Cyber/releases), con i relativi hash SHA-256. Vengono compilate automaticamente da GitHub Actions a ogni modifica del codice.

- **Android**: apri `Cyber.apk`, consenti l'installazione da questa origine, poi tocca *Installa*. Gli aggiornamenti si installano sopra la versione precedente senza perdere le impostazioni (stessa chiave di firma).
- **Windows**: i file non sono firmati, quindi SmartScreen chiederà *Ulteriori informazioni → Esegui comunque*.

## Cosa fa Cyber

### Terminale
- Motore [xterm.js](https://xtermjs.org): 256 colori e colore a 24 bit, Unicode, link cliccabili, rendering su GPU.
- **Schede** illimitate (rinomina, duplica, riconnetti, copia tutto il testo), **ricerca** nella cronologia, cronologia regolabile fino a 100.000 righe.
- Copia/incolla con il clic destro, alla selezione o con Ctrl+C / Ctrl+V (a scelta).

### Shell locale
- **Android**: la shell di sistema (`/system/bin/sh`) in un **vero pseudo-terminale** (modulo nativo), con uno **script di avvio** modificabile nelle impostazioni (prompt, alias, variabili).
- **Windows**: PowerShell di default, oppure `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: la tua shell (`$SHELL`).
- Comando, argomenti e cartella iniziale configurabili.

### SSH
- **Profili** salvati (nome, host, porta, utente, colore, tema dedicato per ogni server) e **connessione rapida** con `utente@host:porta`.
- Password (richiesta ogni volta o memorizzata) oppure **chiave SSH**: generazione di chiavi **Ed25519** nell'app (chiave pubblica copiata con un tocco), importazione di chiavi OpenSSH, PEM e PuTTY, passphrase.
- **Verifica dell'impronta** del server alla prima connessione e avviso se cambia.
- Keep-alive, timeout regolabile, **comando all'avvio** (es. `tmux attach || tmux`).
- Su Android, una notifica tiene aperte le sessioni quando l'app passa in background.

### Personalizzazione
- **12 temi**: Cyber Neon, Mezzanotte, Notte di Tokyo, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Ambra retrò, Carta (chiaro).
- **Editor dei colori**: sfondo, testo, cursore, selezione e i 16 colori ANSI, con anteprima dal vivo; esportazione e importazione dei temi.
- Colore d'accento dell'interfaccia, margini, schede in alto o in basso.
- Carattere: JetBrains Mono e Fira Code integrati, o qualsiasi font installato; dimensione, interlinea, spaziatura, pesi, contrasto minimo.
- Cursore a blocco, sottolineato o a barra, lampeggiante o no; campanello come lampo, suono o vibrazione.

### Tastiera touch
- **Barra dei tasti** in stile Termux (ESC, TAB, CTRL, ALT, frecce, HOME, END, PG↑/PG↓, F1–F12…) di cui scrivi tu la disposizione, su 1-4 righe. Qualsiasi altro tasto invia il proprio testo (`|`, `~`, `:wq`…).
- CTRL e ALT "permanenti": un tocco = una volta, due tocchi rapidi = bloccato.
- **Zoom con due dita** sul terminale, vibrazione alla pressione (disattivabile).

### Comandi rapidi
Il pulsante ⚡ invia un comando salvato alla scheda attiva, con o senza Invio.

### Backup
Esportazione in JSON di tutte le impostazioni, temi, connessioni e server attendibili (password e chiavi private solo se lo chiedi), poi ripristino su un altro dispositivo.

## Scorciatoie (PC)

| Scorciatoia | Azione |
|---|---|
| Ctrl+Maiusc+T | Nuova shell locale |
| Ctrl+Maiusc+N | Nuova connessione SSH |
| Ctrl+Maiusc+W | Chiudi la scheda |
| Ctrl+Tab / Ctrl+Maiusc+Tab | Scheda successiva / precedente |
| Alt+1 … Alt+9 | Vai alla scheda n |
| Ctrl+Maiusc+C / Ctrl+Maiusc+V | Copia / incolla |
| Ctrl+Maiusc+F | Cerca |
| Ctrl + / Ctrl − / Ctrl 0 | Dimensione del testo |
| Ctrl+, | Impostazioni |

## Compilarlo da solo

Serve [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # avvia la versione PC in modalità sviluppo
npm run dist:win       # programma di installazione + versione portable per Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (da eseguire su Linux)
```

Per l'APK (JDK 21 e SDK Android, oppure Android Studio):

```sh
npm install
npm run build:web      # copia l'interfaccia in android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Il modulo nativo della shell locale (`android/app/src/main/cpp`) viene compilato con l'NDK, che Android Studio installa quando serve.

## Firma dell'APK

Tutte le versioni sono firmate con **la stessa chiave** (`signing/cyber.jks`) perché gli aggiornamenti si installino sopra la versione precedente. Questa chiave è pubblica nel repository: installa Cyber solo da questo repository. Per usare una chiave privata, aggiungi in *Settings › Secrets › Actions* i secret `CYBER_KEYSTORE_B64` (il file .jks in base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` e `CYBER_KEY_PASSWORD` (cambiare chiave obbliga a disinstallare la vecchia versione: esporta prima il tuo backup).

## Buono a sapersi

- Impostazioni, connessioni, chiavi e server attendibili sono salvati **solo sul dispositivo**, senza crittografia aggiuntiva. Non memorizzare password su un dispositivo condiviso.
- La shell locale di Android dà accesso ai comandi del sistema (`ls`, `cat`, `ping`, `top`…), non a un Linux completo con gestore di pacchetti come Termux: per quello, connettiti via SSH a un server (o a Termux stesso con `sshd`).

## Struttura del repository

| Cartella | Contenuto |
|---|---|
| `web/` | Interfaccia comune (HTML, CSS, JavaScript) |
| `desktop/` | Versione Windows e Linux (Electron, ssh2, node-pty) |
| `android/` | Versione Android (WebView, JSch, pseudo-terminale in C) |
| `scripts/` | Preparazione dell'interfaccia e aiuti alla compilazione |
| `tests/` | Test reali di SSH, shell locale e interfaccia (eseguiti a ogni compilazione) |
| `signing/` | Chiave di firma dell'APK |

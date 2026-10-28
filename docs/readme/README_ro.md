<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · **Română**

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** și **shell local** pentru **Android, Windows și Linux**, în spiritul Termux, cu o interfață reglabilă până la cel mai mic detaliu: teme, fiecare dintre cele 16 culori, font, cursor, bară de taste, comenzi rapide… Cele trei versiuni au aceeași interfață și același format de backup: setările și serverele tale trec de pe telefon pe PC într-un singur fișier.

Gândit pentru Galaxy Z Fold: pliat, conexiunile se deschid într-un sertar; desfăcut (sau pe PC), rămân afișate în stânga.

## Descărcare

| Sistem | Fișier | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 sau mai nou |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | program de instalare |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | fără instalare |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage`, apoi pornește-l |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | dezarhivează, apoi pornește `./cyber` |

Toate versiunile sunt în fila [*Releases*](https://github.com/apk-fold/Cyber/releases), împreună cu sumele lor SHA-256. Sunt compilate automat de GitHub Actions la fiecare modificare a codului.

- **Android**: deschide `Cyber.apk`, permite instalarea din această sursă, apoi atinge *Instalează*. Actualizările se instalează peste versiunea veche fără să-ți pierzi setările (aceeași cheie de semnare).
- **Windows**: fișierele nu sunt semnate, așa că SmartScreen îți va cere *Mai multe informații → Rulați oricum*.

## Ce face Cyber

### Terminal
- Motor [xterm.js](https://xtermjs.org): 256 de culori și culoare pe 24 de biți, Unicode, linkuri pe care se poate da clic, randare pe GPU.
- **File** nelimitate (redenumire, duplicare, reconectare, copierea întregului text), **căutare** în istoric, istoric reglabil până la 100.000 de linii.
- Copiere/lipire cu clic dreapta, la selecție sau cu Ctrl+C / Ctrl+V (la alegere).

### Shell local
- **Android**: shell-ul sistemului (`/system/bin/sh`) într-un **pseudo-terminal adevărat** (modul nativ), cu un **script de pornire** editabil în setări (prompt, aliasuri, variabile).
- **Windows**: implicit PowerShell, sau `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: shell-ul tău (`$SHELL`).
- Comandă, argumente și dosar de pornire configurabile.

### SSH
- **Profiluri** salvate (nume, gazdă, port, utilizator, culoare, temă proprie fiecărui server) și **conectare rapidă** cu `utilizator@gazdă:port`.
- Parolă (cerută de fiecare dată sau memorată) ori **cheie SSH**: generarea de chei **Ed25519** în aplicație (cheia publică se copiază dintr-o atingere), importul cheilor OpenSSH, PEM și PuTTY, fraze de acces.
- **Verificarea amprentei** serverului la prima conectare și avertizare dacă se schimbă.
- Keep-alive, timp de expirare reglabil, **comandă la pornire** (de ex. `tmux attach || tmux`).
- Pe Android, o notificare ține sesiunile deschise când aplicația trece în fundal.

### Personalizare
- **12 teme**: Cyber Neon, Miezul nopții, Noapte în Tokyo, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Chihlimbar retro, Hârtie (deschisă).
- **Editor de culori**: fundal, text, cursor, selecție și cele 16 culori ANSI, cu previzualizare live; export și import de teme.
- Culoarea de accent a interfeței, margini, filele sus sau jos.
- Font: JetBrains Mono și Fira Code incluse, sau orice font instalat; mărime, înălțimea rândului, spațierea literelor, grosimi, contrast minim.
- Cursor bloc, subliniere sau bară, care clipește sau nu; clopoțel ca flash, sunet sau vibrație.

### Tastatură tactilă
- **Bară de taste** în stil Termux (ESC, TAB, CTRL, ALT, săgeți, HOME, END, PG↑/PG↓, F1–F12…) a cărei dispunere o scrii tu, pe 1 până la 4 rânduri. Orice altă tastă își trimite textul (`|`, `~`, `:wq`…).
- CTRL și ALT „lipicioase”: o atingere = o dată, două atingeri rapide = blocat.
- **Zoom cu două degete** în terminal, vibrație la apăsare (se poate dezactiva).

### Comenzi rapide
Butonul ⚡ trimite o comandă salvată în fila activă, cu sau fără Enter.

### Backup
Export JSON al tuturor setărilor, temelor, conexiunilor și serverelor de încredere (parolele și cheile private doar dacă ceri asta), apoi restaurare pe alt dispozitiv.

## Scurtături (PC)

| Scurtătură | Acțiune |
|---|---|
| Ctrl+Shift+T | Shell local nou |
| Ctrl+Shift+N | Conexiune SSH nouă |
| Ctrl+Shift+W | Închide fila |
| Ctrl+Tab / Ctrl+Shift+Tab | Fila următoare / anterioară |
| Alt+1 … Alt+9 | Mergi la fila n |
| Ctrl+Shift+C / Ctrl+Shift+V | Copiere / lipire |
| Ctrl+Shift+F | Căutare |
| Ctrl + / Ctrl − / Ctrl 0 | Mărimea textului |
| Ctrl+, | Setări |

## Compilează-l singur

Ai nevoie de [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # pornește versiunea de PC în modul de dezvoltare
npm run dist:win       # program de instalare + versiune portabilă Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (de rulat pe Linux)
```

Pentru APK (JDK 21 și Android SDK, sau Android Studio):

```sh
npm install
npm run build:web      # copiază interfața în android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Modulul nativ al shell-ului local (`android/app/src/main/cpp`) se compilează cu NDK, pe care Android Studio îl instalează la nevoie.

## Semnarea APK-ului

Toate versiunile sunt semnate cu **aceeași cheie** (`signing/cyber.jks`), ca actualizările să se instaleze peste versiunea veche. Cheia este publică în depozit: instalează Cyber doar din acest depozit. Pentru o cheie privată, adaugă în *Settings › Secrets › Actions* secretele `CYBER_KEYSTORE_B64` (fișierul .jks în base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` și `CYBER_KEY_PASSWORD` (schimbarea cheii obligă la dezinstalarea versiunii vechi: exportă mai întâi backupul).

## Bine de știut

- Setările, conexiunile, cheile și serverele de încredere sunt stocate **doar pe dispozitiv**, fără criptare suplimentară. Nu memora parole pe un dispozitiv partajat.
- Shell-ul local de pe Android oferă acces la comenzile sistemului (`ls`, `cat`, `ping`, `top`…), nu la un Linux complet cu manager de pachete ca Termux: pentru asta, conectează-te prin SSH la un server (sau chiar la Termux, cu `sshd`).

## Organizarea depozitului

| Dosar | Conținut |
|---|---|
| `web/` | Interfața comună (HTML, CSS, JavaScript) |
| `desktop/` | Versiunea pentru Windows și Linux (Electron, ssh2, node-pty) |
| `android/` | Versiunea pentru Android (WebView, JSch, pseudo-terminal în C) |
| `scripts/` | Pregătirea interfeței și ajutoare pentru compilare |
| `tests/` | Teste reale SSH, shell local și interfață (rulate la fiecare compilare) |
| `signing/` | Cheia de semnare a APK-ului |

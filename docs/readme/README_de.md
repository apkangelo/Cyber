<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · **Deutsch** · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

**SSH**-Terminal und **lokale Shell** für **Android, Windows und Linux**, im Geist von Termux, mit einer Oberfläche, die sich bis ins kleinste Detail einstellen lässt: Themes, jede der 16 Farben, Schrift, Cursor, Tastenleiste, Schnellbefehle… Alle drei Versionen teilen dieselbe Oberfläche und dasselbe Sicherungsformat: Deine Einstellungen und Server wandern mit einer einzigen Datei vom Handy auf den PC.

Für das Galaxy Z Fold gedacht: zugeklappt öffnen sich die Verbindungen in einer Schublade; aufgeklappt (oder am PC) bleiben sie links sichtbar.

## Herunterladen

| System | Datei | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 oder neuer |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | Installer |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | ohne Installation |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage`, dann starten |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | entpacken, dann `./cyber` starten |

Alle Versionen findest du mit ihren SHA-256-Prüfsummen im Tab [*Releases*](https://github.com/apk-fold/Cyber/releases). Sie werden bei jeder Codeänderung automatisch von GitHub Actions gebaut.

- **Android**: Öffne `Cyber.apk`, erlaube die Installation aus dieser Quelle und tippe auf *Installieren*. Updates werden über die alte Version installiert, ohne dass deine Einstellungen verloren gehen (gleicher Signaturschlüssel).
- **Windows**: Die Dateien sind nicht signiert, SmartScreen verlangt daher *Weitere Informationen → Trotzdem ausführen*.

## Was Cyber kann

### Terminal
- [xterm.js](https://xtermjs.org)-Engine: 256 Farben und 24-Bit-Farbe, Unicode, anklickbare Links, GPU-Rendering.
- Unbegrenzt viele **Tabs** (umbenennen, duplizieren, neu verbinden, gesamten Text kopieren), **Suche** im Verlauf, Verlauf einstellbar bis 100.000 Zeilen.
- Kopieren/Einfügen per Rechtsklick, beim Markieren oder mit Strg+C / Strg+V (nach Wahl).

### Lokale Shell
- **Android**: die System-Shell (`/system/bin/sh`) in einem **echten Pseudoterminal** (natives Modul), mit einem **Startskript**, das sich in den Einstellungen bearbeiten lässt (Prompt, Aliase, Variablen).
- **Windows**: standardmäßig PowerShell, oder `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: deine Shell (`$SHELL`).
- Befehl, Argumente und Startordner einstellbar.

### SSH
- Gespeicherte **Profile** (Name, Host, Port, Benutzer, Farbe, eigenes Theme pro Server) und **Schnellverbindung** per `benutzer@host:port`.
- Passwort (jedes Mal abgefragt oder gespeichert) oder **SSH-Schlüssel**: Erzeugung von **Ed25519**-Schlüsseln in der App (öffentlicher Schlüssel mit einem Tippen kopiert), Import von OpenSSH-, PEM- und PuTTY-Schlüsseln, Passphrasen.
- **Prüfung des Fingerabdrucks** des Servers bei der ersten Verbindung und Warnung, wenn er sich ändert.
- Keep-Alive, einstellbares Timeout, **Startbefehl** (z. B. `tmux attach || tmux`).
- Unter Android hält eine Benachrichtigung die Sitzungen offen, wenn die App in den Hintergrund wechselt.

### Anpassung
- **12 Themes**: Cyber Neon, Mitternacht, Tokyo Night, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Retro-Bernstein, Papier (hell).
- **Farbeditor**: Hintergrund, Text, Cursor, Auswahl und die 16 ANSI-Farben, mit Live-Vorschau; Export und Import von Themes.
- Akzentfarbe der Oberfläche, Innenabstand, Tabs oben oder unten.
- Schrift: JetBrains Mono und Fira Code integriert, oder jede installierte Schrift; Größe, Zeilenhöhe, Zeichenabstand, Schriftstärken, Mindestkontrast.
- Block-, Unterstrich- oder Balken-Cursor, blinkend oder nicht; Signalton als Blitz, Ton oder Vibration.

### Touch-Tastatur
- **Tastenleiste** im Termux-Stil (ESC, TAB, CTRL, ALT, Pfeile, HOME, END, PG↑/PG↓, F1–F12…), deren Belegung du selbst schreibst, auf 1 bis 4 Reihen. Jede andere Taste sendet ihren Text (`|`, `~`, `:wq`…).
- „Klebende“ CTRL- und ALT-Tasten: einmal tippen = einmal, zweimal schnell tippen = gesperrt.
- **Zoom mit zwei Fingern** im Terminal, Vibration beim Tippen (abschaltbar).

### Schnellbefehle
Die Schaltfläche ⚡ sendet einen gespeicherten Befehl an den aktiven Tab, mit oder ohne Enter.

### Sicherung
Export aller Einstellungen, Themes, Verbindungen und vertrauenswürdigen Server als JSON (Passwörter und private Schlüssel nur, wenn du es möchtest) und Wiederherstellung auf einem anderen Gerät.

## Tastenkürzel (PC)

| Tastenkürzel | Aktion |
|---|---|
| Strg+Umschalt+T | Neue lokale Shell |
| Strg+Umschalt+N | Neue SSH-Verbindung |
| Strg+Umschalt+W | Tab schließen |
| Strg+Tab / Strg+Umschalt+Tab | Nächster / vorheriger Tab |
| Alt+1 … Alt+9 | Zu Tab n wechseln |
| Strg+Umschalt+C / Strg+Umschalt+V | Kopieren / Einfügen |
| Strg+Umschalt+F | Suchen |
| Strg + / Strg − / Strg 0 | Textgröße |
| Strg+, | Einstellungen |

## Selbst bauen

Du brauchst [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # startet die PC-Version im Entwicklungsmodus
npm run dist:win       # Windows-Installer + portable Version → release/
npm run dist:linux     # AppImage + tar.gz → release/ (unter Linux ausführen)
```

Für die APK (JDK 21 und Android SDK, oder Android Studio):

```sh
npm install
npm run build:web      # kopiert die Oberfläche nach android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Das native Modul der lokalen Shell (`android/app/src/main/cpp`) wird mit dem NDK kompiliert, das Android Studio bei Bedarf installiert.

## Signatur der APK

Alle Versionen sind mit **demselben Schlüssel** (`signing/cyber.jks`) signiert, damit Updates über die alte Version installiert werden. Dieser Schlüssel ist im Repository öffentlich: Installiere Cyber nur aus diesem Repository. Um einen privaten Schlüssel zu verwenden, lege unter *Settings › Secrets › Actions* die Secrets `CYBER_KEYSTORE_B64` (die .jks-Datei in Base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` und `CYBER_KEY_PASSWORD` an (ein Schlüsselwechsel erfordert die Deinstallation der alten Version: exportiere vorher deine Sicherung).

## Gut zu wissen

- Einstellungen, Verbindungen, Schlüssel und vertrauenswürdige Server werden **nur auf dem Gerät** gespeichert, ohne zusätzliche Verschlüsselung. Speichere auf einem geteilten Gerät keine Passwörter.
- Die lokale Shell unter Android gibt Zugriff auf die Befehle des Systems (`ls`, `cat`, `ping`, `top`…), nicht auf ein vollständiges Linux mit Paketverwaltung wie Termux: Dafür verbindest du dich per SSH mit einem Server (oder mit Termux selbst über `sshd`).

## Aufbau des Repositorys

| Ordner | Inhalt |
|---|---|
| `web/` | Gemeinsame Oberfläche (HTML, CSS, JavaScript) |
| `desktop/` | Windows- und Linux-Version (Electron, ssh2, node-pty) |
| `android/` | Android-Version (WebView, JSch, Pseudoterminal in C) |
| `scripts/` | Vorbereitung der Oberfläche und Build-Helfer |
| `tests/` | Echte SSH-, Lokale-Shell- und Oberflächentests (bei jedem Build ausgeführt) |
| `signing/` | Signaturschlüssel der APK |

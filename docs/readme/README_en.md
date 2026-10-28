<div align="center">

**English** · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

**SSH** terminal and **local shell** for **Android, Windows and Linux**, in the spirit of Termux, with an interface you can tune down to the last detail: themes, each of the 16 colors, font, cursor, key bar, quick commands… All three versions share the same interface and the same backup format: your settings and servers move from phone to PC in a single file.

Designed for the Galaxy Z Fold: folded, connections open in a drawer; unfolded (or on PC), they stay visible on the left.

## Download

| System | File | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 or newer |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | installer |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | no installation |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` then run it |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | extract, then run `./cyber` |

Every version is in the [*Releases*](https://github.com/apk-fold/Cyber/releases) tab, with its SHA-256 checksum. They are built automatically by GitHub Actions on every code change.

- **Android**: open `Cyber.apk`, allow installation from this source, then tap *Install*. Updates install over the previous version without losing your settings (same signing key).
- **Windows**: the files are not signed, so SmartScreen will ask for *More info → Run anyway*.

## What Cyber does

### Terminal
- [xterm.js](https://xtermjs.org) engine: 256 colors and 24-bit color, Unicode, clickable links, GPU rendering.
- Unlimited **tabs** (rename, duplicate, reconnect, copy all text), **search** through the scrollback, scrollback adjustable up to 100,000 lines.
- Copy/paste with right-click, on selection or with Ctrl+C / Ctrl+V (your choice).

### Local shell
- **Android**: the system shell (`/system/bin/sh`) in a **real pseudo-terminal** (native module), with a **startup script** you can edit in the settings (prompt, aliases, variables).
- **Windows**: PowerShell by default, or `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: your shell (`$SHELL`).
- Configurable command, arguments and starting folder.

### SSH
- Saved **profiles** (name, host, port, user, color, per-server theme) and **quick connect** with `user@host:port`.
- Password (asked every time or remembered) or **SSH key**: **Ed25519** key generation inside the app (public key copied in one tap), import of OpenSSH, PEM and PuTTY keys, passphrases.
- Server **fingerprint verification** on first connection, with a warning if it changes.
- Keep-alive, adjustable timeout, **startup command** (e.g. `tmux attach || tmux`).
- On Android, a notification keeps sessions open when the app goes to the background.

### Customization
- **12 themes**: Cyber Neon, Midnight, Tokyo Night, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Retro Amber, Paper (light).
- **Color editor**: background, text, cursor, selection and the 16 ANSI colors, with live preview; theme export and import.
- Interface accent color, padding, tabs at the top or bottom.
- Font: JetBrains Mono and Fira Code built in, or any installed font; size, line height, letter spacing, weights, minimum contrast.
- Block, underline or bar cursor, blinking or not; bell as a flash, a sound or a vibration.

### Touch keyboard
- Termux-style **key bar** (ESC, TAB, CTRL, ALT, arrows, HOME, END, PG↑/PG↓, F1–F12…) whose layout you write yourself, on 1 to 4 rows. Any other key sends its text (`|`, `~`, `:wq`…).
- "Sticky" CTRL and ALT: one tap = once, two quick taps = locked.
- **Pinch to zoom** on the terminal, vibration on key press (can be turned off).

### Quick commands
The ⚡ button sends a saved command to the active tab, with or without Enter.

### Backup
JSON export of all settings, themes, connections and trusted servers (passwords and private keys only if you ask for them), then restore on another device.

## Shortcuts (PC)

| Shortcut | Action |
|---|---|
| Ctrl+Shift+T | New local shell |
| Ctrl+Shift+N | New SSH connection |
| Ctrl+Shift+W | Close tab |
| Ctrl+Tab / Ctrl+Shift+Tab | Next / previous tab |
| Alt+1 … Alt+9 | Go to tab n |
| Ctrl+Shift+C / Ctrl+Shift+V | Copy / paste |
| Ctrl+Shift+F | Search |
| Ctrl + / Ctrl − / Ctrl 0 | Text size |
| Ctrl+, | Settings |

## Build it yourself

You need [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # runs the PC version in development mode
npm run dist:win       # Windows installer + portable version → release/
npm run dist:linux     # AppImage + tar.gz → release/ (run it on Linux)
```

For the APK (JDK 21 and the Android SDK, or Android Studio):

```sh
npm install
npm run build:web      # copies the interface into android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

The local shell's native module (`android/app/src/main/cpp`) is compiled with the NDK, which Android Studio installs when needed.

## APK signing

Every version is signed with **the same key** (`signing/cyber.jks`) so that updates install over the previous version. This key is public in the repository: only install Cyber from this repository. To use a private key, add the secrets `CYBER_KEYSTORE_B64` (the .jks file in base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` and `CYBER_KEY_PASSWORD` in *Settings › Secrets › Actions* (changing the key means uninstalling the old version: export your backup first).

## Good to know

- Settings, connections, keys and trusted servers are stored **on the device only**, with no extra encryption. Don't save passwords on a shared device.
- Android's local shell gives access to the system's commands (`ls`, `cat`, `ping`, `top`…), not to a full Linux with a package manager like Termux: for that, connect over SSH to a server (or to Termux itself with `sshd`).

## Repository layout

| Folder | Contents |
|---|---|
| `web/` | Shared interface (HTML, CSS, JavaScript) |
| `desktop/` | Windows and Linux version (Electron, ssh2, node-pty) |
| `android/` | Android version (WebView, JSch, pseudo-terminal in C) |
| `scripts/` | Interface preparation and build helpers |
| `tests/` | Real SSH, local shell and interface tests (run on every build) |
| `signing/` | APK signing key |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · **Roman Urdu** · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

**Android, Windows aur Linux** ke liye **SSH** terminal aur **local shell**, Termux ke andaaz mein, aisi interface ke saath jise aap chhoti se chhoti detail tak set kar sakte hain: themes, 16 rangon mein se har rang, font, cursor, key bar, quick commands… Teenon versions ki interface aur backup format ek jaisa hai: aap ki settings aur servers sirf ek file se phone se PC par chale jaate hain.

Galaxy Z Fold ke liye banaya gaya: band hone par connections ek drawer mein khulte hain; khula hone par (ya PC par) woh baayen taraf nazar aate rehte hain.

## Download

| System | File | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 ya naya |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | installer |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | install kiye baghair |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` phir chalayein |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | extract karein phir `./cyber` chalayein |

Tamam versions apne SHA-256 hashes ke saath [*Releases*](https://github.com/apk-fold/Cyber/releases) tab mein hain. Code mein har tabdeeli par GitHub Actions inhein khud-ba-khud build karta hai.

- **Android**: `Cyber.apk` kholein, is source se install karne ki ijazat dein, phir *Install* dabayein. Updates aap ki settings khoye baghair purane version ke upar install hote hain (wohi signing key).
- **Windows**: files signed nahin hain, is liye SmartScreen *More info → Run anyway* chunne ko kahega.

## Cyber kya karta hai

### Terminal
- [xterm.js](https://xtermjs.org) engine: 256 rang aur 24-bit rang, Unicode, click hone wale links, GPU rendering.
- Be-had **tabs** (naam badlein, duplicate karein, dobara connect karein, saara text copy karein), history mein **search**, history 100,000 lines tak set ho sakti hai.
- Right-click se, select karte hi ya Ctrl+C / Ctrl+V se copy/paste (jo aap chunein).

### Local shell
- **Android**: system shell (`/system/bin/sh`) ek **asli pseudo-terminal** (native module) mein, aur settings mein edit hone wala **startup script** (prompt, aliases, variables).
- **Windows**: default PowerShell, ya `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: aap ka shell (`$SHELL`).
- Command, arguments aur shuru wala folder set kiye ja sakte hain.

### SSH
- Saved **profiles** (naam, host, port, user, rang, har server ki apni theme) aur `user@host:port` se **quick connect**.
- Password (har baar poocha jaye ya yaad rakha jaye) ya **SSH key**: app ke andar **Ed25519** key banana (public key ek tap mein copy), OpenSSH, PEM aur PuTTY keys import karna, passphrases.
- Pehle connection par server ke **fingerprint ki tasdeeq** aur badalne par warning.
- Keep-alive, set hone wala timeout, **startup command** (maslan `tmux attach || tmux`).
- Android par, app background mein jaye to ek notification sessions ko khula rakhti hai.

### Personalization
- **12 themes**: Cyber Neon, Midnight, Tokyo Night, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Retro Amber, Paper (light).
- **Color editor**: background, text, cursor, selection aur 16 ANSI rang, live preview ke saath; themes ka export aur import.
- Interface ka accent rang, margin, tabs upar ya neeche.
- Font: JetBrains Mono aur Fira Code shamil, ya koi bhi installed font; size, line height, letter spacing, weights, kam se kam contrast.
- Block, underline ya bar cursor, blink karta hua ya nahin; bell flash, awaaz ya vibration ki soorat mein.

### Touch keyboard
- Termux style ka **key bar** (ESC, TAB, CTRL, ALT, arrows, HOME, END, PG↑/PG↓, F1–F12…) jis ka layout aap khud likhte hain, 1 se 4 rows tak. Koi bhi doosri key apna text bhejti hai (`|`, `~`, `:wq`…).
- "Sticky" CTRL aur ALT: ek tap = ek baar, do tez taps = lock.
- Terminal par **do ungliyon se zoom**, key dabane par vibration (band ki ja sakti hai).

### Quick commands
⚡ button ek saved command ko active tab mein bhejta hai, Enter ke saath ya baghair.

### Backup
Tamam settings, themes, connections aur trusted servers ka JSON export (passwords aur private keys sirf aap ke kehne par), phir doosre device par restore.

## Shortcuts (PC)

| Shortcut | Kaam |
|---|---|
| Ctrl+Shift+T | Naya local shell |
| Ctrl+Shift+N | Naya SSH connection |
| Ctrl+Shift+W | Tab band karein |
| Ctrl+Tab / Ctrl+Shift+Tab | Agla / pichla tab |
| Alt+1 … Alt+9 | Tab n par jayein |
| Ctrl+Shift+C / Ctrl+Shift+V | Copy / paste |
| Ctrl+Shift+F | Search |
| Ctrl + / Ctrl − / Ctrl 0 | Text ka size |
| Ctrl+, | Settings |

## Khud build karein

[Node.js](https://nodejs.org) 22 chahiye.

```sh
npm install
npm start              # PC version ko development mode mein chalata hai
npm run dist:win       # Windows installer + portable version → release/
npm run dist:linux     # AppImage + tar.gz → release/ (Linux par chalayein)
```

APK ke liye (JDK 21 aur Android SDK, ya Android Studio):

```sh
npm install
npm run build:web      # interface ko android/app/src/main/assets/www mein copy karta hai
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Local shell ka native module (`android/app/src/main/cpp`) NDK se compile hota hai, jise zaroorat par Android Studio install kar deta hai.

## APK signing

Tamam versions **ek hi key** (`signing/cyber.jks`) se sign kiye jaate hain taake updates purane version ke upar install ho sakein. Yeh key repository mein public hai: Cyber sirf isi repository se install karein. Private key istemal karne ke liye *Settings › Secrets › Actions* mein `CYBER_KEYSTORE_B64` (base64 mein .jks file), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` aur `CYBER_KEY_PASSWORD` secrets add karein (key badalne par purana version uninstall karna padta hai: pehle apna backup export kar lein).

## Jaan lena acha hai

- Settings, connections, keys aur trusted servers **sirf device par** save hote hain, kisi izafi encryption ke baghair. Shared device par password save na karein.
- Android ka local shell system ki commands (`ls`, `cat`, `ping`, `top`…) tak rasai deta hai, Termux jaisa package manager wala poora Linux nahin: us ke liye SSH se kisi server (ya `sshd` ke zariye khud Termux) se connect karein.

## Repository ki tarteeb

| Folder | Mawaad |
|---|---|
| `web/` | Mushtarka interface (HTML, CSS, JavaScript) |
| `desktop/` | Windows aur Linux version (Electron, ssh2, node-pty) |
| `android/` | Android version (WebView, JSch, C mein likha pseudo-terminal) |
| `scripts/` | Interface ki tayyari aur build ke madadgar scripts |
| `tests/` | Asli SSH, local shell aur interface tests (har build par chalte hain) |
| `signing/` | APK signing key |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · **Bahasa Indonesia** · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** dan **shell lokal** untuk **Android, Windows, dan Linux**, dengan semangat Termux, dengan antarmuka yang bisa diatur sampai detail terkecil: tema, masing-masing dari 16 warna, font, kursor, bilah tombol, perintah cepat… Ketiga versi memakai antarmuka yang sama dan format cadangan yang sama: pengaturan dan server kamu berpindah dari ponsel ke PC dalam satu file.

Dirancang untuk Galaxy Z Fold: saat terlipat, daftar koneksi terbuka di laci; saat terbuka (atau di PC), daftar itu tetap terlihat di sebelah kiri.

## Unduh

| Sistem | File | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 atau lebih baru |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | penginstal |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | tanpa instalasi |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` lalu jalankan |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | ekstrak lalu jalankan `./cyber` |

Semua versi ada di tab [*Releases*](https://github.com/apk-fold/Cyber/releases), lengkap dengan checksum SHA-256-nya. Semuanya dikompilasi otomatis oleh GitHub Actions setiap kali kode berubah.

- **Android**: buka `Cyber.apk`, izinkan instalasi dari sumber ini, lalu ketuk *Instal*. Pembaruan terpasang di atas versi lama tanpa kehilangan pengaturan (kunci tanda tangan yang sama).
- **Windows**: file tidak ditandatangani, jadi SmartScreen akan meminta *Info selengkapnya → Tetap jalankan*.

## Apa yang dilakukan Cyber

### Terminal
- Mesin [xterm.js](https://xtermjs.org): 256 warna dan warna 24-bit, Unicode, tautan yang bisa diklik, rendering GPU.
- **Tab** tanpa batas (ganti nama, duplikat, sambung ulang, salin semua teks), **pencarian** di riwayat, riwayat bisa diatur hingga 100.000 baris.
- Salin/tempel dengan klik kanan, saat memilih teks, atau dengan Ctrl+C / Ctrl+V (sesuai pilihan).

### Shell lokal
- **Android**: shell sistem (`/system/bin/sh`) dalam **pseudo-terminal sungguhan** (modul native), dengan **skrip awal** yang bisa diedit di pengaturan (prompt, alias, variabel).
- **Windows**: PowerShell secara default, atau `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: shell kamu (`$SHELL`).
- Perintah, argumen, dan folder awal bisa diatur.

### SSH
- **Profil** tersimpan (nama, host, port, pengguna, warna, tema khusus per server) dan **koneksi cepat** dengan `pengguna@host:port`.
- Kata sandi (ditanyakan setiap kali atau diingat) atau **kunci SSH**: pembuatan kunci **Ed25519** di dalam aplikasi (kunci publik disalin dengan sekali ketuk), impor kunci OpenSSH, PEM, dan PuTTY, frasa sandi.
- **Verifikasi sidik jari** server pada koneksi pertama dan peringatan jika berubah.
- Keep-alive, batas waktu yang bisa diatur, **perintah saat mulai** (mis. `tmux attach || tmux`).
- Di Android, sebuah notifikasi menjaga sesi tetap terbuka saat aplikasi masuk ke latar belakang.

### Personalisasi
- **12 tema**: Cyber Neon, Tengah Malam, Malam Tokyo, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matriks, Amber Retro, Kertas (terang).
- **Editor warna**: latar, teks, kursor, seleksi, dan 16 warna ANSI, dengan pratinjau langsung; ekspor dan impor tema.
- Warna aksen antarmuka, margin, tab di atas atau di bawah.
- Font: JetBrains Mono dan Fira Code bawaan, atau font apa pun yang terpasang; ukuran, tinggi baris, jarak huruf, ketebalan, kontras minimum.
- Kursor blok, garis bawah, atau batang, berkedip atau tidak; bel berupa kilatan, suara, atau getaran.

### Keyboard sentuh
- **Bilah tombol** gaya Termux (ESC, TAB, CTRL, ALT, panah, HOME, END, PG↑/PG↓, F1–F12…) yang tata letaknya kamu tulis sendiri, dalam 1 sampai 4 baris. Tombol lain mengirim teksnya sendiri (`|`, `~`, `:wq`…).
- CTRL dan ALT "lengket": sekali ketuk = sekali, dua ketukan cepat = terkunci.
- **Zoom dua jari** di terminal, getaran saat tombol ditekan (bisa dimatikan).

### Perintah cepat
Tombol ⚡ mengirim perintah tersimpan ke tab aktif, dengan atau tanpa Enter.

### Cadangan
Ekspor JSON semua pengaturan, tema, koneksi, dan server tepercaya (kata sandi dan kunci privat hanya jika kamu minta), lalu pulihkan di perangkat lain.

## Pintasan (PC)

| Pintasan | Aksi |
|---|---|
| Ctrl+Shift+T | Shell lokal baru |
| Ctrl+Shift+N | Koneksi SSH baru |
| Ctrl+Shift+W | Tutup tab |
| Ctrl+Tab / Ctrl+Shift+Tab | Tab berikutnya / sebelumnya |
| Alt+1 … Alt+9 | Ke tab n |
| Ctrl+Shift+C / Ctrl+Shift+V | Salin / tempel |
| Ctrl+Shift+F | Cari |
| Ctrl + / Ctrl − / Ctrl 0 | Ukuran teks |
| Ctrl+, | Pengaturan |

## Kompilasi sendiri

Kamu butuh [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # menjalankan versi PC dalam mode pengembangan
npm run dist:win       # penginstal + versi portabel Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (jalankan di Linux)
```

Untuk APK (JDK 21 dan Android SDK, atau Android Studio):

```sh
npm install
npm run build:web      # menyalin antarmuka ke android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Modul native shell lokal (`android/app/src/main/cpp`) dikompilasi dengan NDK, yang dipasang oleh Android Studio bila diperlukan.

## Tanda tangan APK

Semua versi ditandatangani dengan **kunci yang sama** (`signing/cyber.jks`) agar pembaruan bisa dipasang di atas versi lama. Kunci ini publik di repositori: pasang Cyber hanya dari repositori ini. Untuk memakai kunci privat, tambahkan secret `CYBER_KEYSTORE_B64` (file .jks dalam base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS`, dan `CYBER_KEY_PASSWORD` di *Settings › Secrets › Actions* (mengganti kunci berarti harus mencopot versi lama: ekspor cadanganmu dulu).

## Perlu diketahui

- Pengaturan, koneksi, kunci, dan server tepercaya disimpan **hanya di perangkat**, tanpa enkripsi tambahan. Jangan simpan kata sandi di perangkat yang dipakai bersama.
- Shell lokal Android memberi akses ke perintah sistem (`ls`, `cat`, `ping`, `top`…), bukan Linux lengkap dengan pengelola paket seperti Termux: untuk itu, sambungkan lewat SSH ke server (atau ke Termux sendiri dengan `sshd`).

## Struktur repositori

| Folder | Isi |
|---|---|
| `web/` | Antarmuka bersama (HTML, CSS, JavaScript) |
| `desktop/` | Versi Windows dan Linux (Electron, ssh2, node-pty) |
| `android/` | Versi Android (WebView, JSch, pseudo-terminal dalam C) |
| `scripts/` | Persiapan antarmuka dan alat bantu kompilasi |
| `tests/` | Tes SSH sungguhan, shell lokal, dan antarmuka (dijalankan di setiap kompilasi) |
| `signing/` | Kunci tanda tangan APK |

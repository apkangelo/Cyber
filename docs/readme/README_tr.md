<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · **Türkçe** · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

**Android, Windows ve Linux** için **SSH** terminali ve **yerel kabuk**. Termux ruhunda, en ince ayrıntısına kadar ayarlanabilen bir arayüzle: temalar, 16 rengin her biri, yazı tipi, imleç, tuş çubuğu, hızlı komutlar… Üç sürüm de aynı arayüzü ve aynı yedekleme biçimini paylaşır: ayarların ve sunucuların tek bir dosyayla telefondan bilgisayara geçer.

Galaxy Z Fold düşünülerek tasarlandı: katlıyken bağlantılar bir çekmecede açılır; açıkken (ya da bilgisayarda) solda görünür kalır.

## İndir

| Sistem | Dosya | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 veya üstü |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | yükleyici |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | kurulum gerektirmez |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` sonra çalıştır |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | arşivi aç, sonra `./cyber` çalıştır |

Tüm sürümler SHA-256 özetleriyle birlikte [*Releases*](https://github.com/apk-fold/Cyber/releases) sekmesinde. Koddaki her değişiklikte GitHub Actions tarafından otomatik olarak derlenir.

- **Android**: `Cyber.apk` dosyasını aç, bu kaynaktan yüklemeye izin ver, ardından *Yükle*'ye dokun. Güncellemeler ayarlarını kaybetmeden eski sürümün üzerine kurulur (aynı imza anahtarı).
- **Windows**: dosyalar imzalı değil; SmartScreen *Ek bilgi → Yine de çalıştır* seçmeni isteyecek.

## Cyber neler yapar

### Terminal
- [xterm.js](https://xtermjs.org) motoru: 256 renk ve 24 bit renk, Unicode, tıklanabilir bağlantılar, GPU ile çizim.
- Sınırsız **sekme** (yeniden adlandır, çoğalt, yeniden bağlan, tüm metni kopyala), geçmişte **arama**, geçmiş 100.000 satıra kadar ayarlanabilir.
- Sağ tıkla, seçimle ya da Ctrl+C / Ctrl+V ile kopyala/yapıştır (tercih senin).

### Yerel kabuk
- **Android**: sistem kabuğu (`/system/bin/sh`) **gerçek bir sözde terminalde** (yerel modül) çalışır; ayarlardan düzenlenebilen bir **başlangıç betiği** vardır (istem, takma adlar, değişkenler).
- **Windows**: varsayılan olarak PowerShell, ya da `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: senin kabuğun (`$SHELL`).
- Komut, argümanlar ve başlangıç klasörü ayarlanabilir.

### SSH
- Kayıtlı **profiller** (ad, sunucu, port, kullanıcı, renk, sunucuya özel tema) ve `kullanıcı@sunucu:port` ile **hızlı bağlantı**.
- Parola (her seferinde sorulur ya da hatırlanır) veya **SSH anahtarı**: uygulama içinde **Ed25519** anahtar üretimi (ortak anahtar tek dokunuşla kopyalanır), OpenSSH, PEM ve PuTTY anahtarlarını içe aktarma, parola cümleleri.
- İlk bağlantıda sunucu **parmak izinin doğrulanması**, değişirse uyarı.
- Bağlantıyı canlı tutma, ayarlanabilir zaman aşımı, **başlangıç komutu** (ör. `tmux attach || tmux`).
- Android'de uygulama arka plana geçtiğinde bir bildirim oturumları açık tutar.

### Kişiselleştirme
- **12 tema**: Cyber Neon, Gece Yarısı, Tokyo Gecesi, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matris, Retro Kehribar, Kâğıt (açık).
- **Renk düzenleyici**: arka plan, metin, imleç, seçim ve 16 ANSI rengi, canlı önizlemeyle; tema dışa ve içe aktarma.
- Arayüz vurgu rengi, kenar boşluğu, sekmeler üstte veya altta.
- Yazı tipi: JetBrains Mono ve Fira Code yerleşik, ya da yüklü herhangi bir yazı tipi; boyut, satır yüksekliği, harf aralığı, kalınlıklar, minimum kontrast.
- Blok, alt çizgi veya çubuk imleç, yanıp sönen ya da sabit; zil olarak flaş, ses veya titreşim.

### Dokunmatik klavye
- Termux tarzı **tuş çubuğu** (ESC, TAB, CTRL, ALT, oklar, HOME, END, PG↑/PG↓, F1–F12…); düzenini kendin yazarsın, 1 ila 4 sıra. Diğer her tuş kendi metnini gönderir (`|`, `~`, `:wq`…).
- "Yapışkan" CTRL ve ALT: bir dokunuş = bir kez, iki hızlı dokunuş = kilitli.
- Terminalde **iki parmakla yakınlaştırma**, tuşa basınca titreşim (kapatılabilir).

### Hızlı komutlar
⚡ düğmesi kayıtlı bir komutu etkin sekmeye, Enter ile ya da Enter olmadan gönderir.

### Yedekleme
Tüm ayarların, temaların, bağlantıların ve güvenilir sunucuların JSON olarak dışa aktarımı (parolalar ve özel anahtarlar yalnızca istersen), ardından başka bir cihazda geri yükleme.

## Kısayollar (PC)

| Kısayol | İşlem |
|---|---|
| Ctrl+Shift+T | Yeni yerel kabuk |
| Ctrl+Shift+N | Yeni SSH bağlantısı |
| Ctrl+Shift+W | Sekmeyi kapat |
| Ctrl+Tab / Ctrl+Shift+Tab | Sonraki / önceki sekme |
| Alt+1 … Alt+9 | n. sekmeye git |
| Ctrl+Shift+C / Ctrl+Shift+V | Kopyala / yapıştır |
| Ctrl+Shift+F | Ara |
| Ctrl + / Ctrl − / Ctrl 0 | Metin boyutu |
| Ctrl+, | Ayarlar |

## Kendin derle

[Node.js](https://nodejs.org) 22 gerekir.

```sh
npm install
npm start              # PC sürümünü geliştirme modunda başlatır
npm run dist:win       # Windows yükleyicisi + taşınabilir sürüm → release/
npm run dist:linux     # AppImage + tar.gz → release/ (Linux'ta çalıştır)
```

APK için (JDK 21 ve Android SDK ya da Android Studio):

```sh
npm install
npm run build:web      # arayüzü android/app/src/main/assets/www içine kopyalar
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Yerel kabuğun yerel modülü (`android/app/src/main/cpp`) NDK ile derlenir; Android Studio gerektiğinde NDK'yı kurar.

## APK imzası

Güncellemelerin eski sürümün üzerine kurulabilmesi için tüm sürümler **aynı anahtarla** (`signing/cyber.jks`) imzalanır. Bu anahtar depoda herkese açıktır: Cyber'ı yalnızca bu depodan yükle. Özel bir anahtar kullanmak için *Settings › Secrets › Actions* bölümüne `CYBER_KEYSTORE_B64` (base64 kodlu .jks dosyası), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` ve `CYBER_KEY_PASSWORD` gizli değerlerini ekle (anahtarı değiştirmek eski sürümü kaldırmayı gerektirir: önce yedeğini dışa aktar).

## Bilmekte fayda var

- Ayarlar, bağlantılar, anahtarlar ve güvenilir sunucular ek şifreleme olmadan **yalnızca cihazda** saklanır. Paylaşılan bir cihazda parola kaydetme.
- Android'in yerel kabuğu sistem komutlarına (`ls`, `cat`, `ping`, `top`…) erişim sağlar; Termux gibi paket yöneticili tam bir Linux değildir. Bunun için SSH ile bir sunucuya (ya da `sshd` ile Termux'un kendisine) bağlan.

## Depo düzeni

| Klasör | İçerik |
|---|---|
| `web/` | Ortak arayüz (HTML, CSS, JavaScript) |
| `desktop/` | Windows ve Linux sürümü (Electron, ssh2, node-pty) |
| `android/` | Android sürümü (WebView, JSch, C ile yazılmış sözde terminal) |
| `scripts/` | Arayüz hazırlığı ve derleme yardımcıları |
| `tests/` | Gerçek SSH, yerel kabuk ve arayüz testleri (her derlemede çalışır) |
| `signing/` | APK imza anahtarı |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · **فارسی** · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

ترمینال **SSH** و **شل محلی** برای **Android، Windows و Linux**، با حال‌وهوای Termux و رابطی که تا ریزترین جزئیات قابل تنظیم است: تم‌ها، هر یک از ۱۶ رنگ، فونت، نشانگر، نوار کلیدها، دستورهای سریع… هر سه نسخه رابط کاربری و قالب پشتیبان یکسانی دارند: تنظیمات و سرورهای شما با یک فایل از گوشی به رایانه منتقل می‌شوند.

برای Galaxy Z Fold طراحی شده است: در حالت بسته، اتصال‌ها در یک کشو باز می‌شوند؛ در حالت باز (یا روی رایانه)، همیشه در سمت چپ دیده می‌شوند.

## دانلود

| سیستم | فایل | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 یا جدیدتر |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | نصب‌کننده |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | بدون نصب |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` و سپس اجرا |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | از حالت فشرده خارج کنید و `./cyber` را اجرا کنید |

همهٔ نسخه‌ها همراه با چکیدهٔ SHA-256 در زبانهٔ [*Releases*](https://github.com/apk-fold/Cyber/releases) هستند. این نسخه‌ها با هر تغییر در کد به‌طور خودکار توسط GitHub Actions ساخته می‌شوند.

- **Android**: فایل `Cyber.apk` را باز کنید، نصب از این منبع را مجاز کنید و سپس *نصب* را بزنید. به‌روزرسانی‌ها بدون از دست رفتن تنظیمات روی نسخهٔ قبلی نصب می‌شوند (همان کلید امضا).
- **Windows**: فایل‌ها امضا نشده‌اند، پس SmartScreen از شما می‌خواهد *اطلاعات بیشتر ← در هر صورت اجرا شود* را انتخاب کنید.

## Cyber چه کار می‌کند

### ترمینال
- موتور [xterm.js](https://xtermjs.org): ‏۲۵۶ رنگ و رنگ ۲۴ بیتی، Unicode، پیوندهای قابل کلیک، رندر با GPU.
- **زبانه‌های** نامحدود (تغییر نام، تکثیر، اتصال دوباره، کپی کل متن)، **جست‌وجو** در تاریخچه، تاریخچهٔ قابل تنظیم تا ۱۰۰٬۰۰۰ خط.
- کپی و چسباندن با کلیک راست، هنگام انتخاب یا با Ctrl+C / Ctrl+V (به انتخاب شما).

### شل محلی
- **Android**: شل سیستم (`/system/bin/sh`) در یک **ترمینال مجازی واقعی** (ماژول بومی)، با یک **اسکریپت آغازین** که در تنظیمات ویرایش می‌شود (اعلان، نام‌های مستعار، متغیرها).
- **Windows**: به‌طور پیش‌فرض PowerShell، یا `cmd.exe`، `pwsh`، `wsl.exe`…
- **Linux**: شل خودتان (`$SHELL`).
- دستور، آرگومان‌ها و پوشهٔ شروع قابل تنظیم‌اند.

### SSH
- **پروفایل‌های** ذخیره‌شده (نام، میزبان، درگاه، کاربر، رنگ، تم مخصوص هر سرور) و **اتصال سریع** با `کاربر@میزبان:درگاه`.
- گذرواژه (هر بار پرسیده یا ذخیره می‌شود) یا **کلید SSH**: ساخت کلید **Ed25519** در خود برنامه (کپی کلید عمومی با یک لمس)، وارد کردن کلیدهای OpenSSH، PEM و PuTTY، عبارت‌های عبور.
- **بررسی اثر انگشت** سرور در نخستین اتصال و هشدار در صورت تغییر آن.
- زنده نگه داشتن اتصال، مهلت زمانی قابل تنظیم، **دستور آغازین** (مثلاً `tmux attach || tmux`).
- در Android، وقتی برنامه به پس‌زمینه می‌رود، یک اعلان نشست‌ها را باز نگه می‌دارد.

### شخصی‌سازی
- **۱۲ تم**: نئون Cyber، نیمه‌شب، شب توکیو، Dracula، Nord، One Dark، Gruvbox، Monokai، Solarized، ماتریکس، کهربایی قدیمی، کاغذی (روشن).
- **ویرایشگر رنگ**: پس‌زمینه، متن، نشانگر، ناحیهٔ انتخاب و ۱۶ رنگ ANSI، با پیش‌نمایش زنده؛ برون‌بری و درون‌بری تم‌ها.
- رنگ تأکید رابط، فاصلهٔ حاشیه، زبانه‌ها در بالا یا پایین.
- فونت: ‏JetBrains Mono و Fira Code داخلی، یا هر فونت نصب‌شده؛ اندازه، فاصلهٔ خطوط، فاصلهٔ حروف، وزن‌ها، حداقل کنتراست.
- نشانگر بلوکی، زیرخط یا میله‌ای، چشمک‌زن یا ثابت؛ زنگ به‌صورت فلش، صدا یا لرزش.

### صفحه‌کلید لمسی
- **نوار کلیدها** به سبک Termux (ESC، TAB، CTRL، ALT، پیکان‌ها، HOME، END، PG↑/PG↓، F1–F12…) که چیدمانش را خودتان می‌نویسید، در ۱ تا ۴ ردیف. هر کلید دیگری متن خودش را می‌فرستد (`|`، `~`، `:wq`…).
- ‏CTRL و ALT «چسبان»: یک لمس = یک بار، دو لمس سریع = قفل.
- **بزرگ‌نمایی با دو انگشت** در ترمینال، لرزش هنگام فشردن کلید (قابل خاموش کردن).

### دستورهای سریع
دکمهٔ ⚡ یک دستور ذخیره‌شده را با Enter یا بدون آن به زبانهٔ فعال می‌فرستد.

### پشتیبان‌گیری
برون‌بری همهٔ تنظیمات، تم‌ها، اتصال‌ها و سرورهای مورد اعتماد به JSON (گذرواژه‌ها و کلیدهای خصوصی فقط اگر خودتان بخواهید) و بازیابی روی دستگاهی دیگر.

## میان‌برها (رایانه)

| میان‌بر | عمل |
|---|---|
| Ctrl+Shift+T | شل محلی جدید |
| Ctrl+Shift+N | اتصال SSH جدید |
| Ctrl+Shift+W | بستن زبانه |
| Ctrl+Tab / Ctrl+Shift+Tab | زبانهٔ بعدی / قبلی |
| Alt+1 … Alt+9 | رفتن به زبانهٔ n |
| Ctrl+Shift+C / Ctrl+Shift+V | کپی / چسباندن |
| Ctrl+Shift+F | جست‌وجو |
| Ctrl + / Ctrl − / Ctrl 0 | اندازهٔ متن |
| Ctrl+, | تنظیمات |

## ساختن توسط خودتان

به [Node.js](https://nodejs.org) 22 نیاز دارید.

```sh
npm install
npm start              # نسخهٔ رایانه را در حالت توسعه اجرا می‌کند
npm run dist:win       # نصب‌کننده + نسخهٔ قابل حمل Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (روی Linux اجرا شود)
```

برای APK ‏(JDK 21 و Android SDK، یا Android Studio):

```sh
npm install
npm run build:web      # رابط را در android/app/src/main/assets/www کپی می‌کند
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

ماژول بومی شل محلی (`android/app/src/main/cpp`) با NDK کامپایل می‌شود که Android Studio در صورت نیاز نصبش می‌کند.

## امضای APK

همهٔ نسخه‌ها با **یک کلید واحد** (`signing/cyber.jks`) امضا شده‌اند تا به‌روزرسانی‌ها روی نسخهٔ قبلی نصب شوند. این کلید در مخزن عمومی است: Cyber را فقط از همین مخزن نصب کنید. برای استفاده از کلید خصوصی، رازهای `CYBER_KEYSTORE_B64` (فایل .jks به‌صورت base64)، `CYBER_KEYSTORE_PASSWORD`، `CYBER_KEY_ALIAS` و `CYBER_KEY_PASSWORD` را در *Settings › Secrets › Actions* اضافه کنید (تغییر کلید مستلزم حذف نسخهٔ قدیمی است: ابتدا از داده‌هایتان پشتیبان بگیرید).

## خوب است بدانید

- تنظیمات، اتصال‌ها، کلیدها و سرورهای مورد اعتماد **فقط روی دستگاه** و بدون رمزنگاری اضافه ذخیره می‌شوند. روی دستگاه مشترک گذرواژه ذخیره نکنید.
- شل محلی Android به دستورهای سیستم (`ls`، `cat`، `ping`، `top`…) دسترسی می‌دهد، نه به یک Linux کامل با مدیر بسته مثل Termux: برای آن، با SSH به یک سرور (یا با `sshd` به خود Termux) وصل شوید.

## ساختار مخزن

| پوشه | محتوا |
|---|---|
| `web/` | رابط مشترک (HTML، CSS، JavaScript) |
| `desktop/` | نسخهٔ Windows و Linux (Electron، ssh2، node-pty) |
| `android/` | نسخهٔ Android (WebView، JSch، ترمینال مجازی به زبان C) |
| `scripts/` | آماده‌سازی رابط و ابزارهای کمکی ساخت |
| `tests/` | آزمون‌های واقعی SSH، شل محلی و رابط (در هر ساخت اجرا می‌شوند) |
| `signing/` | کلید امضای APK |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · **العربية** · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

طرفية **SSH** و**صدفة محلية** لأنظمة **Android وWindows وLinux**، على نهج Termux، بواجهة يمكن ضبطها حتى أدق التفاصيل: السمات، وكل لون من الألوان الستة عشر، والخط، والمؤشر، وشريط المفاتيح، والأوامر السريعة… تتشارك الإصدارات الثلاثة الواجهة نفسها وصيغة النسخ الاحتياطي نفسها: تنتقل إعداداتك وخوادمك من الهاتف إلى الحاسوب في ملف واحد.

مصمّم لهاتف Galaxy Z Fold: عند طيّه تُفتح الاتصالات في درج جانبي، وعند فتحه (أو على الحاسوب) تبقى ظاهرة على اليسار.

## التنزيل

| النظام | الملف | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 أو أحدث |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | برنامج تثبيت |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | دون تثبيت |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` ثم التشغيل |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | فك الضغط ثم تشغيل `./cyber` |

جميع الإصدارات موجودة في تبويب [*Releases*](https://github.com/apk-fold/Cyber/releases) مع بصمات SHA-256 الخاصة بها، وتُبنى تلقائيًا عبر GitHub Actions عند كل تعديل على الشيفرة.

- **Android**: افتح `Cyber.apk`، واسمح بالتثبيت من هذا المصدر، ثم اضغط *تثبيت*. تُثبَّت التحديثات فوق الإصدار السابق دون فقدان إعداداتك (مفتاح التوقيع نفسه).
- **Windows**: الملفات غير موقّعة، لذا سيطلب SmartScreen اختيار *مزيد من المعلومات ← التشغيل على أي حال*.

## ما الذي يفعله Cyber

### الطرفية
- محرك [xterm.js](https://xtermjs.org): ‏256 لونًا وألوان 24 بت، وUnicode، وروابط قابلة للنقر، وعرض عبر GPU.
- **ألسنة تبويب** غير محدودة (إعادة التسمية، النسخ، إعادة الاتصال، نسخ كل النص)، و**بحث** في السجل، مع سجل قابل للضبط حتى 100,000 سطر.
- النسخ واللصق بالنقر الأيمن، أو عند التحديد، أو باستخدام Ctrl+C / Ctrl+V (حسب اختيارك).

### الصدفة المحلية
- **Android**: صدفة النظام (`/system/bin/sh`) داخل **طرفية زائفة حقيقية** (وحدة أصلية)، مع **نص بدء تشغيل** قابل للتعديل من الإعدادات (المحثّ، الأسماء المستعارة، المتغيرات).
- **Windows**: ‏PowerShell افتراضيًا، أو `cmd.exe` و`pwsh` و`wsl.exe`…
- **Linux**: صدفتك (`$SHELL`).
- يمكن ضبط الأمر والوسائط ومجلد البدء.

### SSH
- **ملفات تعريف** محفوظة (الاسم، المضيف، المنفذ، المستخدم، اللون، سمة خاصة بكل خادم) و**اتصال سريع** عبر `المستخدم@المضيف:المنفذ`.
- كلمة مرور (تُطلب كل مرة أو تُحفظ) أو **مفتاح SSH**: توليد مفاتيح **Ed25519** داخل التطبيق (نسخ المفتاح العام بلمسة واحدة)، واستيراد مفاتيح OpenSSH وPEM وPuTTY، ودعم عبارات المرور.
- **التحقق من بصمة** الخادم عند أول اتصال، وتنبيه إذا تغيّرت.
- إبقاء الاتصال حيًا، ومهلة قابلة للضبط، و**أمر عند البدء** (مثل `tmux attach || tmux`).
- على Android، يُبقي إشعارٌ الجلساتِ مفتوحة عندما ينتقل التطبيق إلى الخلفية.

### التخصيص
- **12 سمة**: Cyber نيون، منتصف الليل، ليل طوكيو، Dracula، Nord، One Dark، Gruvbox، Monokai، Solarized، ماتريكس، كهرماني كلاسيكي، ورق (فاتحة).
- **محرر الألوان**: الخلفية والنص والمؤشر والتحديد والألوان الستة عشر لـ ANSI، مع معاينة مباشرة؛ وتصدير السمات واستيرادها.
- لون التمييز في الواجهة، والهوامش، وألسنة التبويب في الأعلى أو الأسفل.
- الخط: ‏JetBrains Mono وFira Code مضمّنان، أو أي خط مثبّت؛ الحجم، وتباعد الأسطر، وتباعد الأحرف، والأوزان، والحد الأدنى للتباين.
- مؤشر كتلة أو خط سفلي أو عمودي، وامض أو ثابت؛ والجرس كوميض أو صوت أو اهتزاز.

### لوحة المفاتيح اللمسية
- **شريط مفاتيح** على طريقة Termux (ESC، TAB، CTRL، ALT، الأسهم، HOME، END، PG↑/PG↓، F1–F12…) تكتب تخطيطه بنفسك، على صف واحد حتى 4 صفوف. أي مفتاح آخر يرسل نصّه (`|`، `~`، `:wq`…).
- مفتاحا CTRL وALT «لاصقان»: ضغطة واحدة = مرة واحدة، ضغطتان سريعتان = قفل.
- **التكبير بإصبعين** في الطرفية، واهتزاز عند الضغط (يمكن إيقافه).

### الأوامر السريعة
يرسل الزر ⚡ أمرًا محفوظًا إلى التبويب النشط، مع Enter أو بدونه.

### النسخ الاحتياطي
تصدير كل الإعدادات والسمات والاتصالات والخوادم الموثوقة بصيغة JSON (كلمات المرور والمفاتيح الخاصة فقط إذا طلبت ذلك)، ثم الاستعادة على جهاز آخر.

## الاختصارات (الحاسوب)

| الاختصار | الإجراء |
|---|---|
| Ctrl+Shift+T | صدفة محلية جديدة |
| Ctrl+Shift+N | اتصال SSH جديد |
| Ctrl+Shift+W | إغلاق التبويب |
| Ctrl+Tab / Ctrl+Shift+Tab | التبويب التالي / السابق |
| Alt+1 … Alt+9 | الانتقال إلى التبويب n |
| Ctrl+Shift+C / Ctrl+Shift+V | نسخ / لصق |
| Ctrl+Shift+F | بحث |
| Ctrl + / Ctrl − / Ctrl 0 | حجم النص |
| Ctrl+, | الإعدادات |

## البناء بنفسك

تحتاج إلى [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # يشغّل إصدار الحاسوب في وضع التطوير
npm run dist:win       # برنامج تثبيت + إصدار محمول لـ Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (يُشغَّل على Linux)
```

لملف APK (‏JDK 21 وAndroid SDK، أو Android Studio):

```sh
npm install
npm run build:web      # ينسخ الواجهة إلى android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

تُترجَم الوحدة الأصلية للصدفة المحلية (`android/app/src/main/cpp`) باستخدام NDK، ويثبّته Android Studio عند الحاجة.

## توقيع APK

جميع الإصدارات موقّعة **بالمفتاح نفسه** (`signing/cyber.jks`) كي تُثبَّت التحديثات فوق الإصدار السابق. هذا المفتاح علني في المستودع: لا تثبّت Cyber إلا من هذا المستودع. لاستخدام مفتاح خاص، أضف الأسرار `CYBER_KEYSTORE_B64` (ملف .jks بترميز base64) و`CYBER_KEYSTORE_PASSWORD` و`CYBER_KEY_ALIAS` و`CYBER_KEY_PASSWORD` في *Settings › Secrets › Actions* (تغيير المفتاح يستلزم إلغاء تثبيت الإصدار القديم: صدّر نسختك الاحتياطية أولًا).

## من المفيد معرفته

- تُخزَّن الإعدادات والاتصالات والمفاتيح والخوادم الموثوقة **على الجهاز فقط**، دون تشفير إضافي. لا تحفظ كلمات المرور على جهاز مشترك.
- تتيح الصدفة المحلية في Android الوصول إلى أوامر النظام (`ls`، `cat`، `ping`، `top`…)، لا إلى Linux كامل مع مدير حزم مثل Termux: لذلك اتصل عبر SSH بخادم (أو بـ Termux نفسه باستخدام `sshd`).

## تنظيم المستودع

| المجلد | المحتوى |
|---|---|
| `web/` | الواجهة المشتركة (HTML، CSS، JavaScript) |
| `desktop/` | إصدار Windows وLinux (Electron، ssh2، node-pty) |
| `android/` | إصدار Android (WebView، JSch، طرفية زائفة مكتوبة بلغة C) |
| `scripts/` | تجهيز الواجهة وأدوات مساعدة للبناء |
| `tests/` | اختبارات SSH حقيقية والصدفة المحلية والواجهة (تُشغَّل مع كل بناء) |
| `signing/` | مفتاح توقيع APK |

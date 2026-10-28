<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · **ไทย** · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

เทอร์มินัล **SSH** และ **เชลล์ภายในเครื่อง** สำหรับ **Android, Windows และ Linux** ในแนวทางเดียวกับ Termux พร้อมอินเทอร์เฟซที่ปรับแต่งได้ทุกรายละเอียด: ธีม, สีแต่ละสีจากทั้งหมด 16 สี, ฟอนต์, เคอร์เซอร์, แถบปุ่ม, คำสั่งด่วน… ทั้งสามเวอร์ชันใช้อินเทอร์เฟซเดียวกันและรูปแบบการสำรองข้อมูลเดียวกัน: การตั้งค่าและเซิร์ฟเวอร์ของคุณย้ายจากโทรศัพท์ไปยังพีซีได้ด้วยไฟล์เดียว

ออกแบบมาสำหรับ Galaxy Z Fold: เมื่อพับ รายการการเชื่อมต่อจะเปิดในลิ้นชัก เมื่อกางออก (หรือบนพีซี) รายการจะแสดงอยู่ทางซ้ายตลอด

## ดาวน์โหลด

| ระบบ | ไฟล์ | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 ขึ้นไป |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | ตัวติดตั้ง |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | ไม่ต้องติดตั้ง |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` แล้วเปิดใช้งาน |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | แตกไฟล์แล้วรัน `./cyber` |

ทุกเวอร์ชันอยู่ในแท็บ [*Releases*](https://github.com/apk-fold/Cyber/releases) พร้อมค่าแฮช SHA-256 และถูกคอมไพล์อัตโนมัติด้วย GitHub Actions ทุกครั้งที่โค้ดมีการเปลี่ยนแปลง

- **Android**: เปิด `Cyber.apk` อนุญาตการติดตั้งจากแหล่งนี้ แล้วแตะ *ติดตั้ง* การอัปเดตจะติดตั้งทับเวอร์ชันเดิมได้โดยไม่สูญเสียการตั้งค่า (ใช้คีย์ลงนามเดียวกัน)
- **Windows**: ไฟล์ไม่ได้ลงนาม SmartScreen จะให้เลือก *ข้อมูลเพิ่มเติม → เรียกใช้ต่อไป*

## Cyber ทำอะไรได้บ้าง

### เทอร์มินัล
- เอนจิน [xterm.js](https://xtermjs.org): 256 สีและสี 24 บิต, Unicode, ลิงก์ที่คลิกได้, เรนเดอร์ด้วย GPU
- **แท็บ** ไม่จำกัด (เปลี่ยนชื่อ, ทำสำเนา, เชื่อมต่อใหม่, คัดลอกข้อความทั้งหมด), **ค้นหา** ในประวัติการเลื่อน, ตั้งประวัติได้สูงสุด 100,000 บรรทัด
- คัดลอก/วางด้วยคลิกขวา, เมื่อเลือกข้อความ หรือด้วย Ctrl+C / Ctrl+V (เลือกได้)

### เชลล์ภายในเครื่อง
- **Android**: เชลล์ของระบบ (`/system/bin/sh`) ทำงานใน **pseudo-terminal จริง** (โมดูลเนทีฟ) พร้อม **สคริปต์เริ่มต้น** ที่แก้ไขได้ในการตั้งค่า (พรอมต์, alias, ตัวแปร)
- **Windows**: ค่าเริ่มต้นคือ PowerShell หรือใช้ `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: เชลล์ของคุณ (`$SHELL`)
- ตั้งค่าคำสั่ง อาร์กิวเมนต์ และโฟลเดอร์เริ่มต้นได้

### SSH
- **โปรไฟล์** ที่บันทึกไว้ (ชื่อ, โฮสต์, พอร์ต, ผู้ใช้, สี, ธีมเฉพาะของแต่ละเซิร์ฟเวอร์) และ **เชื่อมต่อด่วน** ด้วย `ผู้ใช้@โฮสต์:พอร์ต`
- รหัสผ่าน (ถามทุกครั้งหรือจดจำไว้) หรือ **คีย์ SSH**: สร้างคีย์ **Ed25519** ในแอป (คัดลอกคีย์สาธารณะได้ในแตะเดียว), นำเข้าคีย์ OpenSSH, PEM และ PuTTY, รองรับ passphrase
- **ตรวจสอบลายนิ้วมือ** ของเซิร์ฟเวอร์ในการเชื่อมต่อครั้งแรก และแจ้งเตือนหากเปลี่ยนไป
- รักษาการเชื่อมต่อ, ตั้งค่าเวลาหมดได้, **คำสั่งตอนเริ่มต้น** (เช่น `tmux attach || tmux`)
- บน Android จะมีการแจ้งเตือนที่ทำให้เซสชันยังเปิดอยู่เมื่อแอปทำงานเบื้องหลัง

### การปรับแต่ง
- **12 ธีม**: Cyber Neon, เที่ยงคืน, ราตรีโตเกียว, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, เมทริกซ์, อำพันย้อนยุค, กระดาษ (สว่าง)
- **ตัวแก้ไขสี**: พื้นหลัง, ข้อความ, เคอร์เซอร์, ส่วนที่เลือก และสี ANSI ทั้ง 16 สี พร้อมพรีวิวสด; ส่งออกและนำเข้าธีมได้
- สีเน้นของอินเทอร์เฟซ, ระยะขอบ, แท็บอยู่ด้านบนหรือด้านล่าง
- ฟอนต์: มี JetBrains Mono และ Fira Code ในตัว หรือฟอนต์ใดก็ได้ที่ติดตั้งไว้; ขนาด, ระยะบรรทัด, ระยะตัวอักษร, น้ำหนักตัวอักษร, คอนทราสต์ขั้นต่ำ
- เคอร์เซอร์แบบบล็อก ขีดล่าง หรือแท่ง กะพริบหรือไม่ก็ได้; เสียงกริ่งแบบแฟลช เสียง หรือการสั่น

### คีย์บอร์ดแบบสัมผัส
- **แถบปุ่ม** สไตล์ Termux (ESC, TAB, CTRL, ALT, ลูกศร, HOME, END, PG↑/PG↓, F1–F12…) ที่คุณเขียนเลย์เอาต์เองได้ 1 ถึง 4 แถว ปุ่มอื่น ๆ จะส่งข้อความของมันเอง (`|`, `~`, `:wq`…)
- CTRL และ ALT แบบ "ติดค้าง": แตะครั้งเดียว = ใช้ครั้งเดียว, แตะเร็วสองครั้ง = ล็อก
- **ซูมด้วยสองนิ้ว** บนเทอร์มินัล, สั่นเมื่อกดปุ่ม (ปิดได้)

### คำสั่งด่วน
ปุ่ม ⚡ จะส่งคำสั่งที่บันทึกไว้ไปยังแท็บที่ใช้งานอยู่ จะกด Enter ด้วยหรือไม่ก็ได้

### การสำรองข้อมูล
ส่งออกการตั้งค่า ธีม การเชื่อมต่อ และเซิร์ฟเวอร์ที่เชื่อถือทั้งหมดเป็น JSON (รหัสผ่านและคีย์ส่วนตัวจะรวมไปด้วยเฉพาะเมื่อคุณขอ) แล้วกู้คืนบนอุปกรณ์อื่น

## ปุ่มลัด (พีซี)

| ปุ่มลัด | การทำงาน |
|---|---|
| Ctrl+Shift+T | เชลล์ภายในเครื่องใหม่ |
| Ctrl+Shift+N | การเชื่อมต่อ SSH ใหม่ |
| Ctrl+Shift+W | ปิดแท็บ |
| Ctrl+Tab / Ctrl+Shift+Tab | แท็บถัดไป / ก่อนหน้า |
| Alt+1 … Alt+9 | ไปยังแท็บที่ n |
| Ctrl+Shift+C / Ctrl+Shift+V | คัดลอก / วาง |
| Ctrl+Shift+F | ค้นหา |
| Ctrl + / Ctrl − / Ctrl 0 | ขนาดข้อความ |
| Ctrl+, | การตั้งค่า |

## คอมไพล์เอง

ต้องใช้ [Node.js](https://nodejs.org) 22

```sh
npm install
npm start              # เปิดเวอร์ชันพีซีในโหมดพัฒนา
npm run dist:win       # ตัวติดตั้ง + เวอร์ชันพกพาสำหรับ Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (รันบน Linux)
```

สำหรับ APK (JDK 21 และ Android SDK หรือ Android Studio):

```sh
npm install
npm run build:web      # คัดลอกอินเทอร์เฟซไปที่ android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

โมดูลเนทีฟของเชลล์ภายในเครื่อง (`android/app/src/main/cpp`) คอมไพล์ด้วย NDK ซึ่ง Android Studio จะติดตั้งให้เมื่อจำเป็น

## การลงนาม APK

ทุกเวอร์ชันลงนามด้วย **คีย์เดียวกัน** (`signing/cyber.jks`) เพื่อให้อัปเดตติดตั้งทับได้ คีย์นี้เปิดเผยอยู่ในรีโพซิทอรี: ติดตั้ง Cyber จากรีโพซิทอรีนี้เท่านั้น หากต้องการใช้คีย์ส่วนตัว ให้เพิ่ม secret `CYBER_KEYSTORE_B64` (ไฟล์ .jks ในรูปแบบ base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` และ `CYBER_KEY_PASSWORD` ใน *Settings › Secrets › Actions* (การเปลี่ยนคีย์ต้องถอนการติดตั้งเวอร์ชันเก่า: ส่งออกข้อมูลสำรองก่อน)

## ควรรู้

- การตั้งค่า การเชื่อมต่อ คีย์ และเซิร์ฟเวอร์ที่เชื่อถือ ถูกเก็บไว้ **บนอุปกรณ์เท่านั้น** โดยไม่มีการเข้ารหัสเพิ่มเติม อย่าบันทึกรหัสผ่านบนอุปกรณ์ที่ใช้ร่วมกัน
- เชลล์ภายในเครื่องของ Android ให้ใช้คำสั่งของระบบได้ (`ls`, `cat`, `ping`, `top`…) แต่ไม่ใช่ Linux เต็มรูปแบบที่มีตัวจัดการแพ็กเกจแบบ Termux: หากต้องการแบบนั้น ให้เชื่อมต่อ SSH ไปยังเซิร์ฟเวอร์ (หรือไปยัง Termux เองด้วย `sshd`)

## โครงสร้างรีโพซิทอรี

| โฟลเดอร์ | เนื้อหา |
|---|---|
| `web/` | อินเทอร์เฟซที่ใช้ร่วมกัน (HTML, CSS, JavaScript) |
| `desktop/` | เวอร์ชัน Windows และ Linux (Electron, ssh2, node-pty) |
| `android/` | เวอร์ชัน Android (WebView, JSch, pseudo-terminal ที่เขียนด้วย C) |
| `scripts/` | การเตรียมอินเทอร์เฟซและตัวช่วยคอมไพล์ |
| `tests/` | การทดสอบ SSH จริง เชลล์ภายในเครื่อง และอินเทอร์เฟซ (รันทุกครั้งที่คอมไพล์) |
| `signing/` | คีย์ลงนาม APK |

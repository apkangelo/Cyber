<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · **Tiếng Việt** · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** và **shell cục bộ** cho **Android, Windows và Linux**, theo tinh thần của Termux, với giao diện có thể tinh chỉnh đến từng chi tiết: giao diện màu, từng màu trong 16 màu, phông chữ, con trỏ, thanh phím, lệnh nhanh… Ba phiên bản dùng chung một giao diện và một định dạng sao lưu: cài đặt và máy chủ của bạn chuyển từ điện thoại sang máy tính chỉ bằng một tệp.

Được thiết kế cho Galaxy Z Fold: khi gập, danh sách kết nối mở trong một ngăn kéo; khi mở ra (hoặc trên máy tính), danh sách luôn hiển thị ở bên trái.

## Tải về

| Hệ điều hành | Tệp | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 trở lên |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | trình cài đặt |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | không cần cài đặt |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` rồi chạy |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | giải nén rồi chạy `./cyber` |

Mọi phiên bản đều nằm trong thẻ [*Releases*](https://github.com/apk-fold/Cyber/releases), kèm mã băm SHA-256. Chúng được GitHub Actions tự động biên dịch mỗi khi mã nguồn thay đổi.

- **Android**: mở `Cyber.apk`, cho phép cài đặt từ nguồn này, rồi nhấn *Cài đặt*. Bản cập nhật được cài đè lên mà không mất cài đặt của bạn (cùng khóa ký).
- **Windows**: các tệp không được ký, SmartScreen sẽ yêu cầu chọn *Thông tin thêm → Vẫn chạy*.

## Cyber làm được gì

### Terminal
- Bộ máy [xterm.js](https://xtermjs.org): 256 màu và màu 24 bit, Unicode, liên kết bấm được, kết xuất bằng GPU.
- **Thẻ** không giới hạn (đổi tên, nhân bản, kết nối lại, sao chép toàn bộ văn bản), **tìm kiếm** trong lịch sử cuộn, lịch sử cuộn tùy chỉnh đến 100.000 dòng.
- Sao chép/dán bằng chuột phải, khi chọn văn bản hoặc bằng Ctrl+C / Ctrl+V (tùy bạn chọn).

### Shell cục bộ
- **Android**: shell của hệ thống (`/system/bin/sh`) chạy trong một **pseudo-terminal thực sự** (mô-đun native), với **script khởi động** chỉnh sửa được trong phần cài đặt (dấu nhắc, alias, biến).
- **Windows**: mặc định là PowerShell, hoặc `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: shell của bạn (`$SHELL`).
- Lệnh, tham số và thư mục bắt đầu đều có thể tùy chỉnh.

### SSH
- **Hồ sơ** đã lưu (tên, máy chủ, cổng, người dùng, màu, giao diện riêng cho từng máy chủ) và **kết nối nhanh** `người_dùng@máy_chủ:cổng`.
- Mật khẩu (hỏi mỗi lần hoặc ghi nhớ) hoặc **khóa SSH**: tạo khóa **Ed25519** ngay trong ứng dụng (sao chép khóa công khai chỉ với một chạm), nhập khóa OpenSSH, PEM và PuTTY, hỗ trợ cụm mật khẩu.
- **Xác minh dấu vân tay** của máy chủ ở lần kết nối đầu tiên và cảnh báo nếu nó thay đổi.
- Giữ kết nối, thời gian chờ tùy chỉnh, **lệnh khi khởi động** (ví dụ `tmux attach || tmux`).
- Trên Android, một thông báo giữ các phiên luôn mở khi ứng dụng chạy nền.

### Cá nhân hóa
- **12 giao diện**: Cyber Neon, Nửa đêm, Đêm Tokyo, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Ma trận, Hổ phách cổ điển, Giấy (sáng).
- **Trình chỉnh màu**: nền, chữ, con trỏ, vùng chọn và 16 màu ANSI, xem trước trực tiếp; xuất và nhập giao diện.
- Màu nhấn của giao diện, lề, thẻ ở trên hoặc ở dưới.
- Phông chữ: tích hợp sẵn JetBrains Mono và Fira Code, hoặc bất kỳ phông nào đã cài; cỡ chữ, chiều cao dòng, khoảng cách chữ, độ đậm, độ tương phản tối thiểu.
- Con trỏ dạng khối, gạch dưới hoặc thanh dọc, nhấp nháy hoặc không; chuông dạng nháy sáng, âm thanh hoặc rung.

### Bàn phím cảm ứng
- **Thanh phím** kiểu Termux (ESC, TAB, CTRL, ALT, phím mũi tên, HOME, END, PG↑/PG↓, F1–F12…) với bố cục do bạn tự viết, từ 1 đến 4 hàng. Mọi phím khác sẽ gửi văn bản của nó (`|`, `~`, `:wq`…).
- CTRL và ALT "dính": chạm một lần = dùng một lần, chạm nhanh hai lần = khóa lại.
- **Thu phóng bằng hai ngón** trên terminal, rung khi nhấn phím (có thể tắt).

### Lệnh nhanh
Nút ⚡ gửi một lệnh đã lưu vào thẻ đang mở, có hoặc không kèm Enter.

### Sao lưu
Xuất ra JSON toàn bộ cài đặt, giao diện, kết nối và máy chủ tin cậy (mật khẩu và khóa riêng chỉ khi bạn yêu cầu), rồi khôi phục trên thiết bị khác.

## Phím tắt (máy tính)

| Phím tắt | Thao tác |
|---|---|
| Ctrl+Shift+T | Shell cục bộ mới |
| Ctrl+Shift+N | Kết nối SSH mới |
| Ctrl+Shift+W | Đóng thẻ |
| Ctrl+Tab / Ctrl+Shift+Tab | Thẻ tiếp theo / trước đó |
| Alt+1 … Alt+9 | Đến thẻ thứ n |
| Ctrl+Shift+C / Ctrl+Shift+V | Sao chép / dán |
| Ctrl+Shift+F | Tìm kiếm |
| Ctrl + / Ctrl − / Ctrl 0 | Cỡ chữ |
| Ctrl+, | Cài đặt |

## Tự biên dịch

Cần có [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # chạy phiên bản máy tính ở chế độ phát triển
npm run dist:win       # trình cài đặt + bản portable cho Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (chạy trên Linux)
```

Với APK (JDK 21 và Android SDK, hoặc Android Studio):

```sh
npm install
npm run build:web      # sao chép giao diện vào android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Mô-đun native của shell cục bộ (`android/app/src/main/cpp`) được biên dịch bằng NDK, Android Studio sẽ cài NDK khi cần.

## Ký APK

Mọi phiên bản đều được ký bằng **cùng một khóa** (`signing/cyber.jks`) để bản cập nhật cài đè lên được. Khóa này công khai trong kho mã: chỉ cài Cyber từ kho này. Để dùng khóa riêng, hãy thêm các secret `CYBER_KEYSTORE_B64` (tệp .jks dạng base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` và `CYBER_KEY_PASSWORD` trong *Settings › Secrets › Actions* (đổi khóa buộc phải gỡ bản cũ: hãy xuất bản sao lưu trước).

## Cần biết

- Cài đặt, kết nối, khóa và máy chủ tin cậy **chỉ được lưu trên thiết bị**, không có mã hóa bổ sung. Đừng lưu mật khẩu trên thiết bị dùng chung.
- Shell cục bộ trên Android cho phép dùng các lệnh của hệ thống (`ls`, `cat`, `ping`, `top`…), không phải một Linux đầy đủ có trình quản lý gói như Termux: nếu cần, hãy kết nối SSH tới một máy chủ (hoặc tới chính Termux bằng `sshd`).

## Cấu trúc kho mã

| Thư mục | Nội dung |
|---|---|
| `web/` | Giao diện dùng chung (HTML, CSS, JavaScript) |
| `desktop/` | Phiên bản Windows và Linux (Electron, ssh2, node-pty) |
| `android/` | Phiên bản Android (WebView, JSch, pseudo-terminal viết bằng C) |
| `scripts/` | Chuẩn bị giao diện và công cụ hỗ trợ biên dịch |
| `tests/` | Kiểm thử SSH thật, shell cục bộ và giao diện (chạy ở mỗi lần biên dịch) |
| `signing/` | Khóa ký APK |

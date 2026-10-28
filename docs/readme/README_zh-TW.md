<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · **繁體中文** · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

適用於 **Android、Windows 和 Linux** 的 **SSH** 終端機與**本機 shell**，延續 Termux 的精神，介面的每個細節都能調整：主題、16 種顏色中的每一種、字型、游標、按鍵列、快速指令…… 三個版本共用同一套介面和同一種備份格式：你的設定和伺服器只要一個檔案就能從手機搬到電腦。

專為 Galaxy Z Fold 設計：摺疊時，連線清單在抽屜中開啟；展開時（或在電腦上），連線清單固定顯示在左側。

## 下載

| 系統 | 檔案 | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 或更新版本 |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | 安裝程式 |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | 免安裝版 |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` 後執行 |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | 解壓縮後執行 `./cyber` |

所有版本都在 [*Releases*](https://github.com/apk-fold/Cyber/releases) 分頁，並附有 SHA-256 雜湊值。每次程式碼變更後，GitHub Actions 都會自動建置。

- **Android**：開啟 `Cyber.apk`，允許從此來源安裝，然後點選*安裝*。更新會直接覆蓋安裝，不會遺失設定（使用相同的簽署金鑰）。
- **Windows**：檔案未經簽署，SmartScreen 會要求你點選*其他資訊 → 仍要執行*。

## Cyber 的功能

### 終端機
- [xterm.js](https://xtermjs.org) 引擎：256 色與 24 位元全彩、Unicode、可點擊的連結、GPU 算繪。
- 不限數量的**分頁**（重新命名、複製、重新連線、複製全部文字），在歷史紀錄中**搜尋**，歷史紀錄最多可設為 100,000 行。
- 以右鍵、選取文字或 Ctrl+C / Ctrl+V 複製貼上（可自選）。

### 本機 shell
- **Android**：在**真正的虛擬終端機**（原生模組）中執行系統 shell（`/system/bin/sh`），並可在設定中編輯**啟動指令碼**（提示字元、別名、變數）。
- **Windows**：預設為 PowerShell，也可使用 `cmd.exe`、`pwsh`、`wsl.exe`……
- **Linux**：你的 shell（`$SHELL`）。
- 可設定指令、參數和起始資料夾。

### SSH
- 儲存的**設定檔**（名稱、主機、連接埠、使用者、顏色、每台伺服器專屬主題）以及用 `使用者@主機:連接埠` **快速連線**。
- 密碼（每次詢問或記住）或 **SSH 金鑰**：在 App 內產生 **Ed25519** 金鑰（一鍵複製公開金鑰），匯入 OpenSSH、PEM 和 PuTTY 金鑰，支援密碼片語。
- 首次連線時**驗證伺服器指紋**，指紋變更時發出警告。
- 保持連線、可調整的逾時、**啟動指令**（例如 `tmux attach || tmux`）。
- 在 Android 上，App 切到背景時會有通知讓工作階段保持開啟。

### 個人化
- **12 種主題**：Cyber 霓虹、午夜、東京之夜、Dracula、Nord、One Dark、Gruvbox、Monokai、Solarized、矩陣、復古琥珀、紙張（淺色）。
- **顏色編輯器**：背景、文字、游標、選取範圍和 16 種 ANSI 顏色，即時預覽；可匯出和匯入主題。
- 介面強調色、邊距、分頁位於上方或下方。
- 字型：內建 JetBrains Mono 和 Fira Code，或任何已安裝的字型；大小、行高、字距、字重、最低對比度。
- 方塊、底線或直線游標，可閃爍或不閃爍；提示音可設為閃光、聲音或震動。

### 觸控鍵盤
- Termux 風格的**按鍵列**（ESC、TAB、CTRL、ALT、方向鍵、HOME、END、PG↑/PG↓、F1–F12……），配置由你自己撰寫，可設 1 到 4 列。其他任何按鍵都會送出其文字（`|`、`~`、`:wq`……）。
- 「黏滯」CTRL 和 ALT：按一下 = 生效一次，快速按兩下 = 鎖定。
- 終端機支援**雙指縮放**，按鍵時震動（可關閉）。

### 快速指令
⚡ 按鈕會將儲存的指令送到目前的分頁，可選擇是否附帶 Enter。

### 備份
將所有設定、主題、連線和信任的伺服器匯出為 JSON（密碼和私密金鑰只有在你要求時才會包含），然後在另一台裝置上還原。

## 快速鍵（電腦）

| 快速鍵 | 動作 |
|---|---|
| Ctrl+Shift+T | 新增本機 shell |
| Ctrl+Shift+N | 新增 SSH 連線 |
| Ctrl+Shift+W | 關閉分頁 |
| Ctrl+Tab / Ctrl+Shift+Tab | 下一個 / 上一個分頁 |
| Alt+1 … Alt+9 | 前往第 n 個分頁 |
| Ctrl+Shift+C / Ctrl+Shift+V | 複製 / 貼上 |
| Ctrl+Shift+F | 搜尋 |
| Ctrl + / Ctrl − / Ctrl 0 | 文字大小 |
| Ctrl+, | 設定 |

## 自行編譯

需要 [Node.js](https://nodejs.org) 22。

```sh
npm install
npm start              # 以開發模式執行電腦版
npm run dist:win       # Windows 安裝程式 + 免安裝版 → release/
npm run dist:linux     # AppImage + tar.gz → release/（請在 Linux 上執行）
```

編譯 APK（需要 JDK 21 和 Android SDK，或 Android Studio）：

```sh
npm install
npm run build:web      # 將介面複製到 android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

本機 shell 的原生模組（`android/app/src/main/cpp`）以 NDK 編譯，Android Studio 會在需要時自動安裝。

## APK 簽署

所有版本都以**同一把金鑰**（`signing/cyber.jks`）簽署，因此更新可以直接覆蓋安裝。這把金鑰在儲存庫中是公開的：請只從本儲存庫安裝 Cyber。若要使用私人金鑰，請在 *Settings › Secrets › Actions* 中新增 `CYBER_KEYSTORE_B64`（以 base64 編碼的 .jks 檔案）、`CYBER_KEYSTORE_PASSWORD`、`CYBER_KEY_ALIAS` 和 `CYBER_KEY_PASSWORD` 這幾個 secret（更換金鑰必須解除安裝舊版：請先匯出備份）。

## 注意事項

- 設定、連線、金鑰和信任的伺服器**只儲存在裝置上**，沒有額外加密。請勿在共用裝置上記住密碼。
- Android 的本機 shell 只能使用系統內建的指令（`ls`、`cat`、`ping`、`top`……），而不是像 Termux 那樣附帶套件管理器的完整 Linux：若需要完整 Linux，請透過 SSH 連線到伺服器（或用 `sshd` 連線到 Termux 本身）。

## 儲存庫結構

| 資料夾 | 內容 |
|---|---|
| `web/` | 共用介面（HTML、CSS、JavaScript） |
| `desktop/` | Windows 與 Linux 版本（Electron、ssh2、node-pty） |
| `android/` | Android 版本（WebView、JSch、以 C 撰寫的虛擬終端機） |
| `scripts/` | 介面準備與編譯輔助工具 |
| `tests/` | 真實 SSH、本機 shell 與介面測試（每次編譯都會執行） |
| `signing/` | APK 簽署金鑰 |

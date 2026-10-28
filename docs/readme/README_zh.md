<div align="center">

[English](README_en.md) · **简体中文** · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

适用于 **Android、Windows 和 Linux** 的 **SSH** 终端和**本地 shell**，延续 Termux 的风格，界面的每个细节都可以调整：主题、16 种颜色中的每一种、字体、光标、按键栏、快捷命令…… 三个版本共用同一套界面和同一种备份格式：你的设置和服务器只需一个文件就能从手机转到电脑。

专为 Galaxy Z Fold 设计：折叠时，连接列表在抽屉中打开；展开时（或在电脑上），连接列表固定显示在左侧。

## 下载

| 系统 | 文件 | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 或更高版本 |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | 安装程序 |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | 免安装版 |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` 后运行 |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | 解压后运行 `./cyber` |

所有版本都在 [*Releases*](https://github.com/apk-fold/Cyber/releases) 页面，并附有 SHA-256 校验值。每次代码变更后，GitHub Actions 都会自动构建。

- **Android**：打开 `Cyber.apk`，允许从该来源安装，然后点击*安装*。更新会直接覆盖安装，不会丢失设置（使用相同的签名密钥）。
- **Windows**：文件未签名，SmartScreen 会提示，请点击*更多信息 → 仍要运行*。

## Cyber 的功能

### 终端
- [xterm.js](https://xtermjs.org) 引擎：256 色和 24 位真彩色、Unicode、可点击链接、GPU 渲染。
- 无限**标签页**（重命名、复制、重新连接、复制全部文本），在历史记录中**搜索**，历史记录最多可设为 100,000 行。
- 通过右键、选中文本或 Ctrl+C / Ctrl+V 复制粘贴（可选）。

### 本地 shell
- **Android**：在**真正的伪终端**（原生模块）中运行系统 shell（`/system/bin/sh`），并可在设置中编辑**启动脚本**（提示符、别名、变量）。
- **Windows**：默认 PowerShell，也可用 `cmd.exe`、`pwsh`、`wsl.exe`……
- **Linux**：你的 shell（`$SHELL`）。
- 可设置命令、参数和起始目录。

### SSH
- 保存的**配置文件**（名称、主机、端口、用户、颜色、每台服务器专属主题）以及用 `用户@主机:端口` **快速连接**。
- 密码（每次询问或记住）或 **SSH 密钥**：在应用内生成 **Ed25519** 密钥（一键复制公钥），导入 OpenSSH、PEM 和 PuTTY 密钥，支持密码短语。
- 首次连接时**验证服务器指纹**，指纹变化时发出警告。
- 保持连接、可调超时、**启动命令**（例如 `tmux attach || tmux`）。
- 在 Android 上，应用切到后台时会有通知保持会话不断开。

### 个性化
- **12 种主题**：Cyber 霓虹、午夜、东京之夜、Dracula、Nord、One Dark、Gruvbox、Monokai、Solarized、矩阵、复古琥珀、纸张（浅色）。
- **颜色编辑器**：背景、文字、光标、选区和 16 种 ANSI 颜色，实时预览；支持导出和导入主题。
- 界面强调色、边距、标签页在顶部或底部。
- 字体：内置 JetBrains Mono 和 Fira Code，或任何已安装的字体；字号、行高、字间距、字重、最低对比度。
- 方块、下划线或竖线光标，可闪烁或不闪烁；响铃可设为闪屏、声音或振动。

### 触屏键盘
- Termux 风格的**按键栏**（ESC、TAB、CTRL、ALT、方向键、HOME、END、PG↑/PG↓、F1–F12……），布局由你自己编写，可设 1 到 4 行。其他任何按键都会发送其文本（`|`、`~`、`:wq`……）。
- "粘滞" CTRL 和 ALT：按一次 = 生效一次，快速按两次 = 锁定。
- 终端支持**双指缩放**，按键时振动（可关闭）。

### 快捷命令
⚡ 按钮会把保存的命令发送到当前标签页，可选择是否附带回车。

### 备份
将所有设置、主题、连接和受信任服务器导出为 JSON（密码和私钥仅在你要求时才包含），然后在另一台设备上恢复。

## 快捷键（电脑）

| 快捷键 | 操作 |
|---|---|
| Ctrl+Shift+T | 新建本地 shell |
| Ctrl+Shift+N | 新建 SSH 连接 |
| Ctrl+Shift+W | 关闭标签页 |
| Ctrl+Tab / Ctrl+Shift+Tab | 下一个 / 上一个标签页 |
| Alt+1 … Alt+9 | 跳到第 n 个标签页 |
| Ctrl+Shift+C / Ctrl+Shift+V | 复制 / 粘贴 |
| Ctrl+Shift+F | 搜索 |
| Ctrl + / Ctrl − / Ctrl 0 | 文字大小 |
| Ctrl+, | 设置 |

## 自行编译

需要 [Node.js](https://nodejs.org) 22。

```sh
npm install
npm start              # 以开发模式运行电脑版
npm run dist:win       # Windows 安装程序 + 便携版 → release/
npm run dist:linux     # AppImage + tar.gz → release/（请在 Linux 上运行）
```

编译 APK（需要 JDK 21 和 Android SDK，或 Android Studio）：

```sh
npm install
npm run build:web      # 将界面复制到 android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

本地 shell 的原生模块（`android/app/src/main/cpp`）使用 NDK 编译，Android Studio 会在需要时自动安装。

## APK 签名

所有版本都使用**同一个密钥**（`signing/cyber.jks`）签名，因此更新可以直接覆盖安装。该密钥在仓库中是公开的：请只从本仓库安装 Cyber。如需使用私有密钥，请在 *Settings › Secrets › Actions* 中添加 `CYBER_KEYSTORE_B64`（base64 编码的 .jks 文件）、`CYBER_KEYSTORE_PASSWORD`、`CYBER_KEY_ALIAS` 和 `CYBER_KEY_PASSWORD` 这几个 secret（更换密钥需要卸载旧版本：请先导出备份）。

## 须知

- 设置、连接、密钥和受信任服务器**只保存在设备上**，没有额外加密。请不要在共用设备上保存密码。
- Android 的本地 shell 只能使用系统自带命令（`ls`、`cat`、`ping`、`top`……），并不是像 Termux 那样带包管理器的完整 Linux：如需完整 Linux，请通过 SSH 连接到服务器（或用 `sshd` 连接到 Termux 本身）。

## 仓库结构

| 目录 | 内容 |
|---|---|
| `web/` | 共用界面（HTML、CSS、JavaScript） |
| `desktop/` | Windows 和 Linux 版本（Electron、ssh2、node-pty） |
| `android/` | Android 版本（WebView、JSch、C 语言编写的伪终端） |
| `scripts/` | 界面准备和编译辅助脚本 |
| `tests/` | 真实 SSH、本地 shell 和界面测试（每次编译都会运行） |
| `signing/` | APK 签名密钥 |

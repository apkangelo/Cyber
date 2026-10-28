<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · **한국어** · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

**Android, Windows, Linux**용 **SSH** 터미널 겸 **로컬 셸**입니다. Termux의 감성을 이어받았고, 인터페이스를 아주 세세한 부분까지 조정할 수 있습니다: 테마, 16가지 색상 하나하나, 글꼴, 커서, 키 바, 빠른 명령… 세 버전은 같은 인터페이스와 같은 백업 형식을 공유하므로, 설정과 서버를 파일 하나로 휴대폰에서 PC로 옮길 수 있습니다.

Galaxy Z Fold를 염두에 두고 설계했습니다: 접었을 때는 연결 목록이 서랍으로 열리고, 펼쳤을 때(또는 PC에서는) 왼쪽에 계속 표시됩니다.

## 다운로드

| 시스템 | 파일 | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 이상 |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | 설치 프로그램 |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | 설치 없이 실행 |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` 후 실행 |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | 압축을 풀고 `./cyber` 실행 |

모든 버전은 [*Releases*](https://github.com/apk-fold/Cyber/releases) 탭에 SHA-256 해시와 함께 있습니다. 코드가 바뀔 때마다 GitHub Actions가 자동으로 빌드합니다.

- **Android**: `Cyber.apk`를 열고, 이 출처에서의 설치를 허용한 다음 *설치*를 누르세요. 업데이트는 설정을 잃지 않고 덮어쓰기로 설치됩니다(같은 서명 키).
- **Windows**: 파일이 서명되지 않았기 때문에 SmartScreen에서 *추가 정보 → 실행*을 선택해야 합니다.

## Cyber가 하는 일

### 터미널
- [xterm.js](https://xtermjs.org) 엔진: 256색과 24비트 색상, 유니코드, 클릭 가능한 링크, GPU 렌더링.
- 무제한 **탭**(이름 바꾸기, 복제, 재연결, 전체 텍스트 복사), 스크롤백 **검색**, 스크롤백은 최대 100,000줄까지 설정 가능.
- 오른쪽 클릭, 선택 시, 또는 Ctrl+C / Ctrl+V로 복사·붙여넣기(원하는 방식 선택).

### 로컬 셸
- **Android**: 시스템 셸(`/system/bin/sh`)을 **진짜 의사 터미널**(네이티브 모듈)에서 실행하며, 설정에서 **시작 스크립트**(프롬프트, 별칭, 변수)를 편집할 수 있습니다.
- **Windows**: 기본은 PowerShell이며, `cmd.exe`, `pwsh`, `wsl.exe` 등도 사용할 수 있습니다.
- **Linux**: 사용자의 셸(`$SHELL`).
- 명령, 인수, 시작 폴더를 설정할 수 있습니다.

### SSH
- 저장된 **프로필**(이름, 호스트, 포트, 사용자, 색상, 서버별 테마)과 `사용자@호스트:포트` 형식의 **빠른 연결**.
- 비밀번호(매번 묻거나 저장) 또는 **SSH 키**: 앱 안에서 **Ed25519** 키 생성(공개 키는 한 번에 복사), OpenSSH·PEM·PuTTY 키 가져오기, 패스프레이즈 지원.
- 첫 연결 때 서버 **지문을 확인**하고, 지문이 바뀌면 경고합니다.
- 연결 유지, 시간 제한 조정, **시작 명령**(예: `tmux attach || tmux`).
- Android에서는 앱이 백그라운드로 가도 알림이 세션을 열어 둡니다.

### 개인화
- **12가지 테마**: Cyber 네온, 미드나이트, 도쿄 나이트, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, 매트릭스, 레트로 앰버, 페이퍼(밝은 테마).
- **색상 편집기**: 배경, 텍스트, 커서, 선택 영역과 16가지 ANSI 색상을 실시간 미리보기로 편집하고, 테마를 내보내고 가져올 수 있습니다.
- 인터페이스 강조 색상, 여백, 탭 위치(위 또는 아래).
- 글꼴: JetBrains Mono와 Fira Code 내장, 또는 설치된 어떤 글꼴이든 사용 가능; 크기, 줄 간격, 자간, 굵기, 최소 대비.
- 블록·밑줄·막대 커서, 깜빡임 여부; 벨은 화면 깜빡임, 소리, 진동 중에서 선택.

### 터치 키보드
- Termux 스타일 **키 바**(ESC, TAB, CTRL, ALT, 화살표, HOME, END, PG↑/PG↓, F1–F12…)로, 배치를 직접 작성할 수 있고 1~4줄까지 지원합니다. 다른 키는 해당 텍스트를 보냅니다(`|`, `~`, `:wq`…).
- "고정" CTRL과 ALT: 한 번 누르면 한 번만, 빠르게 두 번 누르면 잠금.
- 터미널에서 **두 손가락 확대/축소**, 키를 누를 때 진동(끌 수 있음).

### 빠른 명령
⚡ 버튼은 저장해 둔 명령을 현재 탭으로 보내며, Enter 포함 여부를 고를 수 있습니다.

### 백업
모든 설정, 테마, 연결, 신뢰하는 서버를 JSON으로 내보낸 다음(비밀번호와 개인 키는 요청할 때만 포함) 다른 기기에서 복원할 수 있습니다.

## 단축키(PC)

| 단축키 | 동작 |
|---|---|
| Ctrl+Shift+T | 새 로컬 셸 |
| Ctrl+Shift+N | 새 SSH 연결 |
| Ctrl+Shift+W | 탭 닫기 |
| Ctrl+Tab / Ctrl+Shift+Tab | 다음 / 이전 탭 |
| Alt+1 … Alt+9 | n번째 탭으로 이동 |
| Ctrl+Shift+C / Ctrl+Shift+V | 복사 / 붙여넣기 |
| Ctrl+Shift+F | 검색 |
| Ctrl + / Ctrl − / Ctrl 0 | 글자 크기 |
| Ctrl+, | 설정 |

## 직접 빌드하기

[Node.js](https://nodejs.org) 22가 필요합니다.

```sh
npm install
npm start              # PC 버전을 개발 모드로 실행
npm run dist:win       # Windows 설치 프로그램 + 포터블 버전 → release/
npm run dist:linux     # AppImage + tar.gz → release/ (Linux에서 실행)
```

APK의 경우(JDK 21과 Android SDK, 또는 Android Studio):

```sh
npm install
npm run build:web      # 인터페이스를 android/app/src/main/assets/www에 복사
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

로컬 셸의 네이티브 모듈(`android/app/src/main/cpp`)은 NDK로 컴파일되며, 필요하면 Android Studio가 NDK를 설치합니다.

## APK 서명

모든 버전은 **같은 키**(`signing/cyber.jks`)로 서명되므로 업데이트를 덮어쓰기로 설치할 수 있습니다. 이 키는 저장소에 공개되어 있으니 Cyber는 반드시 이 저장소에서만 설치하세요. 비공개 키를 쓰려면 *Settings › Secrets › Actions*에 `CYBER_KEYSTORE_B64`(base64로 인코딩한 .jks 파일), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS`, `CYBER_KEY_PASSWORD` 시크릿을 추가하세요(키를 바꾸면 이전 버전을 제거해야 하므로 먼저 백업을 내보내세요).

## 알아 두면 좋은 점

- 설정, 연결, 키, 신뢰하는 서버는 추가 암호화 없이 **기기에만** 저장됩니다. 공용 기기에는 비밀번호를 저장하지 마세요.
- Android 로컬 셸에서는 시스템 명령(`ls`, `cat`, `ping`, `top`…)을 쓸 수 있을 뿐, Termux처럼 패키지 관리자가 있는 완전한 Linux가 아닙니다. 그런 환경이 필요하면 SSH로 서버(또는 `sshd`를 실행한 Termux 자체)에 접속하세요.

## 저장소 구성

| 폴더 | 내용 |
|---|---|
| `web/` | 공통 인터페이스(HTML, CSS, JavaScript) |
| `desktop/` | Windows·Linux 버전(Electron, ssh2, node-pty) |
| `android/` | Android 버전(WebView, JSch, C로 작성한 의사 터미널) |
| `scripts/` | 인터페이스 준비 및 빌드 도우미 |
| `tests/` | 실제 SSH, 로컬 셸, 인터페이스 테스트(빌드마다 실행) |
| `signing/` | APK 서명 키 |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · **Polski** · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** i **lokalna powłoka** na **Androida, Windows i Linuksa**, w duchu Termuxa, z interfejsem, który dopasujesz w najdrobniejszych szczegółach: motywy, każdy z 16 kolorów, czcionka, kursor, pasek klawiszy, szybkie polecenia… Wszystkie trzy wersje mają ten sam interfejs i ten sam format kopii zapasowej: twoje ustawienia i serwery przechodzą z telefonu na komputer w jednym pliku.

Zaprojektowany z myślą o Galaxy Z Fold: po złożeniu połączenia otwierają się w szufladzie; po rozłożeniu (lub na komputerze) są stale widoczne po lewej stronie.

## Pobieranie

| System | Plik | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 lub nowszy |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | instalator |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | bez instalacji |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage`, a potem uruchom |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | rozpakuj i uruchom `./cyber` |

Wszystkie wersje są w zakładce [*Releases*](https://github.com/apk-fold/Cyber/releases), razem z sumami kontrolnymi SHA-256. GitHub Actions kompiluje je automatycznie przy każdej zmianie kodu.

- **Android**: otwórz `Cyber.apk`, zezwól na instalację z tego źródła, a potem dotknij *Zainstaluj*. Aktualizacje instalują się na poprzedniej wersji bez utraty ustawień (ten sam klucz podpisu).
- **Windows**: pliki nie są podpisane, więc SmartScreen poprosi o wybranie *Więcej informacji → Uruchom mimo to*.

## Co potrafi Cyber

### Terminal
- Silnik [xterm.js](https://xtermjs.org): 256 kolorów i kolor 24-bitowy, Unicode, klikalne linki, renderowanie na GPU.
- Nieograniczona liczba **kart** (zmiana nazwy, duplikowanie, ponowne łączenie, kopiowanie całego tekstu), **wyszukiwanie** w historii, historia regulowana do 100 000 wierszy.
- Kopiowanie i wklejanie prawym przyciskiem myszy, przy zaznaczeniu lub przez Ctrl+C / Ctrl+V (do wyboru).

### Lokalna powłoka
- **Android**: powłoka systemowa (`/system/bin/sh`) w **prawdziwym pseudoterminalu** (moduł natywny), ze **skryptem startowym** edytowalnym w ustawieniach (znak zachęty, aliasy, zmienne).
- **Windows**: domyślnie PowerShell, albo `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: twoja powłoka (`$SHELL`).
- Konfigurowalne polecenie, argumenty i folder startowy.

### SSH
- Zapisane **profile** (nazwa, host, port, użytkownik, kolor, osobny motyw dla każdego serwera) i **szybkie połączenie** przez `użytkownik@host:port`.
- Hasło (pytanie za każdym razem lub zapamiętane) albo **klucz SSH**: generowanie kluczy **Ed25519** w aplikacji (klucz publiczny kopiowany jednym dotknięciem), import kluczy OpenSSH, PEM i PuTTY, hasła do kluczy.
- **Weryfikacja odcisku** serwera przy pierwszym połączeniu i ostrzeżenie, jeśli się zmieni.
- Keep-alive, regulowany limit czasu, **polecenie startowe** (np. `tmux attach || tmux`).
- Na Androidzie powiadomienie utrzymuje sesje otwarte, gdy aplikacja przechodzi w tło.

### Personalizacja
- **12 motywów**: Cyber Neon, Północ, Noc w Tokio, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Retro bursztyn, Papier (jasny).
- **Edytor kolorów**: tło, tekst, kursor, zaznaczenie i 16 kolorów ANSI, z podglądem na żywo; eksport i import motywów.
- Kolor akcentu interfejsu, margines, karty u góry lub u dołu.
- Czcionka: wbudowane JetBrains Mono i Fira Code lub dowolna zainstalowana czcionka; rozmiar, interlinia, odstępy między literami, grubości, minimalny kontrast.
- Kursor blokowy, podkreślenie lub pionowa kreska, migający lub nie; dzwonek jako błysk, dźwięk lub wibracja.

### Klawiatura dotykowa
- **Pasek klawiszy** w stylu Termuxa (ESC, TAB, CTRL, ALT, strzałki, HOME, END, PG↑/PG↓, F1–F12…), którego układ piszesz sam, w 1 do 4 rzędów. Każdy inny klawisz wysyła swój tekst (`|`, `~`, `:wq`…).
- „Przyklejone” CTRL i ALT: jedno dotknięcie = raz, dwa szybkie dotknięcia = zablokowane.
- **Powiększanie dwoma palcami** w terminalu, wibracja przy naciśnięciu (można wyłączyć).

### Szybkie polecenia
Przycisk ⚡ wysyła zapisane polecenie do aktywnej karty, z Enterem lub bez.

### Kopia zapasowa
Eksport do JSON wszystkich ustawień, motywów, połączeń i zaufanych serwerów (hasła i klucze prywatne tylko na twoje życzenie), a potem przywracanie na innym urządzeniu.

## Skróty (PC)

| Skrót | Działanie |
|---|---|
| Ctrl+Shift+T | Nowa lokalna powłoka |
| Ctrl+Shift+N | Nowe połączenie SSH |
| Ctrl+Shift+W | Zamknij kartę |
| Ctrl+Tab / Ctrl+Shift+Tab | Następna / poprzednia karta |
| Alt+1 … Alt+9 | Przejdź do karty n |
| Ctrl+Shift+C / Ctrl+Shift+V | Kopiuj / wklej |
| Ctrl+Shift+F | Szukaj |
| Ctrl + / Ctrl − / Ctrl 0 | Rozmiar tekstu |
| Ctrl+, | Ustawienia |

## Samodzielna kompilacja

Potrzebujesz [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # uruchamia wersję na PC w trybie deweloperskim
npm run dist:win       # instalator + wersja przenośna dla Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (uruchamiać pod Linuksem)
```

Dla APK (JDK 21 i Android SDK albo Android Studio):

```sh
npm install
npm run build:web      # kopiuje interfejs do android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

Moduł natywny lokalnej powłoki (`android/app/src/main/cpp`) jest kompilowany za pomocą NDK, który Android Studio instaluje w razie potrzeby.

## Podpis APK

Wszystkie wersje są podpisane **tym samym kluczem** (`signing/cyber.jks`), żeby aktualizacje instalowały się na poprzedniej wersji. Ten klucz jest publiczny w repozytorium: instaluj Cyber wyłącznie z tego repozytorium. Aby użyć prywatnego klucza, dodaj w *Settings › Secrets › Actions* sekrety `CYBER_KEYSTORE_B64` (plik .jks w base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` i `CYBER_KEY_PASSWORD` (zmiana klucza wymaga odinstalowania starej wersji: najpierw wyeksportuj kopię zapasową).

## Dobrze wiedzieć

- Ustawienia, połączenia, klucze i zaufane serwery są przechowywane **wyłącznie na urządzeniu**, bez dodatkowego szyfrowania. Nie zapisuj haseł na współdzielonym urządzeniu.
- Lokalna powłoka Androida daje dostęp do poleceń systemu (`ls`, `cat`, `ping`, `top`…), a nie do pełnego Linuksa z menedżerem pakietów jak Termux: w tym celu połącz się przez SSH z serwerem (lub z samym Termuxem przez `sshd`).

## Struktura repozytorium

| Folder | Zawartość |
|---|---|
| `web/` | Wspólny interfejs (HTML, CSS, JavaScript) |
| `desktop/` | Wersja na Windows i Linuksa (Electron, ssh2, node-pty) |
| `android/` | Wersja na Androida (WebView, JSch, pseudoterminal w C) |
| `scripts/` | Przygotowanie interfejsu i pomocnicze skrypty kompilacji |
| `tests/` | Prawdziwe testy SSH, lokalnej powłoki i interfejsu (uruchamiane przy każdej kompilacji) |
| `signing/` | Klucz podpisu APK |

<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · **Español** · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** y **shell local** para **Android, Windows y Linux**, en el espíritu de Termux, con una interfaz que se ajusta hasta el último detalle: temas, cada uno de los 16 colores, fuente, cursor, barra de teclas, comandos rápidos… Las tres versiones comparten la misma interfaz y el mismo formato de copia de seguridad: tus ajustes y servidores pasan del móvil al PC en un solo archivo.

Pensado para el Galaxy Z Fold: plegado, las conexiones se abren en un cajón; desplegado (o en el PC), se quedan a la vista a la izquierda.

## Descargar

| Sistema | Archivo | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 o posterior |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | instalador |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | sin instalación |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` y luego ejecutar |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | extraer y ejecutar `./cyber` |

Todas las versiones están en la pestaña [*Releases*](https://github.com/apk-fold/Cyber/releases), con sus sumas SHA-256. GitHub Actions las compila automáticamente con cada cambio en el código.

- **Android**: abre `Cyber.apk`, permite la instalación desde este origen y pulsa *Instalar*. Las actualizaciones se instalan encima sin perder tus ajustes (misma clave de firma).
- **Windows**: los archivos no están firmados, así que SmartScreen pedirá *Más información → Ejecutar de todas formas*.

## Qué hace Cyber

### Terminal
- Motor [xterm.js](https://xtermjs.org): 256 colores y color de 24 bits, Unicode, enlaces clicables, renderizado por GPU.
- **Pestañas** ilimitadas (renombrar, duplicar, reconectar, copiar todo el texto), **búsqueda** en el historial, historial ajustable hasta 100 000 líneas.
- Copiar/pegar con clic derecho, al seleccionar o con Ctrl+C / Ctrl+V (a elegir).

### Shell local
- **Android**: el shell del sistema (`/system/bin/sh`) en un **pseudoterminal real** (módulo nativo), con un **script de inicio** editable en los ajustes (prompt, alias, variables).
- **Windows**: PowerShell por defecto, o `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: tu shell (`$SHELL`).
- Comando, argumentos y carpeta de inicio configurables.

### SSH
- **Perfiles** guardados (nombre, host, puerto, usuario, color, tema propio de cada servidor) y **conexión rápida** con `usuario@host:puerto`.
- Contraseña (pedida cada vez o recordada) o **clave SSH**: generación de claves **Ed25519** en la app (la clave pública se copia con un toque), importación de claves OpenSSH, PEM y PuTTY, frases de contraseña.
- **Verificación de la huella** del servidor en la primera conexión y aviso si cambia.
- Keep-alive, tiempo de espera ajustable, **comando al iniciar** (p. ej. `tmux attach || tmux`).
- En Android, una notificación mantiene las sesiones abiertas cuando la app pasa a segundo plano.

### Personalización
- **12 temas**: Cyber neón, Medianoche, Noche de Tokio, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Ámbar retro, Papel (claro).
- **Editor de colores**: fondo, texto, cursor, selección y los 16 colores ANSI, con vista previa en directo; exportación e importación de temas.
- Color de acento de la interfaz, margen, pestañas arriba o abajo.
- Fuente: JetBrains Mono y Fira Code integradas, o cualquier fuente instalada; tamaño, interlineado, espaciado, pesos, contraste mínimo.
- Cursor de bloque, subrayado o barra, parpadeante o no; campana como destello, sonido o vibración.

### Teclado táctil
- **Barra de teclas** al estilo Termux (ESC, TAB, CTRL, ALT, flechas, HOME, END, PG↑/PG↓, F1–F12…) cuya disposición escribes tú mismo, en 1 a 4 filas. Cualquier otra tecla envía su texto (`|`, `~`, `:wq`…).
- CTRL y ALT «fijas»: una pulsación = una vez, dos pulsaciones rápidas = bloqueada.
- **Zoom con dos dedos** en el terminal, vibración al pulsar (desactivable).

### Comandos rápidos
El botón ⚡ envía un comando guardado a la pestaña activa, con o sin Intro.

### Copia de seguridad
Exportación en JSON de todos los ajustes, temas, conexiones y servidores de confianza (contraseñas y claves privadas solo si lo pides) y restauración en otro dispositivo.

## Atajos (PC)

| Atajo | Acción |
|---|---|
| Ctrl+Mayús+T | Nuevo shell local |
| Ctrl+Mayús+N | Nueva conexión SSH |
| Ctrl+Mayús+W | Cerrar la pestaña |
| Ctrl+Tab / Ctrl+Mayús+Tab | Pestaña siguiente / anterior |
| Alt+1 … Alt+9 | Ir a la pestaña n |
| Ctrl+Mayús+C / Ctrl+Mayús+V | Copiar / pegar |
| Ctrl+Mayús+F | Buscar |
| Ctrl + / Ctrl − / Ctrl 0 | Tamaño del texto |
| Ctrl+, | Ajustes |

## Compilarlo tú mismo

Necesitas [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # lanza la versión de PC en modo desarrollo
npm run dist:win       # instalador + versión portable de Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (ejecutar en Linux)
```

Para el APK (JDK 21 y el SDK de Android, o Android Studio):

```sh
npm install
npm run build:web      # copia la interfaz en android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

El módulo nativo del shell local (`android/app/src/main/cpp`) se compila con el NDK, que Android Studio instala cuando hace falta.

## Firma del APK

Todas las versiones se firman con **la misma clave** (`signing/cyber.jks`) para que las actualizaciones se instalen encima. Esta clave es pública en el repositorio: instala Cyber solo desde este repositorio. Para usar una clave privada, añade en *Settings › Secrets › Actions* los secrets `CYBER_KEYSTORE_B64` (el archivo .jks en base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` y `CYBER_KEY_PASSWORD` (cambiar de clave obliga a desinstalar la versión anterior: exporta antes tu copia de seguridad).

## Conviene saber

- Los ajustes, conexiones, claves y servidores de confianza se guardan **solo en el dispositivo**, sin cifrado adicional. No guardes contraseñas en un dispositivo compartido.
- El shell local de Android da acceso a los comandos del sistema (`ls`, `cat`, `ping`, `top`…), no a un Linux completo con gestor de paquetes como Termux: para eso, conéctate por SSH a un servidor (o al propio Termux con `sshd`).

## Organización del repositorio

| Carpeta | Contenido |
|---|---|
| `web/` | Interfaz común (HTML, CSS, JavaScript) |
| `desktop/` | Versión para Windows y Linux (Electron, ssh2, node-pty) |
| `android/` | Versión para Android (WebView, JSch, pseudoterminal en C) |
| `scripts/` | Preparación de la interfaz y ayudas para compilar |
| `tests/` | Pruebas reales de SSH, shell local e interfaz (se ejecutan en cada compilación) |
| `signing/` | Clave de firma del APK |

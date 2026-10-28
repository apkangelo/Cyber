<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · **Português (Brasil)** · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../build/icon.png" width="120" alt="Cyber"></p>

# Cyber

Terminal **SSH** e **shell local** para **Android, Windows e Linux**, no espírito do Termux, com uma interface que você ajusta nos mínimos detalhes: temas, cada uma das 16 cores, fonte, cursor, barra de teclas, comandos rápidos… As três versões compartilham a mesma interface e o mesmo formato de backup: suas configurações e servidores passam do celular para o PC em um único arquivo.

Pensado para o Galaxy Z Fold: dobrado, as conexões abrem em uma gaveta; aberto (ou no PC), elas ficam visíveis à esquerda.

## Baixar

| Sistema | Arquivo | |
|---|---|---|
| Android | **[Cyber.apk](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.apk)** | Android 8 ou mais recente |
| Windows | **[Cyber-Setup.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Setup.exe)** | instalador |
| Windows | [Cyber-Portable.exe](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-Portable.exe) | sem instalação |
| Linux | **[Cyber.AppImage](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber.AppImage)** | `chmod +x Cyber.AppImage` e depois execute |
| Linux | [Cyber-linux.tar.gz](https://github.com/apk-fold/Cyber/releases/latest/download/Cyber-linux.tar.gz) | extraia e execute `./cyber` |

Todas as versões estão na aba [*Releases*](https://github.com/apk-fold/Cyber/releases), com suas somas SHA-256. Elas são compiladas automaticamente pelo GitHub Actions a cada alteração no código.

- **Android**: abra `Cyber.apk`, permita a instalação a partir desta fonte e toque em *Instalar*. As atualizações são instaladas por cima sem perder suas configurações (mesma chave de assinatura).
- **Windows**: os arquivos não são assinados, então o SmartScreen vai pedir *Mais informações → Executar assim mesmo*.

## O que o Cyber faz

### Terminal
- Motor [xterm.js](https://xtermjs.org): 256 cores e cor de 24 bits, Unicode, links clicáveis, renderização por GPU.
- **Abas** ilimitadas (renomear, duplicar, reconectar, copiar todo o texto), **busca** no histórico, histórico ajustável até 100.000 linhas.
- Copiar/colar com clique direito, ao selecionar ou com Ctrl+C / Ctrl+V (você escolhe).

### Shell local
- **Android**: o shell do sistema (`/system/bin/sh`) em um **pseudoterminal de verdade** (módulo nativo), com um **script de inicialização** editável nas configurações (prompt, aliases, variáveis).
- **Windows**: PowerShell por padrão, ou `cmd.exe`, `pwsh`, `wsl.exe`…
- **Linux**: o seu shell (`$SHELL`).
- Comando, argumentos e pasta inicial configuráveis.

### SSH
- **Perfis** salvos (nome, host, porta, usuário, cor, tema próprio de cada servidor) e **conexão rápida** com `usuário@host:porta`.
- Senha (pedida toda vez ou memorizada) ou **chave SSH**: geração de chaves **Ed25519** no app (chave pública copiada com um toque), importação de chaves OpenSSH, PEM e PuTTY, frases-senha.
- **Verificação da impressão digital** do servidor na primeira conexão e alerta se ela mudar.
- Keep-alive, tempo limite ajustável, **comando ao iniciar** (ex.: `tmux attach || tmux`).
- No Android, uma notificação mantém as sessões abertas quando o app vai para segundo plano.

### Personalização
- **12 temas**: Cyber Neon, Meia-noite, Noite de Tóquio, Dracula, Nord, One Dark, Gruvbox, Monokai, Solarized, Matrix, Âmbar retrô, Papel (claro).
- **Editor de cores**: fundo, texto, cursor, seleção e as 16 cores ANSI, com prévia ao vivo; exportação e importação de temas.
- Cor de destaque da interface, margem, abas em cima ou embaixo.
- Fonte: JetBrains Mono e Fira Code integradas, ou qualquer fonte instalada; tamanho, altura da linha, espaçamento, pesos, contraste mínimo.
- Cursor em bloco, sublinhado ou barra, piscando ou não; campainha como flash, som ou vibração.

### Teclado touch
- **Barra de teclas** no estilo do Termux (ESC, TAB, CTRL, ALT, setas, HOME, END, PG↑/PG↓, F1–F12…) cujo layout você mesmo escreve, em 1 a 4 linhas. Qualquer outra tecla envia o próprio texto (`|`, `~`, `:wq`…).
- CTRL e ALT "fixos": um toque = uma vez, dois toques rápidos = travado.
- **Zoom com dois dedos** no terminal, vibração ao tocar nas teclas (pode ser desativada).

### Comandos rápidos
O botão ⚡ envia um comando salvo para a aba ativa, com ou sem Enter.

### Backup
Exportação em JSON de todas as configurações, temas, conexões e servidores confiáveis (senhas e chaves privadas só se você pedir) e restauração em outro aparelho.

## Atalhos (PC)

| Atalho | Ação |
|---|---|
| Ctrl+Shift+T | Novo shell local |
| Ctrl+Shift+N | Nova conexão SSH |
| Ctrl+Shift+W | Fechar a aba |
| Ctrl+Tab / Ctrl+Shift+Tab | Próxima / anterior aba |
| Alt+1 … Alt+9 | Ir para a aba n |
| Ctrl+Shift+C / Ctrl+Shift+V | Copiar / colar |
| Ctrl+Shift+F | Buscar |
| Ctrl + / Ctrl − / Ctrl 0 | Tamanho do texto |
| Ctrl+, | Configurações |

## Compilar você mesmo

Você precisa do [Node.js](https://nodejs.org) 22.

```sh
npm install
npm start              # abre a versão de PC em modo de desenvolvimento
npm run dist:win       # instalador + versão portátil do Windows → release/
npm run dist:linux     # AppImage + tar.gz → release/ (rodar no Linux)
```

Para o APK (JDK 21 e o SDK do Android, ou Android Studio):

```sh
npm install
npm run build:web      # copia a interface para android/app/src/main/assets/www
cd android
gradlew assembleRelease   # → android/app/build/outputs/apk/release/app-release.apk
```

O módulo nativo do shell local (`android/app/src/main/cpp`) é compilado com o NDK, que o Android Studio instala quando necessário.

## Assinatura do APK

Todas as versões são assinadas com **a mesma chave** (`signing/cyber.jks`) para que as atualizações sejam instaladas por cima. Essa chave é pública no repositório: instale o Cyber apenas a partir deste repositório. Para usar uma chave privada, adicione em *Settings › Secrets › Actions* os secrets `CYBER_KEYSTORE_B64` (o arquivo .jks em base64), `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS` e `CYBER_KEY_PASSWORD` (trocar de chave exige desinstalar a versão antiga: exporte seu backup antes).

## Bom saber

- Configurações, conexões, chaves e servidores confiáveis ficam armazenados **somente no aparelho**, sem criptografia adicional. Não salve senhas em um aparelho compartilhado.
- O shell local do Android dá acesso aos comandos do sistema (`ls`, `cat`, `ping`, `top`…), não a um Linux completo com gerenciador de pacotes como o Termux: para isso, conecte-se por SSH a um servidor (ou ao próprio Termux com `sshd`).

## Organização do repositório

| Pasta | Conteúdo |
|---|---|
| `web/` | Interface compartilhada (HTML, CSS, JavaScript) |
| `desktop/` | Versão para Windows e Linux (Electron, ssh2, node-pty) |
| `android/` | Versão para Android (WebView, JSch, pseudoterminal em C) |
| `scripts/` | Preparação da interface e auxiliares de compilação |
| `tests/` | Testes reais de SSH, shell local e interface (executados a cada compilação) |
| `signing/` | Chave de assinatura do APK |

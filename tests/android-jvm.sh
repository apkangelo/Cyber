#!/usr/bin/env bash
# Compile et lance tests/jvm/JvmTest.java : le code SSH de l'APK et le module C du terminal, sur une JVM Linux.
set -euo pipefail
cd "$(dirname "$0")/.."
W="$(mktemp -d)"
M=https://repo1.maven.org/maven2
curl -sSfL -o "$W/jsch.jar" "$M/com/github/mwiede/jsch/0.2.20/jsch-0.2.20.jar"
curl -sSfL -o "$W/bcprov.jar" "$M/org/bouncycastle/bcprov-jdk18on/1.78.1/bcprov-jdk18on-1.78.1.jar"
curl -sSfL -o "$W/json.jar" "$M/org/json/json/20240303/json-20240303.jar"
JH="$(dirname "$(dirname "$(readlink -f "$(command -v javac)")")")"
gcc -shared -fPIC -O2 -Wall -D_GNU_SOURCE -I"$JH/include" -I"$JH/include/linux" android/app/src/main/cpp/pty.c -o "$W/libcyberpty.so"
SRC=android/app/src/main/java/fr/apkfold/cyber
CP="$W/jsch.jar:$W/bcprov.jar:$W/json.jar"
javac -encoding UTF-8 -d "$W/classes" -cp "$CP" "$SRC/SessionEvents.java" "$SRC/TermSession.java" "$SRC/SshSession.java" "$SRC/Pty.java" tests/jvm/JvmTest.java
java --add-opens java.base/java.io=ALL-UNNAMED -Djava.library.path="$W" -cp "$W/classes:$CP" fr.apkfold.cyber.JvmTest tests/out/id_ed25519

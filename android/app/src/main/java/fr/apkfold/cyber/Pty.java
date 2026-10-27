package fr.apkfold.cyber;

import java.io.IOException;

/** Accès au pseudo-terminal natif (voir src/main/cpp/pty.c). */
final class Pty {
    static {
        System.loadLibrary("cyberpty");
    }

    private Pty() {}

    /** Lance une commande dans un nouveau PTY. Renvoie {pid, fd du maître}. */
    static native int[] start(String cmd, String[] args, String[] env, String cwd, int rows, int cols) throws IOException;

    static native void resize(int fd, int rows, int cols);

    /** Attend la fin du processus ; renvoie son code de sortie (négatif s'il a été tué par un signal). */
    static native int waitFor(int pid);

    /** Envoie SIGHUP au processus et à son groupe. */
    static native void hangup(int pid);
}

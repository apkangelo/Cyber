/*
 * Cyber — création d'un pseudo-terminal pour le shell local Android.
 * Ouvre /dev/ptmx, lance le programme demandé dans une nouvelle session dont le terminal
 * de contrôle est l'esclave du PTY, et renvoie [pid, fd maître] à Java.
 */
#include <jni.h>
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/wait.h>

static void throw_io(JNIEnv *env, const char *what) {
    char msg[256];
    snprintf(msg, sizeof msg, "%s : %s", what, strerror(errno));
    jclass cls = (*env)->FindClass(env, "java/io/IOException");
    if (cls) (*env)->ThrowNew(env, cls, msg);
}

static char *dup_jstring(JNIEnv *env, jstring s) {
    if (s == NULL) return NULL;
    const char *c = (*env)->GetStringUTFChars(env, s, NULL);
    if (c == NULL) return NULL;
    char *r = strdup(c);
    (*env)->ReleaseStringUTFChars(env, s, c);
    return r;
}

/* Copie un String[] Java en tableau C terminé par NULL ; « first » (déjà alloué) est placé en tête s'il est fourni. */
static char **dup_array(JNIEnv *env, jobjectArray arr, char *first) {
    jsize n = arr ? (*env)->GetArrayLength(env, arr) : 0;
    int extra = first ? 1 : 0;
    char **out = calloc((size_t) n + extra + 1, sizeof(char *));
    if (out == NULL) return NULL;
    if (first) out[0] = first;
    for (jsize i = 0; i < n; i++) {
        jstring s = (jstring) (*env)->GetObjectArrayElement(env, arr, i);
        out[i + extra] = dup_jstring(env, s);
        if (s) (*env)->DeleteLocalRef(env, s);
        if (out[i + extra] == NULL) out[i + extra] = strdup("");
    }
    return out;
}

static void free_array(char **a) {
    if (a == NULL) return;
    for (char **p = a; *p; p++) free(*p);
    free(a);
}

JNIEXPORT jintArray JNICALL
Java_fr_apkfold_cyber_Pty_start(JNIEnv *env, jclass clazz, jstring jcmd, jobjectArray jargs,
                                jobjectArray jenv, jstring jcwd, jint rows, jint cols) {
    (void) clazz;
    int ptm = open("/dev/ptmx", O_RDWR | O_CLOEXEC);
    if (ptm < 0) {
        throw_io(env, "ouverture de /dev/ptmx");
        return NULL;
    }
    char devname[64];
    if (grantpt(ptm) != 0 || unlockpt(ptm) != 0 || ptsname_r(ptm, devname, sizeof devname) != 0) {
        throw_io(env, "préparation du terminal");
        close(ptm);
        return NULL;
    }

    struct termios tios;
    if (tcgetattr(ptm, &tios) == 0) {
        tios.c_iflag |= IUTF8;
        tios.c_iflag &= ~(IXON | IXOFF);
        tcsetattr(ptm, TCSANOW, &tios);
    }
    struct winsize ws;
    memset(&ws, 0, sizeof ws);
    ws.ws_row = (unsigned short) (rows > 0 ? rows : 24);
    ws.ws_col = (unsigned short) (cols > 0 ? cols : 80);
    ioctl(ptm, TIOCSWINSZ, &ws);

    char *cmd = dup_jstring(env, jcmd);
    char *cwd = dup_jstring(env, jcwd);
    char **argv = dup_array(env, jargs, cmd ? strdup(cmd) : NULL);
    char **envp = dup_array(env, jenv, NULL);
    if (cmd == NULL || argv == NULL || envp == NULL) {
        free(cmd);
        free(cwd);
        free_array(argv);
        free_array(envp);
        close(ptm);
        errno = ENOMEM;
        throw_io(env, "mémoire");
        return NULL;
    }

    pid_t pid = fork();
    if (pid < 0) {
        int err = errno;
        free(cmd);
        free(cwd);
        free_array(argv);
        free_array(envp);
        close(ptm);
        errno = err;
        throw_io(env, "fork");
        return NULL;
    }

    if (pid == 0) {
        /* ----- processus enfant ----- */
        sigset_t set;
        sigemptyset(&set);
        sigprocmask(SIG_SETMASK, &set, NULL);
        for (int s = 1; s < 32; s++) {
            if (s != SIGKILL && s != SIGSTOP) signal(s, SIG_DFL);
        }
        close(ptm);
        setsid();
        int pts = open(devname, O_RDWR);
        if (pts < 0) _exit(126);
        ioctl(pts, TIOCSCTTY, 0);
        dup2(pts, 0);
        dup2(pts, 1);
        dup2(pts, 2);
        if (pts > 2) close(pts);

        DIR *d = opendir("/proc/self/fd");
        if (d) {
            int dfd = dirfd(d);
            struct dirent *e;
            while ((e = readdir(d)) != NULL) {
                int fd = atoi(e->d_name);
                if (fd > 2 && fd != dfd) close(fd);
            }
            closedir(d);
        }

        clearenv();
        for (char **p = envp; *p; p++) putenv(*p);
        if (cwd == NULL || chdir(cwd) != 0) chdir("/");

        execvp(cmd, argv);
        char msg[512];
        int len = snprintf(msg, sizeof msg, "\r\nImpossible de lancer %s : %s\r\n", cmd, strerror(errno));
        if (len > 0) write(2, msg, (size_t) len);
        _exit(127);
    }

    /* ----- processus parent ----- */
    free(cmd);
    free(cwd);
    free_array(argv);
    free_array(envp);

    jintArray result = (*env)->NewIntArray(env, 2);
    if (result == NULL) return NULL;
    jint vals[2] = {(jint) pid, (jint) ptm};
    (*env)->SetIntArrayRegion(env, result, 0, 2, vals);
    return result;
}

JNIEXPORT void JNICALL
Java_fr_apkfold_cyber_Pty_resize(JNIEnv *env, jclass clazz, jint fd, jint rows, jint cols) {
    (void) env;
    (void) clazz;
    struct winsize ws;
    memset(&ws, 0, sizeof ws);
    ws.ws_row = (unsigned short) (rows > 0 ? rows : 1);
    ws.ws_col = (unsigned short) (cols > 0 ? cols : 1);
    ioctl(fd, TIOCSWINSZ, &ws);
}

JNIEXPORT jint JNICALL
Java_fr_apkfold_cyber_Pty_waitFor(JNIEnv *env, jclass clazz, jint pid) {
    (void) env;
    (void) clazz;
    int status = 0;
    while (waitpid(pid, &status, 0) < 0) {
        if (errno != EINTR) return -1;
    }
    if (WIFEXITED(status)) return WEXITSTATUS(status);
    if (WIFSIGNALED(status)) return -WTERMSIG(status);
    return 0;
}

JNIEXPORT void JNICALL
Java_fr_apkfold_cyber_Pty_hangup(JNIEnv *env, jclass clazz, jint pid) {
    (void) env;
    (void) clazz;
    if (pid <= 0) return;
    kill(-pid, SIGHUP); /* tout le groupe de processus de la session */
    kill(pid, SIGHUP);
}

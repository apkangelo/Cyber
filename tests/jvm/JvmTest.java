package fr.apkfold.cyber;

import org.json.JSONObject;

import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Teste sur une JVM le code SSH de l'APK (SshSession + JSch + Bouncy Castle, comme sur Android)
 * et le module C du pseudo-terminal (pty.c compilé pour Linux), contre un serveur OpenSSH local.
 */
public class JvmTest {
    static final class Rec implements SessionEvents {
        final StringBuilder out = new StringBuilder();
        final CountDownLatch done = new CountDownLatch(1);
        volatile SshSession session;
        volatile boolean ready;
        volatile String error;
        volatile Integer code;
        volatile String hostFp;
        volatile boolean hostChanged;
        boolean accept = true;
        String[] script = new String[0];
        String expect;
        boolean sentExit;

        @Override
        public void ready(String id) {
            ready = true;
            for (String line : script) session.write(line.getBytes(StandardCharsets.UTF_8));
        }

        @Override
        public synchronized void emitData(String id, byte[] buf, int len) {
            out.append(new String(buf, 0, len, StandardCharsets.UTF_8));
            if (expect != null && !sentExit && out.indexOf(expect) >= 0) {
                sentExit = true;
                session.write("exit\r".getBytes(StandardCharsets.UTF_8));
            }
        }

        @Override
        public void error(String id, String message) {
            error = message;
        }

        @Override
        public void exit(String id, Integer c) {
            code = c;
            done.countDown();
        }

        @Override
        public void hostKey(String id, String host, int port, String algo, String fingerprint, boolean changed, String expected) {
            hostFp = fingerprint;
            hostChanged = changed;
            System.out.println("  empreinte proposée : " + algo + " " + fingerprint);
            new Thread(() -> session.answerHostKey(accept)).start();
        }
    }

    static int passed = 0;

    static Rec run(String name, JSONObject o, boolean accept, String[] script, String expect, String expectError) throws Exception {
        Rec r = new Rec();
        r.accept = accept;
        r.script = script;
        r.expect = expect;
        r.session = new SshSession(r, "test", o);
        r.session.start();
        if (!r.done.await(40, TimeUnit.SECONDS)) throw new AssertionError(name + " : délai dépassé\n" + r.out);
        if (expectError != null) {
            if (r.error == null || !r.error.contains(expectError))
                throw new AssertionError(name + " : erreur attendue « " + expectError + " », reçu « " + r.error + " »\n" + r.out);
        } else {
            if (r.error != null) throw new AssertionError(name + " : " + r.error + "\n" + r.out);
            if (expect != null && r.out.indexOf(expect) < 0) throw new AssertionError(name + " : « " + expect + " » absent :\n" + r.out);
        }
        System.out.println("✔ " + name);
        passed++;
        return r;
    }

    static JSONObject base() throws Exception {
        JSONObject o = new JSONObject();
        o.put("host", "127.0.0.1");
        o.put("port", 2222);
        o.put("username", "cyber");
        o.put("cols", 100);
        o.put("rows", 30);
        o.put("timeout", 20);
        o.put("keepalive", 0);
        return o;
    }

    public static void main(String[] args) throws Exception {
        String key = new String(Files.readAllBytes(Paths.get(args[0])), StandardCharsets.UTF_8);

        // 1. mot de passe, première connexion : empreinte demandée puis acceptée
        Rec first = run("SSH Android : mot de passe + nouvelle empreinte",
                base().put("password", "cyber"), true, new String[]{"echo android-$((6*7))\r"}, "android-42", null);
        if (first.hostFp == null || !first.hostFp.startsWith("SHA256:") || first.hostChanged)
            throw new AssertionError("empreinte non proposée correctement");
        String known = first.hostFp;

        // 2. empreinte connue : pas de question
        Rec second = run("SSH Android : empreinte mémorisée",
                base().put("password", "cyber").put("knownFingerprint", known), true, new String[]{"echo deux-$((1+1))\r"}, "deux-2", null);
        if (second.hostFp != null) throw new AssertionError("la question d'empreinte n'aurait pas dû revenir");

        // 3. empreinte modifiée refusée
        Rec third = run("SSH Android : empreinte modifiée refusée",
                base().put("password", "cyber").put("knownFingerprint", "SHA256:faux"), false, new String[0], null, "Clé du serveur refusée");
        if (!third.hostChanged) throw new AssertionError("changement d'empreinte non signalé");

        // 4. mauvais mot de passe
        run("SSH Android : mauvais mot de passe",
                base().put("password", "faux").put("knownFingerprint", known), true, new String[0], null, "Authentification refusée");

        // 5. clé Ed25519 générée par l'interface (Bouncy Castle) + commande de démarrage + taille du terminal
        run("SSH Android : clé Ed25519 + commande de démarrage",
                base().put("privateKey", key).put("knownFingerprint", known).put("startupCommand", "echo depart-ok; stty size"),
                true, new String[0], "30 100", null);

        // 6. port fermé
        run("SSH Android : port fermé", base().put("port", 2299).put("password", "x"), true, new String[0], null, "Connexion refusée");

        // 7. pseudo-terminal natif
        testPty();

        System.out.println("Tous les tests Android (JVM) sont passés : " + passed);
        System.exit(0);
    }

    static void testPty() throws Exception {
        int[] r = Pty.start("/bin/sh", new String[0], new String[]{"TERM=xterm-256color", "PATH=/usr/bin:/bin", "HOME=/tmp", "PS1=$ "}, "/tmp", 20, 90);
        FileDescriptor fd = new FileDescriptor();
        Field f = FileDescriptor.class.getDeclaredField("fd");
        f.setAccessible(true);
        f.setInt(fd, r[1]);
        FileInputStream in = new FileInputStream(fd);
        FileOutputStream out = new FileOutputStream(fd);
        StringBuilder sb = new StringBuilder();
        Thread reader = new Thread(() -> {
            byte[] buf = new byte[4096];
            try {
                int n;
                while ((n = in.read(buf)) > 0) synchronized (sb) {
                    sb.append(new String(buf, 0, n, StandardCharsets.UTF_8));
                }
            } catch (IOException ignored) {
            }
        });
        reader.start();
        out.write("echo pty-$((3*4)); stty size\n".getBytes(StandardCharsets.UTF_8));
        waitFor(sb, "20 90");
        if (sb.indexOf("pty-12") < 0) throw new AssertionError("PTY : sortie inattendue\n" + sb);
        Pty.resize(r[1], 30, 100);
        out.write("stty size\n".getBytes(StandardCharsets.UTF_8));
        waitFor(sb, "30 100");
        out.write("exit 3\n".getBytes(StandardCharsets.UTF_8));
        int code = Pty.waitFor(r[0]);
        reader.join(5000);
        if (code != 3) throw new AssertionError("PTY : code de sortie " + code + " au lieu de 3");
        System.out.println("✔ pseudo-terminal natif (exécution, taille, redimensionnement, code de sortie)");
        passed++;
    }

    static void waitFor(StringBuilder sb, String text) throws InterruptedException {
        for (int i = 0; i < 100; i++) {
            synchronized (sb) {
                if (sb.indexOf(text) >= 0) return;
            }
            Thread.sleep(100);
        }
        throw new AssertionError("PTY : « " + text + " » absent :\n" + sb);
    }
}

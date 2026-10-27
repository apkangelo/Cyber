package fr.apkfold.cyber;

import com.jcraft.jsch.ChannelShell;
import com.jcraft.jsch.HostKey;
import com.jcraft.jsch.HostKeyRepository;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.UIKeyboardInteractive;
import com.jcraft.jsch.UserInfo;

import org.json.JSONObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.NoRouteToHostException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/** Session SSH interactive (bibliothèque JSch). */
final class SshSession implements TermSession {
    private final CyberBridge bridge;
    private final String id;
    private final JSONObject o;
    private final ExecutorService io = Executors.newSingleThreadExecutor();

    private volatile Session session;
    private volatile ChannelShell channel;
    private volatile OutputStream out;
    private volatile boolean closed;
    private volatile boolean hostKeyAccepted;
    private volatile CountDownLatch hostKeyLatch;

    SshSession(CyberBridge bridge, String id, JSONObject o) {
        this.bridge = bridge;
        this.id = id;
        this.o = o;
    }

    static String fingerprint(byte[] key) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(key);
            String b64 = android.util.Base64.encodeToString(d, android.util.Base64.NO_WRAP);
            while (b64.endsWith("=")) b64 = b64.substring(0, b64.length() - 1);
            return "SHA256:" + b64;
        } catch (Exception e) {
            return "?";
        }
    }

    static String keyAlgo(byte[] key) {
        try {
            int n = ((key[0] & 255) << 24) | ((key[1] & 255) << 16) | ((key[2] & 255) << 8) | (key[3] & 255);
            return new String(key, 4, n, StandardCharsets.US_ASCII);
        } catch (Exception e) {
            return "";
        }
    }

    @Override
    public void start() {
        Thread t = new Thread(this::run, "cyber-ssh-" + id);
        t.setDaemon(true);
        t.start();
    }

    private void run() {
        Integer exitCode = null;
        boolean failed = false;
        try {
            final String host = o.getString("host").trim();
            final int port = o.optInt("port", 22);
            final String user = o.getString("username");
            final String password = o.optString("password", "");
            final String privateKey = o.optString("privateKey", "");
            final String passphrase = o.optString("passphrase", "");
            final String known = o.optString("knownFingerprint", "");
            final int timeout = Math.max(5, o.optInt("timeout", 20)) * 1000;
            final int keepalive = Math.max(0, o.optInt("keepalive", 30)) * 1000;

            JSch jsch = new JSch();
            jsch.setHostKeyRepository(new PromptingRepository(host, port, known));
            if (!privateKey.isEmpty()) {
                try {
                    jsch.addIdentity("cle-cyber", privateKey.getBytes(StandardCharsets.UTF_8), null,
                            passphrase.isEmpty() ? null : passphrase.getBytes(StandardCharsets.UTF_8));
                } catch (JSchException e) {
                    throw new JSchException("invalid privatekey: " + e.getMessage());
                }
            }

            Session s = jsch.getSession(user, host, port);
            session = s;
            s.setUserInfo(new Prompts(password, passphrase));
            if (!password.isEmpty()) s.setPassword(password);
            Properties cfg = new Properties();
            cfg.put("StrictHostKeyChecking", "yes");
            cfg.put("PreferredAuthentications", privateKey.isEmpty()
                    ? "password,keyboard-interactive,publickey"
                    : "publickey,keyboard-interactive,password");
            s.setConfig(cfg);
            if (keepalive > 0) {
                s.setServerAliveInterval(keepalive);
                s.setServerAliveCountMax(3);
            }
            s.connect(timeout);
            if (closed) return;

            ChannelShell ch = (ChannelShell) s.openChannel("shell");
            channel = ch;
            ch.setPtyType("xterm-256color", Math.max(1, o.optInt("cols", 80)), Math.max(1, o.optInt("rows", 24)), 0, 0);
            InputStream in = ch.getInputStream();
            out = ch.getOutputStream();
            ch.connect(timeout);
            bridge.ready(id);

            String startup = o.optString("startupCommand", "");
            if (!startup.isEmpty()) write((startup + "\r").getBytes(StandardCharsets.UTF_8));

            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) >= 0) {
                if (n > 0) bridge.emitData(id, buf, n);
            }
            int st = ch.getExitStatus();
            if (st >= 0) exitCode = st;
        } catch (Exception e) {
            if (!closed) {
                failed = true;
                bridge.error(id, friendly(e));
            }
        } finally {
            disconnect();
            bridge.exit(id, failed ? null : exitCode);
        }
    }

    static String friendly(Throwable e) {
        Throwable c = e;
        while (c.getCause() != null && c.getCause() != c) c = c.getCause();
        String msg = String.valueOf(e.getMessage());
        if (c instanceof UnknownHostException || msg.contains("UnknownHostException")) return "Hôte introuvable : vérifie l’adresse.";
        if (c instanceof ConnectException || msg.contains("Connection refused")) return "Connexion refusée : le port est fermé ou SSH n’est pas démarré sur le serveur.";
        if (c instanceof NoRouteToHostException) return "Serveur injoignable depuis ce réseau.";
        if (c instanceof SocketTimeoutException || msg.toLowerCase().contains("timeout")) return "Délai dépassé : le serveur ne répond pas.";
        if (msg.contains("Auth fail") || msg.contains("Auth cancel")) return "Authentification refusée : utilisateur, mot de passe ou clé incorrect.";
        if (msg.contains("HostKey") || msg.contains("UnknownHostKey") || msg.contains("reject HostKey")) return "Clé du serveur refusée.";
        if (msg.contains("invalid privatekey") || msg.contains("passphrase")) return "Clé privée illisible, ou phrase de passe manquante ou incorrecte.";
        if (msg.contains("Algorithm negotiation fail")) return "Aucun algorithme commun avec le serveur.";
        return msg;
    }

    @Override
    public void write(byte[] data) {
        if (closed) return;
        try {
            io.execute(() -> {
                OutputStream o2 = out;
                if (o2 == null) return;
                try {
                    o2.write(data);
                    o2.flush();
                } catch (Exception ignored) {
                }
            });
        } catch (Exception ignored) {
        }
    }

    @Override
    public void resize(int cols, int rows) {
        if (closed) return;
        try {
            io.execute(() -> {
                ChannelShell ch = channel;
                if (ch != null && ch.isConnected()) ch.setPtySize(Math.max(1, cols), Math.max(1, rows), 0, 0);
            });
        } catch (Exception ignored) {
        }
    }

    @Override
    public void close() {
        if (closed) return;
        closed = true;
        answerHostKey(false);
        new Thread(this::disconnect, "cyber-ssh-close").start();
    }

    @Override
    public void answerHostKey(boolean accepted) {
        hostKeyAccepted = accepted;
        CountDownLatch l = hostKeyLatch;
        if (l != null) l.countDown();
    }

    private void disconnect() {
        try {
            ChannelShell ch = channel;
            if (ch != null) ch.disconnect();
        } catch (Exception ignored) {
        }
        try {
            Session s = session;
            if (s != null) s.disconnect();
        } catch (Exception ignored) {
        }
        io.shutdownNow();
    }

    /** Vérifie l'empreinte du serveur ; si elle est inconnue ou a changé, demande à l'utilisateur. */
    private final class PromptingRepository implements HostKeyRepository {
        private final String host;
        private final int port;
        private final String known;

        PromptingRepository(String host, int port, String known) {
            this.host = host;
            this.port = port;
            this.known = known;
        }

        @Override
        public int check(String h, byte[] key) {
            String fp = fingerprint(key);
            if (!known.isEmpty() && known.equals(fp)) return OK;
            CountDownLatch latch = new CountDownLatch(1);
            hostKeyLatch = latch;
            hostKeyAccepted = false;
            bridge.hostKey(id, host, port, keyAlgo(key), fp, !known.isEmpty(), known);
            try {
                if (!latch.await(5, TimeUnit.MINUTES)) return NOT_INCLUDED;
            } catch (InterruptedException e) {
                return NOT_INCLUDED;
            }
            if (closed) return NOT_INCLUDED;
            return hostKeyAccepted ? OK : (known.isEmpty() ? NOT_INCLUDED : CHANGED);
        }

        @Override
        public void add(HostKey hostkey, UserInfo ui) {
        }

        @Override
        public void remove(String host, String type) {
        }

        @Override
        public void remove(String host, String type, byte[] key) {
        }

        @Override
        public String getKnownHostsRepositoryID() {
            return "cyber";
        }

        @Override
        public HostKey[] getHostKey() {
            return new HostKey[0];
        }

        @Override
        public HostKey[] getHostKey(String host, String type) {
            return new HostKey[0];
        }
    }

    /** Réponses automatiques aux demandes de JSch (mot de passe, phrase de passe, keyboard-interactive). */
    private static final class Prompts implements UserInfo, UIKeyboardInteractive {
        private final String password;
        private final String passphrase;

        Prompts(String password, String passphrase) {
            this.password = password;
            this.passphrase = passphrase;
        }

        @Override
        public String getPassphrase() {
            return passphrase;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public boolean promptPassword(String message) {
            return !password.isEmpty();
        }

        @Override
        public boolean promptPassphrase(String message) {
            return !passphrase.isEmpty();
        }

        @Override
        public boolean promptYesNo(String message) {
            return false;
        }

        @Override
        public void showMessage(String message) {
        }

        @Override
        public String[] promptKeyboardInteractive(String destination, String name, String instruction, String[] prompt, boolean[] echo) {
            if (password.isEmpty()) return null;
            String[] r = new String[prompt.length];
            Arrays.fill(r, password);
            return r;
        }
    }
}

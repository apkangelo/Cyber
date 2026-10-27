package fr.apkfold.cyber;

import android.content.Context;
import android.os.ParcelFileDescriptor;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Shell local Android (mksh) dans un vrai pseudo-terminal. */
final class LocalSession implements TermSession {
    private final CyberBridge bridge;
    private final String id;
    private final JSONObject opts;
    private final Context ctx;
    private final ExecutorService writer = Executors.newSingleThreadExecutor();

    private int pid = -1;
    private int fd = -1;
    private ParcelFileDescriptor pfd;
    private FileOutputStream out;
    private volatile boolean closed;

    LocalSession(CyberBridge bridge, String id, JSONObject opts, Context ctx) {
        this.bridge = bridge;
        this.id = id;
        this.opts = opts;
        this.ctx = ctx;
    }

    static List<String> splitArgs(String text) {
        List<String> out = new ArrayList<>();
        if (text == null) return out;
        Matcher m = Pattern.compile("\"([^\"]*)\"|'([^']*)'|(\\S+)").matcher(text);
        while (m.find()) {
            if (m.group(1) != null) out.add(m.group(1));
            else if (m.group(2) != null) out.add(m.group(2));
            else out.add(m.group(3));
        }
        return out;
    }

    @Override
    public void start() throws IOException {
        String cmd = opts.optString("command", "").trim();
        if (cmd.isEmpty()) cmd = "/system/bin/sh";
        List<String> args = splitArgs(opts.optString("args", ""));

        File files = ctx.getFilesDir();
        File home = new File(files, "home");
        //noinspection ResultOfMethodCallIgnored
        home.mkdirs();
        File rc = new File(files, ".cyberrc");
        try (FileOutputStream fos = new FileOutputStream(rc)) {
            fos.write(opts.optString("rc", "").getBytes(StandardCharsets.UTF_8));
        }

        String cwdText = opts.optString("cwd", "").trim();
        File cwd = cwdText.isEmpty() ? home : new File(cwdText);
        if (!cwd.isDirectory()) cwd = home;

        Map<String, String> env = new TreeMap<>(System.getenv());
        env.put("TERM", "xterm-256color");
        env.put("COLORTERM", "truecolor");
        env.put("TERM_PROGRAM", "Cyber");
        env.put("HOME", home.getAbsolutePath());
        env.put("TMPDIR", ctx.getCacheDir().getAbsolutePath());
        env.put("ENV", rc.getAbsolutePath());
        env.put("SHELL", cmd);
        env.put("LANG", "C.UTF-8");
        if (!env.containsKey("PATH")) {
            env.put("PATH", "/product/bin:/apex/com.android.runtime/bin:/apex/com.android.art/bin:/system_ext/bin:/system/bin:/system/xbin:/odm/bin:/vendor/bin:/vendor/xbin");
        }
        String[] envArr = new String[env.size()];
        int i = 0;
        for (Map.Entry<String, String> e : env.entrySet()) envArr[i++] = e.getKey() + "=" + e.getValue();

        int cols = Math.max(1, opts.optInt("cols", 80));
        int rows = Math.max(1, opts.optInt("rows", 24));
        int[] r = Pty.start(cmd, args.toArray(new String[0]), envArr, cwd.getAbsolutePath(), rows, cols);
        pid = r[0];
        fd = r[1];
        pfd = ParcelFileDescriptor.adoptFd(fd);
        final FileInputStream in = new FileInputStream(pfd.getFileDescriptor());
        out = new FileOutputStream(pfd.getFileDescriptor());
        bridge.ready(id);

        Thread reader = new Thread(() -> {
            byte[] buf = new byte[16384];
            try {
                int n;
                while ((n = in.read(buf)) > 0) bridge.emitData(id, buf, n);
            } catch (IOException ignored) {
                // EIO : le shell s'est terminé
            }
            int code = Pty.waitFor(pid);
            cleanup();
            bridge.exit(id, code);
        }, "cyber-local-" + id);
        reader.setDaemon(true);
        reader.start();
    }

    @Override
    public void write(byte[] data) {
        if (closed || out == null) return;
        writer.execute(() -> {
            try {
                out.write(data);
            } catch (IOException ignored) {
            }
        });
    }

    @Override
    public void resize(int cols, int rows) {
        if (fd >= 0 && !closed) Pty.resize(fd, rows, cols);
    }

    @Override
    public void close() {
        if (closed) return;
        closed = true;
        if (pid > 0) Pty.hangup(pid);
        writer.shutdownNow();
    }

    @Override
    public void answerHostKey(boolean accepted) {
    }

    private synchronized void cleanup() {
        closed = true;
        writer.shutdownNow();
        try {
            if (pfd != null) pfd.close();
        } catch (IOException ignored) {
        }
        pfd = null;
        fd = -1;
    }
}

package fr.apkfold.cyber;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Objet exposé à l'interface web sous le nom « CyberAndroid ». */
final class CyberBridge implements SessionEvents {
    private final MainActivity activity;
    private final WebView web;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final Map<String, TermSession> sessions = new ConcurrentHashMap<>();

    // regroupement des sorties pour limiter les appels à la WebView
    private final Object lock = new Object();
    private final Map<String, ByteArrayOutputStream> pending = new LinkedHashMap<>();
    private boolean flushScheduled;

    CyberBridge(MainActivity activity, WebView web) {
        this.activity = activity;
        this.web = web;
    }

    private static String message(Throwable t) {
        String m = t.getMessage();
        return m == null || m.isEmpty() ? t.getClass().getSimpleName() : m;
    }

    /* ---------------- appels depuis JavaScript ---------------- */

    @JavascriptInterface
    public String info() {
        JSONObject o = new JSONObject();
        try {
            PackageInfo pi = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0);
            o.put("version", pi.versionName);
            o.put("platform", "android");
            o.put("sdk", Build.VERSION.SDK_INT);
            o.put("device", Build.MANUFACTURER + " " + Build.MODEL);
            o.put("abi", Build.SUPPORTED_ABIS.length > 0 ? Build.SUPPORTED_ABIS[0] : "");
        } catch (Exception ignored) {
        }
        return o.toString();
    }

    @JavascriptInterface
    public String openLocal(String id, String json) {
        try {
            LocalSession s = new LocalSession(this, id, new JSONObject(json), activity);
            sessions.put(id, s);
            s.start();
            return "";
        } catch (Throwable t) {
            sessions.remove(id);
            return "Impossible de lancer le shell local : " + message(t);
        }
    }

    @JavascriptInterface
    public String openSsh(String id, String json) {
        try {
            SshSession s = new SshSession(this, id, new JSONObject(json));
            sessions.put(id, s);
            s.start();
            return "";
        } catch (Throwable t) {
            sessions.remove(id);
            return message(t);
        }
    }

    @JavascriptInterface
    public void write(String id, String data) {
        TermSession s = sessions.get(id);
        if (s != null && data != null) s.write(data.getBytes(StandardCharsets.UTF_8));
    }

    @JavascriptInterface
    public void resize(String id, int cols, int rows) {
        TermSession s = sessions.get(id);
        if (s != null) s.resize(cols, rows);
    }

    @JavascriptInterface
    public void close(String id) {
        TermSession s = sessions.remove(id);
        if (s != null) s.close();
        main.post(this::syncKeepAlive);
    }

    @JavascriptInterface
    public void answerHostKey(String id, boolean accepted) {
        TermSession s = sessions.get(id);
        if (s != null) s.answerHostKey(accepted);
    }

    @JavascriptInterface
    public void copy(String text) {
        main.post(() -> {
            ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("Cyber", text));
        });
    }

    @JavascriptInterface
    public String paste() {
        try {
            ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
            if (cm == null || !cm.hasPrimaryClip() || cm.getPrimaryClip() == null) return "";
            ClipData clip = cm.getPrimaryClip();
            if (clip.getItemCount() == 0) return "";
            CharSequence t = clip.getItemAt(0).coerceToText(activity);
            return t == null ? "" : t.toString();
        } catch (Exception e) {
            return "";
        }
    }

    @JavascriptInterface
    public void openExternal(String url) {
        if (url == null || !(url.startsWith("http://") || url.startsWith("https://"))) return;
        main.post(() -> {
            try {
                activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            } catch (Exception ignored) {
            }
        });
    }

    @JavascriptInterface
    public void vibrate(int ms) {
        try {
            Vibrator v = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            v.vibrate(VibrationEffect.createOneShot(Math.max(1, Math.min(ms, 500)), VibrationEffect.DEFAULT_AMPLITUDE));
        } catch (Exception ignored) {
        }
    }

    @JavascriptInterface
    public void setActiveSessions(int count) {
        main.post(() -> activity.updateKeepAlive(count));
    }

    @JavascriptInterface
    public void setBarColor(String hex) {
        main.post(() -> activity.setBarColor(hex));
    }

    @JavascriptInterface
    public void shareText(String name, String text) {
        main.post(() -> {
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_TEXT, text);
            send.putExtra(Intent.EXTRA_SUBJECT, name);
            send.putExtra(Intent.EXTRA_TITLE, name);
            try {
                activity.startActivity(Intent.createChooser(send, "Enregistrer la sauvegarde"));
            } catch (Exception ignored) {
            }
        });
    }

    /* ---------------- évènements vers JavaScript ---------------- */

    @Override
    public void emitData(String id, byte[] buf, int len) {
        synchronized (lock) {
            ByteArrayOutputStream b = pending.get(id);
            if (b == null) {
                b = new ByteArrayOutputStream(Math.max(len, 4096));
                pending.put(id, b);
            }
            b.write(buf, 0, len);
            if (!flushScheduled) {
                flushScheduled = true;
                main.postDelayed(this::flush, 8);
            }
        }
    }

    /** Doit être appelé sur le fil principal. */
    private void flush() {
        Map<String, byte[]> batch = new LinkedHashMap<>();
        synchronized (lock) {
            flushScheduled = false;
            for (Map.Entry<String, ByteArrayOutputStream> e : pending.entrySet()) batch.put(e.getKey(), e.getValue().toByteArray());
            pending.clear();
        }
        for (Map.Entry<String, byte[]> e : batch.entrySet()) {
            try {
                JSONObject ev = new JSONObject();
                ev.put("type", "data");
                ev.put("id", e.getKey());
                ev.put("b64", Base64.encodeToString(e.getValue(), Base64.NO_WRAP));
                eval(ev);
            } catch (Exception ignored) {
            }
        }
    }

    private void eval(JSONObject ev) {
        web.evaluateJavascript("window.__cyberEvent && window.__cyberEvent(" + JSONObject.quote(ev.toString()) + ")", null);
    }

    /** Les autres évènements passent après les données en attente, pour garder l'ordre. */
    private void emit(JSONObject ev) {
        main.post(() -> {
            flush();
            eval(ev);
        });
    }

    private static JSONObject event(String type, String id) {
        JSONObject o = new JSONObject();
        try {
            o.put("type", type);
            o.put("id", id);
        } catch (Exception ignored) {
        }
        return o;
    }

    @Override
    public void ready(String id) {
        emit(event("ready", id));
    }

    void status(String id, String text) {
        JSONObject o = event("status", id);
        try {
            o.put("text", text);
        } catch (Exception ignored) {
        }
        emit(o);
    }

    @Override
    public void error(String id, String message) {
        JSONObject o = event("error", id);
        try {
            o.put("message", message);
        } catch (Exception ignored) {
        }
        emit(o);
    }

    @Override
    public void hostKey(String id, String host, int port, String algo, String fingerprint, boolean changed, String expected) {
        JSONObject o = event("hostkey", id);
        try {
            o.put("host", host);
            o.put("port", port);
            o.put("algo", algo);
            o.put("fingerprint", fingerprint);
            o.put("changed", changed);
            o.put("expected", expected);
        } catch (Exception ignored) {
        }
        emit(o);
    }

    @Override
    public void exit(String id, Integer code) {
        sessions.remove(id);
        JSONObject o = event("exit", id);
        try {
            o.put("code", code == null ? JSONObject.NULL : code);
        } catch (Exception ignored) {
        }
        emit(o);
        main.post(this::syncKeepAlive);
    }

    private void syncKeepAlive() {
        if (sessions.isEmpty()) activity.updateKeepAlive(0);
    }

    void closeAll() {
        for (TermSession s : sessions.values()) {
            try {
                s.close();
            } catch (Exception ignored) {
            }
        }
        sessions.clear();
    }
}

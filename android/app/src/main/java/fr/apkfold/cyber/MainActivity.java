package fr.apkfold.cyber;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/** Fenêtre unique : une WebView qui affiche l'interface de Cyber (assets/www). */
public class MainActivity extends Activity {
    private static final String START_URL = "https://appassets.androidplatform.net/assets/www/index.html";
    private static final int REQ_FILE = 42;
    private static final int REQ_NOTIF = 43;

    private WebView web;
    private CyberBridge bridge;
    private ValueCallback<Uri[]> fileCallback;
    private boolean keepAliveRunning;
    private boolean askedNotifications;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        setBarColor("#130d1f");

        web = new WebView(this);
        web.setBackgroundColor(0xFF0B0614);
        setContentView(web);

        if ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) WebView.setWebContentsDebuggingEnabled(true);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("appassets.androidplatform.net".equals(u.getHost())) return false;
                String scheme = u.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, u));
                    } catch (ActivityNotFoundException ignored) {
                    }
                }
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = params.createIntent();
                intent.setType("*/*");
                try {
                    startActivityForResult(intent, REQ_FILE);
                    return true;
                } catch (ActivityNotFoundException e) {
                    fileCallback = null;
                    return false;
                }
            }
        });

        bridge = new CyberBridge(this, web);
        web.addJavascriptInterface(bridge, "CyberAndroid");
        web.loadUrl(START_URL);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            fileCallback = null;
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("!!(window.__cyberBack && window.__cyberBack())", value -> {
            if (!"true".equals(value)) moveTaskToBack(true);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onPause() {
        // on ne met pas la WebView en pause : les sessions continuent d'afficher leur sortie
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (bridge != null) bridge.closeAll();
        updateKeepAlive(0);
        if (web != null) {
            web.removeJavascriptInterface("CyberAndroid");
            web.destroy();
        }
        super.onDestroy();
    }

    /** Couleur des barres système assortie au thème. */
    @SuppressWarnings("deprecation")
    void setBarColor(String hex) {
        int color;
        try {
            color = Color.parseColor(hex);
        } catch (Exception e) {
            return;
        }
        Window w = getWindow();
        w.setStatusBarColor(color);
        w.setNavigationBarColor(color);
        double lum = (0.299 * Color.red(color) + 0.587 * Color.green(color) + 0.114 * Color.blue(color)) / 255.0;
        boolean light = lum > 0.6;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
                c.setSystemBarsAppearance(light ? mask : 0, mask);
            }
        } else {
            View d = w.getDecorView();
            int flags = d.getSystemUiVisibility();
            int mask = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            d.setSystemUiVisibility(light ? (flags | mask) : (flags & ~mask));
        }
    }

    /** Service au premier plan tant que des sessions sont ouvertes, pour qu'Android ne les coupe pas. */
    void updateKeepAlive(int count) {
        if (count > 0) {
            if (!askedNotifications && Build.VERSION.SDK_INT >= 33
                    && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                askedNotifications = true;
                requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
            }
            if (keepAliveRunning) {
                KeepAliveService.update(this, count);
            } else {
                try {
                    Intent i = new Intent(this, KeepAliveService.class).putExtra("count", count);
                    startForegroundService(i);
                    keepAliveRunning = true;
                } catch (Exception ignored) {
                    // démarrage refusé (appli en arrière-plan) : on réessaiera à la prochaine session
                }
            }
        } else if (keepAliveRunning) {
            stopService(new Intent(this, KeepAliveService.class));
            keepAliveRunning = false;
        }
    }
}

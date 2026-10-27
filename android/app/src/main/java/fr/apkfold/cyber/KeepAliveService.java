package fr.apkfold.cyber;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

/** Notification permanente qui garde les sessions vivantes quand Cyber passe en arrière-plan. */
public class KeepAliveService extends Service {
    private static final String CHANNEL = "cyber_sessions";
    private static final int NOTIF_ID = 1;

    private static void ensureChannel(Context ctx) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null && nm.getNotificationChannel(CHANNEL) == null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Sessions ouvertes", NotificationManager.IMPORTANCE_LOW);
            ch.setDescription("Indique que des sessions de terminal restent actives");
            ch.setShowBadge(false);
            nm.createNotificationChannel(ch);
        }
    }

    private static Notification build(Context ctx, int count) {
        Intent open = new Intent(ctx, MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        String text = count <= 1 ? "1 session ouverte" : count + " sessions ouvertes";
        return new Notification.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_cyber)
                .setContentTitle("Cyber")
                .setContentText(text)
                .setOngoing(true)
                .setShowWhen(false)
                .setContentIntent(pi)
                .build();
    }

    static void update(Context ctx, int count) {
        ensureChannel(ctx);
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            try {
                nm.notify(NOTIF_ID, build(ctx, count));
            } catch (SecurityException ignored) {
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        int count = intent != null ? intent.getIntExtra("count", 1) : 1;
        ensureChannel(this);
        Notification n = build(this, count);
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(NOTIF_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        } else {
            startForeground(NOTIF_ID, n);
        }
        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

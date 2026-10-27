package fr.apkfold.cyber;

/** Évènements qu'une session renvoie vers l'interface (implémenté par CyberBridge, et par les tests). */
interface SessionEvents {
    void ready(String id);

    void emitData(String id, byte[] buf, int len);

    void error(String id, String message);

    void exit(String id, Integer code);

    void hostKey(String id, String host, int port, String algo, String fingerprint, boolean changed, String expected);
}

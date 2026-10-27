package fr.apkfold.cyber;

/** Une session de terminal (shell local ou SSH) pilotée depuis l'interface. */
interface TermSession {
    void start() throws Exception;

    void write(byte[] data);

    void resize(int cols, int rows);

    void close();

    void answerHostKey(boolean accepted);
}

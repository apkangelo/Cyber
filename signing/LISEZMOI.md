# Clé de signature de l'APK

`cyber.jks` (PKCS12, alias `cyber`, mot de passe `cyber-apk-fold`) signe toutes les versions de l'APK pour que les
mises à jour s'installent par-dessus la version précédente.

Elle est publique : n'importe qui peut signer un APK avec. Pour une clé privée, voir la section « Signature de
l'APK » du README (secrets GitHub `CYBER_KEYSTORE_B64`, `CYBER_KEYSTORE_PASSWORD`, `CYBER_KEY_ALIAS`,
`CYBER_KEY_PASSWORD`).

#!/bin/bash

set -e

# === CONFIGURATION ===
CERTS_DIR="/certs"
MYSQL_HOST="${2:-mysql}"

# === FONCTIONS ===

# Génère tous les certificats SSL pour MySQL
generate_certs() {
    if [ -d "$CERTS_DIR" ] && [ -f "$CERTS_DIR/ca.pem" ] && [ -f "$CERTS_DIR/server-cert.pem" ] && [ -f "$CERTS_DIR/client-cert.pem" ]; then
        echo "✅ SSL certificates already exist, skipping generation"
        return 0
    fi

    echo "🔐 Generating SSL certificates for MySQL..."

    mkdir -p "$CERTS_DIR"
    cd "$CERTS_DIR"
    
    # Générer la CA (Certificate Authority)
    echo "📋 Generating CA certificate..."
    openssl genrsa 2048 > ca-key.pem 2>/dev/null
    openssl req -new -x509 -nodes -days 3650 -key ca-key.pem -out ca.pem -subj "/CN=mysql-ca" 2>/dev/null
    
    # Générer la clé et le certificat du serveur
    echo "🖥️ Generating server certificate for $MYSQL_HOST..."
    openssl req -newkey rsa:2048 -days 3650 -nodes -keyout server-key.pem -out server-req.pem -subj "/CN=$MYSQL_HOST" 2>/dev/null
    openssl x509 -req -in server-req.pem -days 3650 -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem 2>/dev/null
    
    # Générer la clé et le certificat du client
    echo "👤 Generating client certificate..."
    openssl req -newkey rsa:2048 -days 3650 -nodes -keyout client-key.pem -out client-req.pem -subj "/CN=client" 2>/dev/null
    openssl x509 -req -in client-req.pem -days 3650 -CA ca.pem -CAkey ca-key.pem -set_serial 02 -out client-cert.pem 2>/dev/null
    
    # Nettoyer les fichiers temporaires
    rm server-req.pem client-req.pem
    echo "✅ Certs successfully generated"
}

# Supprime tous les certificats existants
reset_certs() {
    echo "🧹 Resetting certs..."
    rm -rf "$CERTS_DIR/*"
    echo "🫧 Certs reset"
}

# Recrée complètement les certificats (reset + generate)
reload_certs() {
    reset_certs
    generate_certs
}

# === MAIN ===

case "$1" in
    setup)
        generate_certs
        ;;
    reset)
        reset_certs
        ;;
    reload)
        reload_certs
        ;;
    *)
        echo "Usage: $0 {setup|reset|reload} [mysql_host]"
        echo ""
        echo "  setup       - Génère les certificats SSL pour MySQL"
        echo "  reset       - Supprime tous les certificats"
        echo "  reload      - Reset + setup (recrée complètement)"
        echo ""
        echo "  mysql_host  - Nom du serveur MySQL (défaut: mysql)"
        exit 1
        ;;
esac
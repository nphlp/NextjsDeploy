# VPN pour Prisma Studio

[Home](../README.md) > [VPN Prisma Studio](./vpn-prisma-studio.md)

Ce guide explique comment accéder à Prisma Studio sur le VPS via un VPN WireGuard sécurisé.

## Résumé des étapes

| #   | Étape                                                                      | Où         |
| --- | -------------------------------------------------------------------------- | ---------- |
| 1   | [Générer le hash Basic Auth](#1-générer-le-hash-basic-auth)                | Mac        |
| 2   | [Configurer WireGuard serveur](#2-configurer-wireguard-sur-le-vps-serveur) | VPS        |
| 3   | [Configurer WireGuard client](#3-configurer-wireguard-sur-le-mac-client)   | Mac        |
| 4   | [Échanger les clés publiques](#échange-des-clés)                           | VPS ↔ Mac  |
| 5   | [Configurer le DNS Cloudflare](#4-configurer-le-dns-cloudflare)            | Cloudflare |
| 6   | [Déployer Prisma Studio](#5-déployer-prisma-studio)                        | VPS        |

## Échange des clés

Après avoir généré les clés sur le VPS et le Mac :

- **Clé publique Mac** (`mac.pub`) → copier dans `wg0.conf` du VPS (section `[Peer]`)
- **Clé publique VPS** (`server.pub`) → copier dans `wg0.conf` du Mac (section `[Peer]`)

---

## 1. Générer le hash Basic Auth

Prisma Studio est protégé par une authentification Basic Auth via Traefik.

- Installer `htpasswd`

```bash
# Mac
brew install httpd
# Ubuntu
apt install apache2-utils
```

- Générer le hash avec `htpasswd`

```bash
# Générer le hash
htpasswd -nb admin mon-mot-de-passe
# Output: admin:$apr1$xyz123$abcdefghijk...
```

- Générer les variables d'un environnement

```bash
make merge-env-production
```

```env
PRISMA_STUDIO_AUTH=admin:$$apr1$$xyz123$$abcdefghijk...
```

Pour générr

## 2. Configurer WireGuard sur le VPS (serveur)

### Installation

```bash
apt update && apt install wireguard -y
```

### Générer les clés

```bash
mkdir -p /etc/wireguard
cd /etc/wireguard
wg genkey | tee server.key | wg pubkey > server.pub
chmod 600 server.key

# Afficher les clés
cat server.key  # À mettre dans la config du server
cat server.pub  # À mettre dans la config du client
```

### Configuration `/etc/wireguard/wg0.conf`

```bash
cd /etc/wireguard
touch wg0.conf
nano wg0.conf
```

```ini
[Interface]
Address = 10.8.0.1/24
ListenPort = 51820
PrivateKey = <server.key>

# Mac client
[Peer]
PublicKey = <mac.pub>
AllowedIPs = 10.8.0.2/32
```

### Ouvrir le port sur le firewall (Hostinger hPanel)

Ajouter une règle dans le firewall Hostinger :

| Action | Protocole | Port  | Source |
| ------ | --------- | ----- | ------ |
| accept | UDP       | 51820 | any    |

Redémarrer le VPS !

### Activer le service

```bash
# Activer et démarrer
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

# Vérifier le status
wg show
```

## 3. Configurer WireGuard sur le Mac (client)

### Installation

```bash
brew install wireguard-tools
```

### Générer les clés

```bash
sudo mkdir -p /usr/local/etc/wireguard
cd /usr/local/etc/wireguard
sudo sh -c 'wg genkey | tee mac.key | wg pubkey > mac.pub'
sudo chmod 600 mac.key

sudo cat mac.key # À mettre dans la config du client
cat mac.pub      # À mettre dans la config du server
```

### Configuration `/usr/local/etc/wireguard/wg0.conf`

```bash
cd /usr/local/etc/wireguard
sudo touch wg0.conf
sudo nano wg0.conf
```

```ini
[Interface]
Address = 10.8.0.2/24
PrivateKey = <mac.key>

[Peer]
PublicKey = <server.pub>
Endpoint = <IP_VPS>:51820
AllowedIPs = 10.8.0.0/24
PersistentKeepalive = 25
```

### Commandes pour tester la connexion

> `bash` est requis car macOS a bash 3.2, mais wg-quick nécessite bash 4+.
> brew install bash (si nécessaire)

```bash
# Connecter (macOS nécessite bash 4+)
sudo /opt/homebrew/bin/bash $(which wg-quick) up wg0

# Vérifier la connexion
sudo wg show
ping 10.8.0.1

# Déconnecter
sudo /opt/homebrew/bin/bash $(which wg-quick) down wg0
```

## 4. Configurer le DNS (Cloudflare)

Ajouter un record DNS pour router les sous-domaines `*.studio` vers l'IP VPN :

| Proxy          | Type | Name       | Content  |
| -------------- | ---- | ---------- | -------- |
| OFF (DNS only) | A    | `*.studio` | 10.8.0.1 |

Le wildcard `*.nansp.dev` existant (IP publique) a une priorité plus basse que le record spécifique `*.studio`.

## 5. Déployer Prisma Studio

Une fois que le VPN fonctionne et que la règle DNS est configurée : déployer l'environnement Prisma Studio sur Dokploy.

## Utilisation

1. **Connecter le VPN**
2. **Accéder à Prisma Studio** : `https://<ENV_LABEL>.studio.<DOMAIN>`
3. **S'authentifier** avec les identifiants Basic Auth

### Ajouter des alias

Ajouter les alias dans le `.bash_profile` ou `.zshrc` :

```bash
alias vpn-dokploy-up='sudo /opt/homebrew/bin/bash $(which wg-quick) up wg0'
alias vpn-dokploy-down='sudo /opt/homebrew/bin/bash $(which wg-quick) down wg0'
```

Puis lancer et couper avec les alias :

```bash
vpn-dokploy-up
vpn-dokploy-down
```

### Exemples d'URLs

| Environnement | URL                                                 |
| ------------- | --------------------------------------------------- |
| experiment    | `https://experiment-nextjs-deploy.studio.nansp.dev` |
| preview       | `https://preview-nextjs-deploy.studio.nansp.dev`    |
| production    | `https://nextjs-deploy.studio.nansp.dev`            |

## Dépannage

### Le navigateur bloque l'accès HTTP

Tapper `thisisunsafe` sur la page de warning pour forcer l'accès.

### Le VPN ne se connecte pas

```bash
# Vérifier que WireGuard tourne sur le VPS
sudo wg show

# Vérifier que le port 51820/UDP est ouvert dans le firewall Hostinger hPanel
```

### Impossible d'accéder à Prisma Studio

```bash
# Vérifier la connexion VPN
ping 10.8.0.1

# Vérifier que le conteneur tourne
docker ps | grep prisma-studio

# Vérifier les logs Traefik
docker logs traefik 2>&1 | grep prisma
```

### Certificat SSL invalide

Traefik génère automatiquement les certificats Let's Encrypt. Attendre quelques minutes après le premier déploiement.

## Sécurité

| Couche      | Protection                                                |
| ----------- | --------------------------------------------------------- |
| Réseau      | VPN WireGuard (IP 10.8.0.1 accessible uniquement via VPN) |
| Application | Basic Auth Traefik                                        |
| Transport   | HTTPS (Let's Encrypt)                                     |

Prisma Studio est protégé par 3 couches de sécurité.

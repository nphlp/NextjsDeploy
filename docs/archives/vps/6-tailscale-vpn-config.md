# Tailscale VPN Config

[Home](../README.md) > [Tailscale VPN Config](./tailscale-vpn-config.md)

## Objectif

Protéger les environnements sensibles via un VPN Tailscale :

- `prisma-studio.*.domain.com` - Prisma Studio (accès base de données)
- `preview.*.domain.com` - Environnements de preview
- `experiment.*.domain.com` - Environnements d'expérimentation
- `traefik.domain.com` - Dashboard Traefik
- `dokploy.domain.com` - Panel Dokploy

Seuls les appareils connectés au réseau Tailscale peuvent accéder à ces routes.

## 1. Installer Tailscale sur le VPS

Tailscale est intégré nativement à Dokploy.

**Suivre le guide officiel** : [Dokploy - Tailscale Integration](https://docs.dokploy.com/docs/core/guides/tailscale)

## 2. Configurer les DNS (Hostinger)

Récupérer l'IP Tailscale du VPS :

```bash
sudo tailscale ip -4
# Ex: 100.x.x.x
```

Configurer les records DNS pour chaque projet :

**Wildcards → IP Tailscale (protégé) :**
| Type | Name | Points to |
| ---- | ----------------- | ---------- |
| A | `*.nextjs-deploy` | 100.x.x.x |
| A | `*.pulse-work` | 100.x.x.x |
| A | `*.cubiing` | 100.x.x.x |

**Productions → IP publique VPS (accessible) :**
| Type | Name | Points to |
| ---- | --------------- | ---------- |
| A | `nextjs-deploy` | 192.x.x.x |
| A | `pulse-work` | 192.x.x.x |
| A | `cubiing` | 192.x.x.x |

**Outils admin → IP Tailscale (protégé) :**
| Type | Name | Points to |
| ---- | ----------- | ---------- |
| A | `traefik` | 100.x.x.x |
| A | `dokploy` | 100.x.x.x |

Les records spécifiques ont priorité sur les wildcards.

## 3. Passer Let's Encrypt en DNS Challenge (Hostinger)

Le DNS Challenge permet à Let's Encrypt de valider et renouveler les certificats HTTPS via un record TXT DNS, sans avoir besoin d'accéder au serveur par HTTP. Indispensable car les domaines VPN ne sont pas accessibles publiquement.

1. Générer un API token Hostinger

[Hostinger hPanel → API](https://hpanel.hostinger.com/profile/api)

2. Ajouter le token dans Traefik

Dokploy → Web Server → Traefik → Modify Environment :

```env
HOSTINGER_API_TOKEN=your_hostinger_api_token
```

3. Modifier la config Traefik

Dokploy → Traefik File System → `traefik.yml`

Remplacer `httpChallenge` :

```yml
certificatesResolvers:
    letsencrypt:
        acme:
            email: hello@nansp.dev
            storage: /etc/dokploy/traefik/dynamic/acme.json
            httpChallenge:
                entryPoint: web
```

Par `dnsChallenge` :

```yml
certificatesResolvers:
    letsencrypt:
        acme:
            email: hello@nansp.dev
            storage: /etc/dokploy/traefik/dynamic/acme.json
            dnsChallenge:
                provider: hostinger
                resolvers:
                    - "1.1.1.1:53"
                    - "8.8.8.8:53"
```

4. Redémarrer Traefik

Dokploy → Web Server → Traefik → Reload

## 4. Activer le dashboard Traefik

> [!WARNING]
> Bien ajouter la règle DNS du VPN avant d'activer le dashboard, sinon il sera exposé publiquement.

1. Créer le DNS `traefik` (voir section 2)

2. Modifier `traefik.yml` (Dokploy → Traefik File System)

Remplacer `api` :

```yml
api:
    insecure: true
```

Par :

```yml
api:
    dashboard: true
```

3. Créer le routeur dynamique sur le VPS :

```bash
touch /etc/dokploy/traefik/dynamic/dashboard.yml
```

4. Ajouter la config suivante depuis l'interface Dokploy (File System → Traefik → dynamic → dashboard.yml) :

```yml
http:
    routers:
        dashboard:
            rule: Host(`traefik.nansp.dev`)
            entryPoints:
                - websecure
            service: api@internal
            tls:
                certResolver: letsencrypt
```

4. Supprimer le port mapping 8080

Dokploy → Web Server → Traefik → Additional Port Mappings → supprimer

5. Reload Traefik

Dokploy → Web Server → Traefik → Reload

Le dashboard est en lecture seule. Le VPN suffit comme protection.

## Utilisation

1. Connecter Tailscale sur ton appareil
2. Accéder aux URLs protégées normalement

## Sécurité

| Couche      | Protection                          |
| ----------- | ----------------------------------- |
| Réseau      | VPN Tailscale (WireGuard)           |
| Application | Basic Auth Traefik (Prisma Studio)  |
| Transport   | HTTPS (Let's Encrypt DNS Challenge) |

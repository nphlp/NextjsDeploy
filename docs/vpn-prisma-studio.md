# VPN Tailscale pour Dokploy

[Home](../README.md) > [VPN Tailscale](./vpn-prisma-studio.md)

## Objectif

Protéger les environnements sensibles via un VPN Tailscale :

- prisma-studio.\*.domain.com` - Prisma Studio (accès base de données)
- `preview.*.domain.com` - Environnements de preview
- `experiment.*.domain.com` - Environnements d'expérimentation

Seuls les appareils connectés au réseau Tailscale peuvent accéder à ces routes.

## Configuration

Tailscale est intégré nativement à Dokploy.

**Suivre le guide officiel** : [Dokploy - Tailscale Integration](https://docs.dokploy.com/docs/core/guides/tailscale)

## DNS (Hostinger)

Récupérer l'IP Tailscale du VPS :

```bash
sudo tailscale ip -4
# Ex: 100.x.x.x
```

Configurer les records DNS pour chaque projet :

**Wildcards → IP Tailscale (protégé) :**
| Type | Name | Points to |
| ---- | ----------------- | --------------- |
| A | `*.nextjs-deploy` | 100.x.x.x |
| A | `*.pulse-work` | 100.x.x.x |
| A | `*.cubiing` | 100.x.x.x |

**Productions → IP publique VPS (accessible) :**
| Type | Name | Points to |
| ---- | --------------- | --------------- |
| A | `nextjs-deploy` | 192.x.x.x |
| A | `pulse-work` | 192.x.x.x |
| A | `cubiing` | 192.x.x.x |

Les records spécifiques ont priorité sur les wildcards.

## Utilisation

1. Connecter Tailscale sur ton appareil
2. Accéder aux URLs protégées normalement

## Sécurité

| Couche      | Protection                         |
| ----------- | ---------------------------------- |
| Réseau      | VPN Tailscale (WireGuard)          |
| Application | Basic Auth Traefik (Prisma Studio) |
| Transport   | HTTPS (Let's Encrypt)              |

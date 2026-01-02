# SSH Tunnel pour Prisma Studio

[Home](../README.md) > [SSH Tunnel](./ssh-tunnel.md)

Ce guide explique comment accéder à Prisma Studio sur un serveur distant via un tunnel SSH sécurisé.

## Pourquoi un tunnel SSH ?

Prisma Studio est exposé uniquement sur `127.0.0.1:5555` (localhost) sur le serveur. Il n'est pas accessible depuis internet, ce qui est plus sécurisé. Le tunnel SSH permet d'y accéder depuis ton poste local.

## Configuration SSH

Ajoute cette configuration dans `~/.ssh/config` :

```ssh
# VPS - Tunnel Prisma Studio
Host vps-studio
  HostName <IP_DU_VPS>
  User <USER>
  IdentityFile ~/.ssh/<CLE_PRIVEE>
  IdentitiesOnly yes
  LocalForward 5555 localhost:5555
```

## Utilisation

### Ouvrir le tunnel

```bash
ssh vps-studio
```

Le terminal reste ouvert. Ferme-le avec `Ctrl+C` pour couper le tunnel.

### Accéder à Prisma Studio

Une fois le tunnel ouvert, accède à Prisma Studio dans ton navigateur :

```
http://localhost:5555
```

## Environnements

| Environnement    | Commande         | Prisma Studio         |
| ---------------- | ---------------- | --------------------- |
| dev (local)      | `make dev`       | http://localhost:5555 |
| basic (local)    | `make basic`     | http://localhost:5555 |
| preview (VPS)    | `ssh vps-studio` | http://localhost:5555 |
| production (VPS) | `ssh vps-studio` | http://localhost:5555 |

## Dépannage

### Le port 5555 est déjà utilisé

```bash
# Vérifier quel processus utilise le port
lsof -i :5555

# Tuer le processus si nécessaire
kill <PID>
```

### Connexion refusée

Vérifie que Prisma Studio tourne sur le serveur :

```bash
ssh vps
docker ps | grep prisma-studio
```

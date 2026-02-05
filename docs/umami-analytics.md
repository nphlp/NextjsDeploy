# Umami Analytics

[Home](../README.md) > [Umami Analytics](./umami-analytics.md)

## Objectif

Intégrer Umami pour le tracking analytique. Le dashboard reste derrière le VPN, le tracking passe par une route API Next.js qui proxifie vers Umami via le réseau Docker interne.

## Architecture

```
Navigateur (public)
  ├─ GET /api/umami/script.js ──► Next.js ──► http://umami:3000/script.js (via dokploy-network)
  └─ POST /api/umami/api/send ──► Next.js ──► http://umami:3000/api/send (via dokploy-network)

Dashboard (VPN uniquement)
  └─ https://umami.nansp.dev ──► Traefik ──► umami:3000
```

## 1. DNS

Créer un enregistrement DNS pour le dashboard (VPN uniquement).

| Type | Nom     | Valeur           |
| ---- | ------- | ---------------- |
| A    | `umami` | `<tailscale-ip>` |

## 2. Service Dokploy

Créer le service à partir du template : [Dokploy - Umami Template](https://docs.dokploy.com/docs/templates/umami)

## 3. Désactiver Isolated Deployment

Dokploy > Service Umami > Advanced > désactiver "Enable Isolated Deployment".

Le `dokploy-network` est automatiquement ajouté au service `umami`.

## 4. Modifier le compose

Par défaut, le template n'a pas de section `networks`. Il faut ajouter :

- `dokploy-network` (externe) sur `umami` pour Traefik et Next.js
- `umami-network` (interne) sur `umami` et `db` pour la communication base de données

**Service umami — ajouter :**

```yaml
networks:
    - dokploy-network
    - umami-network
```

**Service db — ajouter :**

```yaml
networks:
    - umami-network
```

**Section networks — ajouter en fin de fichier :**

```yaml
networks:
    umami-network:
        driver: bridge
    dokploy-network:
        external: true
```

Redéployer le service.

## 5. Configurer le domaine

Dokploy > Service Umami > Domains > changer le domaine pour `umami.nansp.dev`.

## 6. Configurer le compte admin

1. Accéder à `https://umami.nansp.dev` (VPN requis)
2. Se connecter avec `admin` / `umami`
3. Changer le mot de passe admin

## 7. Créer un site web

1. Settings > Websites > Add website
2. Récupérer le Website ID (Edit > Website ID)

## 8. Variables d'environnement

Variables **serveur** (pas `NEXT_PUBLIC`) dans `env/env.config.ts` :

| Variable           | Description                | Exemple             |
| ------------------ | -------------------------- | ------------------- |
| `UMAMI_URL`        | URL Docker interne d'Umami | `http://umami:3000` |
| `UMAMI_WEBSITE_ID` | ID du site web Umami       | `89a590bc-...`      |

Production uniquement. Exclure des autres environnements.

## 9. Route API proxy

Créer une route catch-all qui proxifie vers Umami via le réseau Docker interne.

`app/api/umami/[...segments]/route.ts`

Le navigateur ne communique jamais directement avec Umami. Tout passe par Next.js en proxy interne.

## 10. Script de tracking

Dans `app/layout.tsx`, ajouter la balise script pointant vers la route API.

Le layout est un Server Component : il accède aux variables serveur directement.

Le script Umami envoie les events à l'origine du script (`/api/send`). La route catch-all `/api/umami/[...segments]` ne capte pas ce chemin.

Pour que les events passent par le proxy, ajouter `data-host-url` :

Les events seront envoyés à `/api/umami/api/send` et proxifiés vers Umami.

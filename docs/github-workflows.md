# Github Workflows

## Dokploy Setup

> [!NOTE]
> Configurer un projet Dokploy avec deux environnements : `preview` et `production`

1. Créer un projet Dokploy

2. Créer un environnement `production` et `preview`

3. Créer un `compose` pour chaque environnement
    - Sélectionner l'onglet Git
    - Git Repository: `https://github.com/username/repo.git`
    - Branch: `main` pour la prod et `test` pour la preview
    - Docker Compose File Path: `./docker-compose.yml`
    - Cliquer sur **Create Compose**

4. Répéter l'opération pour chaque environnement (preview / production)

> [!NOTE]
> Récupérer le token API

1. Se rendre sur : `doploy.domain.com`

2. Home > User icon (top-right) > My account > Access tokens > Add access token

3. Renseigner les champs :
    - Current password : `******`
    - Nom du token : `Github Action for Nextjs Deploy`
    - Cliquer sur **Add access token** et **copier le token** (il n'est visible qu'une seule fois)

## GitHub Setup

> [!NOTE]
> Ajouter des `GitHub Action Secrets`

Pour cela : GitHub > Repository > Settings > Secrets and Variables > Actions > New repository secrets

1. DOKPLOY_VPS_URL (ex: `dokploy.my-domain.com`)
2. DOKPLOY_API_TOKEN (ex: `jslkdjFSLlDflkKLDfjlksdjfdFLKlKJSdlkfjSDLfSKDjfllslsdkfflkSFKLls`)
3. DOKPLOY_COMPOSE_ID_PRODUCTION (ex: `4kbpULUAlKsd7L55ru54i`)
4. DOKPLOY_COMPOSE_ID_PREVIEW (ex: `s7kpRssAlKsd7fj8suSiJ`)

Les `composeId` se trouvent dans l'URL de environnement Dokploy:

```url
https://<dokploy_vps_url>/dashboard/project/<project_id>/environment/<environment_id>/services/compose/<compose_id>
```

> [!NOTE]
> Configurer un environnement "production" et "preview"

Pour cela : Github > Your Respository > Settings > Environments

1. Créer un environnement "production" / "preview"
2. (Optionnel) Pour rendre obligatoire un confirmation manuelle:
    - Cocher "Required reviewers"
    - S'ajouter soi-même en tant que reviewer
3. Valider avec "Save protection rules"

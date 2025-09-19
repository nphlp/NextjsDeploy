# Github Workflows

## Portainer Setup

> [!NOTE]
> Configurer deux stacks : `preview` et `production`

1. Se rendre sur : `portainer.domain.com`

2. Home > Environments > Primary > Stacks > Add stack

3. Renseigner les champs :
    - Nom de la stack : `project-name-production`
    - Choisir "Repository" et entrer l'URL : `https://github.com/username/repo.git`
    - Repository reference : `refs/heads/main`
    - Préciser le compose file : `compose.vps.yml`
    - Ajouter les composes files supplémentaires si besoin : `compose.vps.override.yml`
    - Cocher **GitOps**, puis **Webhook** et **copier le lien** : `https://portainer.domain.com/api/stacks/webhooks/random-id`
    - Définir les variables d'environnement
    - Choisir les autorisations de gestion de la stack
    - Déployer la stack
    - Observer les logs de déploiement dans le conteneur `portainer`

4. Répéter l'opération pour chaque environnement (preview / production)

> [!NOTE]
> Récupérer le token API

1. Se rendre sur : `portainer.domain.com`

2. Home > User icon (top-right) > My account > Access tokens > Add access token

3. Renseigner les champs :
    - Current password : `******`
    - Nom du token : `Github Action for Nextjs Deploy`
    - Cliquer sur **Add access token** et **copier le token** (il n'est visible qu'une seule fois)

## GitHub Setup

> [!NOTE]
> Ajouter des `GitHub Action Secrets`

Pour cela : GitHub > Repository > Settings > Secrets and Variables > Actions > New repository secrets

1. PORTAINER_API_TOKEN (ex: `ptr_8lksjdfklu/udjfkMYr/mjflfskozujUmxskjfUMTHM=`)
2. PORTAINER_WEBHOOK_PREVIEW (ex: `https://portainer.nansp.dev/api/stacks/webhooks/1b45dlsj-bji2-4li9-fkdf-j48aa3jfke62`)
3. PORTAINER_WEBHOOK_PRODUCTION (ex: `https://portainer.nansp.dev/api/stacks/webhooks/4ifsof4i-jfs8-sli7-sj87-fu8kdjfjfke7`)

<!-- -> Ajouter la Deploy Key
Pour cela : Github > Your Repository > Settings > Deploy keys

1. Ajouter la Deploy Key
2. Etc. -->

> [!NOTE]
> Configurer un environnement "production" et "preview"

Pour cela : Github > Your Respository > Settings > Environments

1. Créer un environnement "production" / "preview"
    <!-- 2. Cocher "Required reviewers" -->
    <!-- 3. S'ajouter soi-même en tant que reviewer -->
2. Valider avec "Save protection rules"

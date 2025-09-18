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

## GitHub Setup

-> Ajouter les GitHub Actions Secrets

Pour cela : GitHub > Repository > Settings > Secrets and Variables > Actions

1. PORTAINER_API_URL (ex: https://PORTAINER.domain.com)
2. PORTAINER_API_TOKEN (ex: 34|tXirjfk5gzUUpAMqppaLZnC2OfjkoitmTvcHakjfs646889)
3. PORTAINER_PROJECT_NAME_PREVIEW_UUID (UUID environnement preview)
4. PORTAINER_PROJECT_NAME_PRODUCTION_UUID (UUID environnement production)

-> Ajouter la Deploy Key
Pour cela : Github > Your Repository > Settings > Deploy keys

1. Ajouter la Deploy Key
2. Etc.

-> Configurer un environnement "production" et "preview"

Pour cela : Github > Your Respository > Settings > Environments

1. Créer un environnement "production" / "preview"
2. Cocher "Required reviewers"
3. Ajouter un reviewer
4. Valider avec "Save protection rules"

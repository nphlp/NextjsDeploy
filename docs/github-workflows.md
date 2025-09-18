# Github Workflows

## Portainer Setup

> [!NOTE]
> Configurer deux environnements : `preview` et `production`

Étapes dans Portainer :

1. Coolify > Keys & Tokens > Private Keys
   Créer une Deploy Key

2. Coolify > Keys & Tokens > API Tokens
   Créer un token avec permissions (read + write + deploy)

3. Récupérer les UUIDs des applications "production" et "preview" qui se trouve dans l'URL
   Exemple: https://coolify.domain.com/project/.../environment/.../application/{uuid}

## GitHub Setup 

-> Ajouter les GitHub Actions Secrets

Pour cela : GitHub > Repository > Settings > Secrets and Variables > Actions

1. COOLIFY_API_URL (ex: https://coolify.domain.com)
2. COOLIFY_API_TOKEN (ex: 34|tXirjfk5gzUUpAMqppaLZnC2OfjkoitmTvcHakjfs646889)
3. COOLIFY_ECO_SERVICE_PREVIEW_UUID (UUID environnement preview)
4. COOLIFY_ECO_SERVICE_PRODUCTION_UUID (UUID environnement production)

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

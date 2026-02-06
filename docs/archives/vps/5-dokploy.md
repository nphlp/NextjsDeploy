# Dokploy VPS Installation

## Installer Dokploy

Lancer le script d'installation de Dokploy.

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

## Configurer du domaine

1. Ouvrer l'interface web Dokploy via l'URL indiquée à la fin du script (ex: [http://my-vps-ip-address:3000](http://my-vps-ip-address:3000)).

2. Créer un compte administrateur

3. Aller dans **Settings** > **Web Server** > **Server Domain**
    - Domain: `dokploy.my-domain.com`
    - Let's Encrypt Email: `hello@my-domain.com` (utilisez de préférence une adresse email liée au domaine)
    - HTTPS: basculer sur `activé`
    - Certificate Provider: basculer sur `Let's Encrypt`
    - `Save`

4. Activez le Parfeu du VPS dans l'interface Hostinger (voir [VPS Config](./vps-config.md)).

5. Redémarrer le VPS.

6. Accédez à l'interface web de Dokploy via l'URL : [https://dokploy.my-domain.com](https://dokploy.my-domain.com).

## Configuration supplémentaires

Aller dans **Settings** > **Web Server** > **Web Server** : "Daily Docker Cleanup" > basculer sur `activé`.

## Emplacement des projets

Les projets Dokploy sont situés dans le dossier `/etc/dokploy/compose`.

Un dossier `compose` contient :

- un dossier `code` -> clone du dépôt Git avec le `.env` généré par Dokploy
- un dossier `files` -> dossier sécurisé pour la persistance des volumes entre les builds

Il peut être pratique de créer un lien symbolique vers le dossier `/compose` dans le dossier `/root` (home de l'utilisateur `root`) qui est le dossier par défaut lors de la connexion en SSH.

```bash
ln -s /etc/dokploy/compose ~/projects
```

## Dokploy Api

La documentation des routes disponibles se trouve ici : [https://dokploy.my-domain.com/swagger](https://dokploy.my-domain.com/swagger)

Il faut générer un token dans l'interface web Dokploy > **Profile** > **API/ CLI Keys** > **Generate New Token**.

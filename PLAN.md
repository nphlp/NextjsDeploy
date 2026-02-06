## Documenter

1. Documentation courtes, précises, bien segmentées
2. File d'ariane en haut et en bas de chaque page
3. Liens "Précédent" et "Suivant" en bas de chaque page
4. Redirection vers d'autres parties de documentation lorsque pertinent
5. Pas de données sensibles, c'est un dépôt public

- readme.md : ✅
    1. Présentation projet (court)
    2. Index de la documenation
    3. Commande `make dev` (lien vers setup-local.md)
    4. Fixtures email/mdp (liens vers fixtures.md)

- docs/
    - nextjs-deploy/
        - 1-setup-local.md ✅
        - 2-environment-variables.md ✅
        - 3-containerization.md ✅
        - 4-fixtures.md ✅
        - 5-good-practices.md :
            1. composant nextjs, typepage, structure
            2. page server, provider, composant client
            3. cache/suspense/skeleton
            4. nuqs
            5. base-ui
            6. oRPC api routes
            7. etc
        - 6-mcp-servers.md ✅
        - 7-git-usage.md ✅ : branches, commits, pull requests, rebase, etc
        - 8-github-pipelines.md ✅ : pipelines CI/CD, semantic release (planned)
        - 9-github-env-setup.md ✅ : environments, secrets, branch protection
        - 10-dokploy-env-setup.md ✅ : projet, compose, provider, variables

    - vps-infra/
        - setup-vps.md : auto install unbuntu via Hostinger, config ssh
        - firewall-config.md : config firewall Hostinger (ssh, http, https)
        - dns-config.md : répertorie toutes les configs DNS
            1. Domaine principal + Wildcard -> IP VPS : `domain.com` -> `192.x.x.x` + `*.domain.com` -> `192.x.x.x`
            2. Email SMTP DNS (un bouton a cliquer lien hostinger)
            3. Config VPN (warning: à faire à partir de traefik-dns-challenge.md)
        - swap-file.md : config swap file 4GB pour éviter les builds crashs
        - common-packages.md : ping, tree, lazydocker, btop, etc
        - claude-code-install.md : installation de Claude Code
        - docker-install.md : installation de Docker Engine, etc (inutile puisque dokploy le fait ?)
        - dokploy-install.md : installation et configuration de Dokploy, `dokploy.domaine.com`, etc
        - traefik-dns-challenge.md : passer de `hhtp challenge` a `dns challenge` de hostinger pour la compatibilité avec les domaines VPN
        - tailscale-vpn.md : install ation tailscale
        - analytics/
            1. umami.md
            2. plausible.md (plus tard) : à comparar avec umami
            3. glitchtip.md (plus tard)
            4. signoz.md (plus tard) : à comparar avec glitchtip
            5. infisical (plus tard)
            6. etc

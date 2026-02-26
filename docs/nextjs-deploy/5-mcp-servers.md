[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **MCP Servers**

[← Good Practices](../good-practices/) | [Git Usage →](./6-git-usage.md)

---

# MCP Servers

Configuration : `.mcp.json`

## 1. next-devtools (Vercel)

Serveur MCP officiel pour le développement Next.js 16+.

### Config

```json
"next-devtools": {
    "command": "npx",
    "args": ["-y", "next-devtools-mcp@latest"]
}
```

### Tools

| Outil                     | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `nextjs_index`            | Découvre les serveurs Next.js et leurs outils MCP          |
| `nextjs_call`             | Appelle un outil sur le dev server (erreurs, routes, logs) |
| `nextjs_docs`             | Récupère la documentation officielle Next.js               |
| `browser_eval`            | Automatisation browser avec Playwright intégré             |
| `upgrade_nextjs_16`       | Migration automatique vers Next.js 16                      |
| `enable_cache_components` | Configure et active Cache Components                       |
| `init`                    | Initialise le contexte MCP                                 |

### Resources (17)

| Resource                                 | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `cache-components://overview`            | Quick reference Cache Components       |
| `cache-components://core-mechanics`      | Paradigme et comportement              |
| `cache-components://public-caches`       | `"use cache"`                          |
| `cache-components://private-caches`      | `"use cache: private"`                 |
| `cache-components://runtime-prefetching` | Prefetch et stale time                 |
| `cache-components://request-apis`        | params, searchParams, cookies, headers |
| `cache-components://cache-invalidation`  | updateTag, revalidateTag               |
| `cache-components://advanced-patterns`   | cacheLife, cacheTag, draft mode        |
| `cache-components://build-behavior`      | Prerendering, static shells            |
| `cache-components://error-patterns`      | Erreurs courantes et solutions         |
| `cache-components://test-patterns`       | Patterns de 125+ fixtures              |
| `cache-components://reference`           | Mental models, API reference           |
| `cache-components://route-handlers`      | `"use cache"` dans Route Handlers      |
| `nextjs-fundamentals://use-client`       | Quand utiliser `"use client"`          |
| `nextjs16://migration/beta-to-stable`    | Guide migration beta → stable          |
| `nextjs16://migration/examples`          | Exemples migration                     |
| `nextjs-docs://llms-index`               | Index complet de la doc Next.js        |

---

## 2. context7 (Upstash)

Documentation à jour pour n'importe quelle librairie.

### Config

```json
"context7": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"],
    "env": {}
}
```

### Tools

| Outil                | Description                                      |
| -------------------- | ------------------------------------------------ |
| `resolve-library-id` | Résout un nom de librairie en ID Context7        |
| `query-docs`         | Récupère la documentation à jour d'une librairie |

---

## 3. chrome-devtools (Google)

Debug frontend avancé avec Chrome DevTools Protocol.

### Config

```json
"chrome-devtools": {
    "command": "npx",
    "args": ["-y", "chrome-devtools-mcp@latest"]
}
```

### Tools (26)

| Catégorie       | Outil                         | Description                          |
| --------------- | ----------------------------- | ------------------------------------ |
| **Navigation**  | `new_page`                    | Créer une nouvelle page              |
|                 | `close_page`                  | Fermer une page                      |
|                 | `list_pages`                  | Lister les pages ouvertes            |
|                 | `select_page`                 | Sélectionner une page                |
|                 | `navigate_page`               | Naviguer vers une URL                |
|                 | `wait_for`                    | Attendre un élément/événement        |
| **Interaction** | `click`                       | Cliquer sur un élément               |
|                 | `hover`                       | Survoler un élément                  |
|                 | `fill`                        | Remplir un champ                     |
|                 | `fill_form`                   | Remplir un formulaire complet        |
|                 | `press_key`                   | Appuyer sur une touche               |
|                 | `drag`                        | Glisser-déposer                      |
|                 | `upload_file`                 | Uploader un fichier                  |
|                 | `handle_dialog`               | Gérer les dialogues (alert, confirm) |
| **Émulation**   | `emulate`                     | Émuler un device                     |
|                 | `resize_page`                 | Redimensionner la page               |
| **Performance** | `performance_start_trace`     | Démarrer une trace                   |
|                 | `performance_stop_trace`      | Arrêter une trace                    |
|                 | `performance_analyze_insight` | Analyser les performances            |
| **Réseau**      | `list_network_requests`       | Lister les requêtes réseau           |
|                 | `get_network_request`         | Détails d'une requête                |
| **Debug**       | `evaluate_script`             | Exécuter du JavaScript               |
|                 | `list_console_messages`       | Lister les messages console          |
|                 | `get_console_message`         | Détails d'un message                 |
|                 | `take_screenshot`             | Capturer l'écran                     |
|                 | `take_snapshot`               | Snapshot DOM/accessibility           |

---

## MCP désactivés (à copier dans .mcp.json si besoin)

### linear

```json
"linear": {
    "command": "npx",
    "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
}
```

### claude-in-chrome

Extension Chrome native - activer via `claude --chrome` ou `/chrome`.

---

## Comparatif rapide

| Besoin                        | MCP recommandé    |
| ----------------------------- | ----------------- |
| Dev Next.js (erreurs, routes) | `next-devtools`   |
| Doc librairies à jour         | `context7`        |
| Debug performance frontend    | `chrome-devtools` |
| Gestion projet/issues         | `linear`          |

---

[← Good Practices](../good-practices/) | [Git Usage →](./6-git-usage.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **MCP Servers**

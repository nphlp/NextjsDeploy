# Database Breaking Migrations

## Réflexion sur le mode maintenance

**Concept : Fichier signal `/app/maintenance/enabled.lock`**

```architecture
/app
├── maintenance
│   └── enabled.lock
└── middleware.ts
```

Le middleware Next.js vérifie l'existence du fichier `enabled.lock` dans le dossier `/app/maintenance`.

Si le fichier existe, une réponse 503 est renvoyée, indiquant que le site est en maintenance.

```typescript
// middleware.ts
import { existsSync } from "fs";
import path from "path";

export function middleware(request: NextRequest) {
    const maintenanceFile = path.join(process.cwd(), "maintenance", "enabled.lock");

    if (existsSync(maintenanceFile)) {
        return new NextResponse("🔧 Maintenance en cours", { status: 503 });
    }
    return NextResponse.next();
}
```

Le fichier peut être persisté entre les redémarrages de conteneurs pour plus de sécurité.

```yml
# compose.dokploy.yml
services:
    nextjs:
        volumes:
            - ../files/maintenance:/app/maintenance
```

Pour activer le mode maintenance, créez le fichier `enabled.lock` :

```bash
docker exec nextjs-pulse-work touch /app/maintenance/enabled.lock
```

Pour désactiver le mode maintenance, supprimez le fichier `enabled.lock` :

```bash
docker exec nextjs-pulse-work rm /app/maintenance/enabled.lock
```

**Avantages :**

- Activation/désactivation instantanée via le middleware
- Pilotable en bash, donc intégrable dans des scripts de migration automatisés

---

## Situation initiale

La base de données contient une table `User` avec des roles `USER` et `ADMIN`.

```prisma
model User {
    id        Int      @id @default(nanoid())
    email     String   @unique
    role      Role
}

enum Role {
    USER
    ADMIN
}
```

Nous souhaitons basculer vers une nouvelle structure de rôles, en remplaçant `USER` par `EMPLOYEE` et en ajoutant un nouveau rôle `MANAGER`. Nous souhaitons obtenir la structure suivante :

```prisma
model User {
    id        Int      @id @default(nanoid())
    email     String   @unique
    role      Role
}

enum Role {
    EMPLOYEE
    MANAGER
    ADMIN
}
```

Cependant, des entrées User avec le rôle `USER` existent déjà dans la base de données. Nous devons migrer ces entrées vers le nouveau rôle `EMPLOYEE` sans perdre de données.

## Étapes de la migration

La migration sera effectuée en plusieurs étapes pour garantir l'intégrité des données.

1. Migration intermédiaire
    - Préparer la `migration` intermédiaire
    - Préparer un script de `mutation` des données existantes
    - Déployer la `migration` intermédiaire

2. Mise à jour des données existantes
    - Bloquer les `mutations` pendant la transition (début du `maintenance mode`) # TODO: modifier une variable globale ?
    - Sauvegarder les données existantes avec un `dump` # TODO: rédiger un script ?
    - Compter le nombre d'entrées avec le rôle `USER` avant la migration. # TODO: à tester
    - Mettre à jour les données existantes avec le script de `mutation`
    - Compter le nombre d'entrées avec le rôle `EMPLOYEE` après la migration. # TODO: à tester
    - S'assurer que le nombre d'`USER` avant et le nombre d'`EMPLOYEE` après la migration est égal # TODO: à tester
    - S'assurer qu'aucune entrée avec le rôle `USER` n'existe après la migration # TODO: à tester
    - Faire un `rollback` des données si la `mutation` des données a échoué # TODO: nécessaire dans un système Swarm Zero Downtime ?

3. Migration finale
    - Préparer et déployer la `migration finale`
    - Débloquer les `mutations` (fin du `maintenance mode`) # TODO: à définir

## Procédures détaillées

Voici les étapes à suivre pour chaque phase de la migration.

### 1. Migration intermédiaire

- La migration intermédiaire est un fusion additive qui permet de faire coexister les anciens et nouveaux rôles.

```prisma
model User {
    id        Int      @id @default(nanoid())
    email     String   @unique
    role      Role
}

enum Role {
    USER      // Sera remplacé par EMPLOYEE
    EMPLOYEE  // Remplacera USER
    MANAGER   // A ajouter
    ADMIN     // Inchangé
}
```

- Préparez un script de mutation des données existantes comme suit [0001_migrate_user_to_employee.ts](../prisma/manual_migrations/0001_migrate_user_to_employee.ts).

- Déployez la migration en local puis sur un environnement de test avant de la déployer en production.

### 2. Mise à jour des données existantes

- Se connecter en SSH au VPS.

- Activer le `maintenance mode` grace à une variable globale pour bloquer les mutations pendant la transition. # TODO: à définir

- Effectuer un `dump` de la base de données pour sauvegarder les données existantes. # TODO: à tester

```bash
mkdir -p /backups
docker exec postgres-production pg_dump \
    -U postgres \
    -d pulsework \
    --format=custom \
    > /backups/backup_$(date +%Y%m%d_%H%M%S).dump
```

- Dans un seul script Typescript, exécuter les étapes suivantes :
    1. Compter le nombre d'entrées avec le rôle `USER` à modifier avant la migration. # TODO: à tester
    2. Exécuter le script de mutation des données existantes pour mettre à jour les rôles `USER` vers `EMPLOYEE`.
    3. Compter le nombre d'entrées avec le rôle `EMPLOYEE` après la migration. # TODO: à tester
    4. S'assurer que le nombre d'`USER` avant et le nombre d'`EMPLOYEE` après la migration est égal # TODO: à tester
    5. Vérifier qu'aucune entrée avec le rôle `USER` n'existe après la migration # TODO: à tester

    ```bash
    docker exec nextjs-pulse-work sh -c " \
        cd /app && \
        pnpm tsx prisma/manual_migrations/0001_migrate_user_to_employee.ts \
    "
    ```

- Si la mutation a échoué, restaurer les données à partir du `dump` effectué précédemment. # TODO: à tester

```bash
cat /backups/backup_20250115_143022.dump | \
docker exec -i postgres-production pg_restore \
    -U postgres \
    -d pulsework \
    --clean \
    --if-exists
```

### 3. Migration finale

- La migration finale consiste à supprimer le rôle `USER` et à valider la nouvelle structure.

```prisma
model User {
    id        Int      @id @default(nanoid())
    email     String   @unique
    role      Role
}

enum Role {
    // USER  (Supprimé)
    EMPLOYEE
    MANAGER
    ADMIN
}
```

- Déployer la migration finale en local puis sur un environnement de test avant de la déployer en production.

- Désactiver le `maintenance mode` pour débloquer les mutations. # TODO: à définir

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Database Breaking Migrations**

[← Dokploy Env Setup](./9-dokploy-env-setup.md) | [Scheduled Tasks →](./11-scheduled-tasks.md)

---

# Database Breaking Migrations

Guide for handling database migrations that require data transformation (e.g., renaming enum values, restructuring columns).

## Maintenance Mode

Use a lock file to toggle maintenance mode instantly via the Next.js middleware.

```
/app
├── maintenance
│   └── enabled.lock
└── middleware.ts
```

The middleware checks for the lock file and returns a 503 response if it exists:

```typescript
// middleware.ts
import { existsSync } from "fs";
import path from "path";

export function middleware(request: NextRequest) {
    const maintenanceFile = path.join(process.cwd(), "maintenance", "enabled.lock");

    if (existsSync(maintenanceFile)) {
        return new NextResponse("Maintenance in progress", { status: 503 });
    }
    return NextResponse.next();
}
```

Persist the file between container restarts:

```yml
# compose.dokploy.yml
services:
    nextjs:
        volumes:
            - ../files/maintenance:/app/maintenance
```

Toggle maintenance mode:

```bash
# Enable
docker exec nextjs touch /app/maintenance/enabled.lock

# Disable
docker exec nextjs rm /app/maintenance/enabled.lock
```

## Example: Renaming an Enum Value

### Initial State

```prisma
enum Role {
    USER
    ADMIN
}
```

### Target State

```prisma
enum Role {
    EMPLOYEE  // replaces USER
    MANAGER   // new
    ADMIN     // unchanged
}
```

Existing `USER` entries must be migrated to `EMPLOYEE` without data loss.

## Migration Steps

### 1. Intermediate Migration

Create an additive migration where old and new values coexist:

```prisma
enum Role {
    USER      // will be replaced by EMPLOYEE
    EMPLOYEE  // replaces USER
    MANAGER   // new
    ADMIN     // unchanged
}
```

Prepare a data mutation script (e.g., `prisma/manual_migrations/0001_migrate_user_to_employee.ts`).

Deploy the intermediate migration to test, then production.

### 2. Data Update

1. Enable maintenance mode (block mutations during transition)

2. Backup the database:

> [!NOTE]
> The database is a **standalone Dokploy service** (`production-db`), not part of the compose file. Find the container name in Dokploy > your database service > General tab, or use `docker ps | grep postgres`.

```bash
mkdir -p /backups
docker exec <postgres-container-name> pg_dump \
    -U postgres \
    -d your-database \
    --format=custom \
    > /backups/backup_$(date +%Y%m%d_%H%M%S).dump
```

Alternatively, use Dokploy's built-in backup (database service > **Backups** tab) — see [Cloudflare R2](../vps-infra/12-cloudflare-r2.md).

3. Run the mutation script:

```bash
docker exec nextjs sh -c " \
    cd /app && \
    bunx tsx prisma/manual_migrations/0001_migrate_user_to_employee.ts \
"
```

The script should:

- Count entries with role `USER` before migration
- Update `USER` → `EMPLOYEE`
- Count entries with role `EMPLOYEE` after migration
- Verify counts match and no `USER` entries remain

4. If the mutation failed, restore from backup:

```bash
cat /backups/backup_YYYYMMDD_HHMMSS.dump | \
docker exec -i <postgres-container-name> pg_restore \
    -U postgres \
    -d your-database \
    --clean \
    --if-exists
```

### 3. Final Migration

Remove the old enum value:

```prisma
enum Role {
    EMPLOYEE
    MANAGER
    ADMIN
}
```

Deploy the final migration. Disable maintenance mode.

---

[← Dokploy Env Setup](./9-dokploy-env-setup.md) | [Scheduled Tasks →](./11-scheduled-tasks.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Database Breaking Migrations**

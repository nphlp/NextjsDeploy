[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Scheduled Tasks**

[← Database Breaking Migrations](./10-database-breaking-migrations.md)

---

# Scheduled Tasks

CRON tasks are managed via Dokploy's **Schedules** tab. Each task runs a `bun` script inside the application container.

## Available Tasks

| Task               | Command                           | Schedule                | Description                                                 |
| ------------------ | --------------------------------- | ----------------------- | ----------------------------------------------------------- |
| Cleanup Activities | `bun run cron:cleanup-activities` | Weekly (Sunday 3:00 AM) | Delete expired `ActivityHistory` entries (90-day retention) |

## Setup on Dokploy

### 1. Open Schedules Tab

1. Go to **Dokploy** > **Projects** > **NextjsDeploy** > select your environment (e.g., `production`)
2. Click on your compose service
3. Go to the **Schedules** tab

### 2. Create the Cleanup Task

1. Click **Add Schedule**
2. Fill in the form:

| Field            | Value                                          |
| ---------------- | ---------------------------------------------- |
| **Service Name** | `nextjs` (your Next.js service in the compose) |
| **Task Name**    | `Cleanup Activity History`                     |
| **Schedule**     | `0 3 * * 0` (every Sunday at 3:00 AM UTC)      |
| **Timezone**     | `UTC` (default)                                |
| **Shell Type**   | `Bash`                                         |
| **Command**      | `bun run cron:cleanup-activities`              |
| **Enabled**      | `On`                                           |

3. Click **Create Schedule**

### 3. Verify

- The task appears in the **Scheduled Tasks** list
- Check the **Logs** tab after the first execution to confirm it ran successfully
- Expected log output: `[cron] cleanup-activities: X expired entries deleted`

## Local Development

Run tasks manually:

```bash
bun run cron:cleanup-activities
```

## Adding New Tasks

1. Add the function in `scripts/cron.ts`
2. Add a `case` in the `switch` block
3. Add a `cron:*` script in `package.json`
4. Create a new schedule in Dokploy
5. Update this documentation

## CRON Expression Reference

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday=0)
│ │ │ │ │
* * * * *
```

| Expression    | Description              |
| ------------- | ------------------------ |
| `0 3 * * 0`   | Every Sunday at 3:00 AM  |
| `0 0 * * *`   | Every day at midnight    |
| `0 */6 * * *` | Every 6 hours            |
| `0 0 1 * *`   | First day of every month |

---

[← Database Breaking Migrations](./10-database-breaking-migrations.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Scheduled Tasks**

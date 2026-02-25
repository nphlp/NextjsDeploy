[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Fixtures**

[← Containerization](./3-containerization.md) | [Good Practices →](./5-good-practices.md)

---

# Fixtures

Test data for development and testing. Fixtures are loaded automatically by `make dev` and `make start`, and on container startup in Docker ([Containerization](./3-containerization.md)).

## Commands

```bash
pnpm fixtures:setup    # Load fixtures (skips if data already exists)
pnpm fixtures:reset    # Delete all data
pnpm fixtures:reload   # Reset + setup (full reload)
```

> Requires an active database. Use `make postgres` or `make dev` first.

## Test Credentials

| Email             | Password      | Role  |
| ----------------- | ------------- | ----- |
| admin@example.com | Password1234! | ADMIN |
| user@example.com  | Password1234! | USER  |

## Data

Fixtures insert data in this order:

1. **Users** — 3 users with different roles (admin, vendor, user)
2. **Fruits** — 10 fruits, 5 owned by admin and 5 by vendor
3. **Baskets** — 5 baskets with fruit quantities, 3 for user and 2 for vendor

## Files

Data fixtures are organized in `fixtures/`:

- `fixtures/userData.ts` — user data and insert function
- `fixtures/fruitData.ts` — fruit data and insert function
- `fixtures/basketData.ts` — basket data and insert function

CLI script logic in `scripts/fixtures/`:

- `scripts/fixtures.ts` — CLI entry point (`setup`, `reset`, `reload`)
- `scripts/fixtures/index.ts` — exports all insert functions
- `scripts/fixtures/commands.ts` — implements setup, reset and reload logic

## Add a New Fixture

**1. Create the data file**

Create `fixtures/myData.ts` with your data and insert function:

```ts
import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client/client";

// Inserting logic
export const insertMyData = async () => {
    for (const data of myData) {
        await PrismaInstance.myModel.create({ data });
    }
};

// Data to insert with strong typing
const myData: Prisma.MyModelCreateInput[] = [
    // your data here
];
```

**2. Export in `scripts/fixtures/index.ts`**

```ts
export { insertMyData } from "@fixtures/myData";
```

**3. Register in `scripts/fixtures/commands.ts`**

Add the insert call in `fixtures()` (respect dependency order):

```ts
await insertUsers();
await insertFruits();
await insertBaskets();
await insertMyData(); // add here
```

Add the delete in `reset()` (reverse dependency order):

```ts
await PrismaInstance.myModel.deleteMany({}); // add here
await PrismaInstance.quantity.deleteMany({});
// ...
```

---

[← Containerization](./3-containerization.md) | [Good Practices →](./5-good-practices.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Fixtures**

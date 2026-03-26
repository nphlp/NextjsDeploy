import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

dotenv.config({ quiet: true });

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

/**
 * Vitest config for functional tests
 * -> Uses real PostgreSQL database (Docker)
 * -> Uses real Mailpit (Docker)
 * -> Mocks external APIs (Disify, MailCheck, HIBP) via MSW
 * -> Requires: make postgres (Postgres + Mailpit containers)
 */
export default defineConfig({
    test: {
        environment: "node",
        include: ["test/functional/**/*.test.ts"],
        env: { NEXT_PUBLIC_BASE_URL },
        testTimeout: 30_000,
        hookTimeout: 30_000,
        fileParallelism: false,
    },
    resolve: { alias: { "server-only": new URL("./test/mocks/modules/server-only.ts", import.meta.url).pathname } },
    plugins: [tsconfigPaths()],
});

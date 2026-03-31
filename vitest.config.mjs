import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

dotenv.config({ quiet: true });

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

export default defineConfig({
    test: {
        environment: "jsdom",
        env: { NEXT_PUBLIC_BASE_URL },
        exclude: [
            "**/.next/**",
            "**/node_modules/**",
            "vendor/**",
            "test/e2e/**",
            "test/integration/**",
            "test/functional/**",
        ],
        coverage: {
            provider: "v8",
            // Files to include in coverage
            include: ["api/**/*.ts", "actions/**/*.ts"],
            // Files to exclude from coverage
            exclude: [
                // oRPC actions tested through mutations
                "api/**/*-action.ts",
                // Need Next.js runtime (cookies)
                "actions/cancel-two-factor.ts",
                // Infra (Nodemailer transport, tested via integration)
                "actions/send-email.ts",
            ],
            reporter: ["text", "html"],
            reportsDirectory: "./test/coverage",
        },
    },
    resolve: { alias: { "server-only": new URL("./test/mocks/modules/server-only.ts", import.meta.url).pathname } },
    plugins: [tsconfigPaths(), react()],
});

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
        exclude: ["**/.next/**", "**/node_modules/**"],
        coverage: {
            provider: "v8",
            include: ["api/**/*.ts"],
            exclude: ["api/test/**"],
            reporter: ["text", "html"],
            reportsDirectory: "./coverage",
        },
    },
    plugins: [tsconfigPaths(), react()],
});

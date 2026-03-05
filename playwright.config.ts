import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

export default defineConfig({
    testDir: "test/e2e",
    timeout: 30_000,
    globalSetup: "./test/e2e/global-setup.ts",
    workers: 10,
    use: {
        baseURL: NEXT_PUBLIC_BASE_URL,
    },
    projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});

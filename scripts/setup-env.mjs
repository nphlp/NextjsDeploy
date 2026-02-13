/**
 * Environment setup — plain Node.js, zero dependencies
 *
 * 1. If env/env.config.json doesn't exist → create from example, exit
 * 2. If it exists → generate all .env files
 *
 * Usage: node scripts/setup-env.mjs
 */
import { existsSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "./generate-env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_DIR = resolve(ROOT, "env");
const CONFIG_PATH = resolve(ENV_DIR, "env.config.mjs");
const EXAMPLE_PATH = resolve(ENV_DIR, "env.config.example.mjs");

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

// Already exists → generate
if (existsSync(CONFIG_PATH)) {
    await generate();
    process.exit(0);
}

// Copy example → env/env.config.json
copyFileSync(EXAMPLE_PATH, CONFIG_PATH);

console.log(green("\n✅ Created env/env.config.mjs from example"));
console.log(yellow("📝 Please edit env/env.config.mjs with your values, then run the command again.\n"));

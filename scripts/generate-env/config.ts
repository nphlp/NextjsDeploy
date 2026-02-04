/**
 * Chemins du projet et chargement de la configuration
 */
import * as path from "path";
import type { LoadedConfig, Settings } from "./types";

// Chemins du projet
export const ROOT_DIR = path.resolve(__dirname, "../..");
export const ENV_DIR = path.join(ROOT_DIR, "env");
export const CONFIG_PATH = path.join(ENV_DIR, "env.config.ts");
export const CONFIG_EXAMPLE_PATH = path.join(__dirname, "env.config.example.ts");

/**
 * Charge la configuration depuis env/env.config.ts
 */
export async function loadConfig(): Promise<LoadedConfig> {
    const config = await import(CONFIG_PATH);
    const settings = config.settings as Settings;

    return {
        settings,
        ENV_LIST: Object.keys(settings.envs),
        globalConfig: config.globalConfig as Record<string, Record<string, unknown>>,
        envConfig: config.envConfig as Record<string, Record<string, unknown>>,
    };
}

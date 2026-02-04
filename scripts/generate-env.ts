#!/usr/bin/env tsx
/**
 * Génération des fichiers .env à partir de env/env.config.ts
 *
 * Prérequis : env/env.config.ts doit exister (créé par setup-env.ts)
 *
 * Fichiers générés :
 *   - .env (dev, à la racine)
 *   - env/.env.basic
 *   - env/.env.experiment
 *   - env/.env.preview
 *   - env/.env.production
 *
 * Usage : pnpm tsx scripts/generate-env.ts
 */
import * as fs from "fs";
import * as path from "path";
import { CONFIG_PATH, ENV_DIR, ROOT_DIR, loadConfig } from "./generate-env/config";
import { formatEnvFile } from "./generate-env/formatter";
import { generateEnvGroups } from "./generate-env/generator";
import { colors } from "./generate-env/utils";

async function main(): Promise<void> {
    // Étape 1 : Vérifier que env.config.ts existe
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error(colors.red("\nError: env/env.config.ts not found"));
        console.error(colors.yellow("Run 'make setup-env' first to create it.\n"));
        process.exit(1);
    }

    console.log("\n🔧 Generating environment files...\n");

    // Étape 2 : Charger la configuration
    const { settings, ENV_LIST, globalConfig, envConfig } = await loadConfig();

    // Étape 3 : Générer chaque fichier .env
    for (const env of ENV_LIST) {
        // 3a. Générer les groupes de variables pour cet environnement
        const groups = generateEnvGroups(env, settings, globalConfig, envConfig);

        // 3b. Formater le contenu du fichier
        const content = formatEnvFile(groups, env, settings);

        // 3c. Écrire le fichier (.env à la racine pour dev, env/.env.{env} pour les autres)
        const filePath = env === "dev" ? path.join(ROOT_DIR, ".env") : path.join(ENV_DIR, `.env.${env}`);
        fs.writeFileSync(filePath, content, "utf-8");

        console.log(`  ${colors.green("✓")} ${path.relative(ROOT_DIR, filePath)}`);
    }

    // Étape 4 : Terminé
    console.log(colors.green("\n✅ All environment files generated!\n"));
}

main().catch((error) => {
    console.error(colors.red("Error:"), error.message);
    process.exit(1);
});

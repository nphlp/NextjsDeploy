#!/usr/bin/env tsx
/**
 * Setup du fichier de configuration env/env.config.ts
 *
 * - Si le fichier n'existe pas, le crée à partir de l'exemple et quitte avec code 1
 * - Si le fichier existe, ne fait rien et quitte avec code 0
 *
 * Usage : pnpm tsx scripts/setup-env.ts
 */
import * as fs from "fs";
import { CONFIG_EXAMPLE_PATH, CONFIG_PATH, ENV_DIR } from "./generate-env/config";
import { colors } from "./generate-env/utils";

function main(): void {
    // Le fichier existe déjà, rien à faire
    if (fs.existsSync(CONFIG_PATH)) {
        process.exit(0);
    }

    // Vérifier que l'exemple existe
    if (!fs.existsSync(CONFIG_EXAMPLE_PATH)) {
        console.error(colors.red("\nError: scripts/generate-env/env.config.example.ts not found\n"));
        process.exit(1);
    }

    // Créer le dossier env/ si nécessaire
    if (!fs.existsSync(ENV_DIR)) {
        fs.mkdirSync(ENV_DIR, { recursive: true });
    }

    // Lire et ajuster les imports pour le chemin env/
    let content = fs.readFileSync(CONFIG_EXAMPLE_PATH, "utf-8");
    content = content.replace(/from ["']\.\/env\.types["']/g, 'from "../scripts/generate-env/env.types"');

    // Écrire le fichier
    fs.writeFileSync(CONFIG_PATH, content, "utf-8");

    // Message d'information
    console.log(colors.green("\n✅ Created env/env.config.ts from example\n"));
    console.log(colors.yellow("📝 Please edit env/env.config.ts with your values, then run the command again.\n"));
}

main();

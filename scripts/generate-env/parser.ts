/**
 * Extraction des variables depuis les groupes de configuration
 */
import { isCommented } from "./env.types";
import type { ExtractedGroup, VarEntry } from "./types";
import { isEnvVar } from "./utils";

/**
 * Extrait les variables d'un groupe
 *
 * Détecte les valeurs marquées avec commented() et les track
 */
export function extractVarsFromGroup(group: Record<string, unknown>): ExtractedGroup {
    const vars: Record<string, VarEntry> = {};

    for (const [key, value] of Object.entries(group)) {
        if (!isEnvVar(key)) continue;

        if (isCommented(value)) {
            vars[key] = { value: value.value, commented: true };
        } else {
            vars[key] = { value, commented: false };
        }
    }

    return { vars };
}

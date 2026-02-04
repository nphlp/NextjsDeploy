/**
 * Résolution des templates {{VAR}}
 */
import type { VarEntry } from "./types";

const MAX_ITERATIONS = 10;

/**
 * Remplace les templates {{VAR}} par leurs valeurs
 */
function resolveTemplates(value: string, vars: Record<string, string>): string {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const resolved = vars[key];
        return resolved !== undefined ? resolved : match;
    });
}

/**
 * Résout toutes les variables avec leurs dépendances
 *
 * Résolution itérative pour gérer les templates imbriqués :
 * - {{POSTGRES_HOST}} peut dépendre de {{ENV_LABEL}}
 * - {{ENV_LABEL}} peut dépendre de {{projectName}}
 *
 * Préserve le statut "commented" de chaque variable
 */
export function resolveAllVariables(
    vars: Record<string, VarEntry>,
): Record<string, { value: string; commented: boolean }> {
    // Convertir toutes les valeurs en strings
    const resolved: Record<string, { value: string; commented: boolean }> = {};
    for (const [key, entry] of Object.entries(vars)) {
        if (entry.value !== null && entry.value !== undefined) {
            resolved[key] = { value: String(entry.value), commented: entry.commented };
        }
    }

    // Map des valeurs pour la résolution des templates
    const valuesMap = (): Record<string, string> =>
        Object.fromEntries(Object.entries(resolved).map(([k, v]) => [k, v.value]));

    // Résolution itérative jusqu'à stabilisation
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        let hasChanges = false;

        for (const [key, entry] of Object.entries(resolved)) {
            if (entry.value.includes("{{")) {
                const newValue = resolveTemplates(entry.value, valuesMap());
                if (newValue !== entry.value) {
                    resolved[key] = { ...entry, value: newValue };
                    hasChanges = true;
                }
            }
        }

        if (!hasChanges) break;
    }

    return resolved;
}

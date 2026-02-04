/**
 * Génération des groupes de variables pour un environnement
 */
import { extractVarsFromGroup } from "./parser";
import { resolveAllVariables } from "./resolver";
import type { OutputGroup, Settings, VarEntry } from "./types";
import { isGroup } from "./utils";

/**
 * Génère les groupes de variables pour un environnement donné
 *
 * Processus :
 * 1. Collecte toutes les variables (globales + spécifiques)
 * 2. Résout les templates {{VAR}}
 * 3. Fusionne les groupes (env override global)
 * 4. Applique les exclusions
 */
export function generateEnvGroups(
    env: string,
    settings: Settings,
    globalConfig: Record<string, Record<string, unknown>>,
    envConfig: Record<string, Record<string, unknown>>,
): OutputGroup[] {
    const envSpecific = envConfig[env] || {};
    const exclude = new Set<string>(Array.isArray(envSpecific.EXCLUDE) ? (envSpecific.EXCLUDE as string[]) : []);

    // Variables de base pour les templates (non commentées)
    const allVars: Record<string, VarEntry> = {
        ENV: { value: env, commented: false },
        projectName: { value: settings.projectName, commented: false },
    };

    // Ajouter les variables globales
    for (const group of Object.values(globalConfig)) {
        const { vars } = extractVarsFromGroup(group);
        Object.assign(allVars, vars);
    }

    // Override avec les variables de l'environnement
    for (const [key, value] of Object.entries(envSpecific)) {
        if (key === "EXCLUDE") continue;
        if (isGroup(value)) {
            const { vars } = extractVarsFromGroup(value);
            // Les vars commentées ne sont pas ajoutées à allVars (pour la résolution)
            // mais sont trackées séparément
            for (const [varKey, varEntry] of Object.entries(vars)) {
                if (!varEntry.commented) {
                    allVars[varKey] = varEntry;
                }
            }
        }
    }

    // Résoudre tous les templates
    const resolved = resolveAllVariables(allVars);

    // Construire les groupes de sortie
    const outputGroups: OutputGroup[] = [];
    const usedVars = new Set<string>();
    const envGroupNames = Object.keys(envSpecific).filter((k) => isGroup(envSpecific[k]));

    // 1. Traiter les groupes de l'environnement (prioritaires)
    for (const groupName of envGroupNames) {
        const group = processEnvGroup(
            groupName,
            envSpecific[groupName] as Record<string, unknown>,
            globalConfig[groupName],
            settings,
            resolved,
            allVars,
            exclude,
            usedVars,
        );
        if (group) outputGroups.push(group);
    }

    // 2. Ajouter les groupes globaux non traités
    for (const [groupName, group] of Object.entries(globalConfig)) {
        if (envGroupNames.includes(groupName)) continue;

        const outputGroup = processGlobalGroup(groupName, group, settings, resolved, exclude, usedVars);
        if (outputGroup) outputGroups.push(outputGroup);
    }

    return outputGroups;
}

/**
 * Traite un groupe spécifique à l'environnement
 */
function processEnvGroup(
    groupName: string,
    envGroup: Record<string, unknown>,
    globalGroup: Record<string, unknown> | undefined,
    settings: Settings,
    resolved: Record<string, { value: string; commented: boolean }>,
    allVars: Record<string, VarEntry>,
    exclude: Set<string>,
    usedVars: Set<string>,
): OutputGroup | null {
    const { vars: envVars } = extractVarsFromGroup(envGroup);
    const { vars: globalVars } = globalGroup ? extractVarsFromGroup(globalGroup) : { vars: {} };

    // Fusionner les variables (global + env)
    const mergedVarKeys = new Set([...Object.keys(globalVars), ...Object.keys(envVars)]);
    const outputVars: Record<string, { value: string; commented: boolean }> = {};

    // Pour les vars commentées, créer un contexte avec toutes les vars du groupe
    const groupVars = { ...allVars, ...envVars };
    const groupResolved = resolveAllVariables(groupVars);

    for (const varKey of mergedVarKeys) {
        if (exclude.has(varKey)) continue;

        // Priorité à la variable env, sinon globale
        const varEntry = envVars[varKey] || globalVars[varKey];
        if (!varEntry) continue;

        if (varEntry.commented) {
            // Utiliser le contexte du groupe pour résoudre les vars commentées
            const value = groupResolved[varKey]?.value;
            if (value && !value.includes("{{")) {
                outputVars[varKey] = { value, commented: true };
            }
        } else {
            const value = resolved[varKey]?.value;
            if (value && !value.includes("{{")) {
                outputVars[varKey] = { value, commented: false };
                usedVars.add(varKey);
            }
        }
    }

    if (Object.keys(outputVars).length === 0) return null;

    return {
        comment: `# ${settings.groups[groupName]?.comment || groupName}`,
        vars: outputVars,
    };
}

/**
 * Traite un groupe global non présent dans l'environnement
 */
function processGlobalGroup(
    groupName: string,
    group: Record<string, unknown>,
    settings: Settings,
    resolved: Record<string, { value: string; commented: boolean }>,
    exclude: Set<string>,
    usedVars: Set<string>,
): OutputGroup | null {
    const { vars } = extractVarsFromGroup(group);
    const outputVars: Record<string, { value: string; commented: boolean }> = {};

    for (const [key, varEntry] of Object.entries(vars)) {
        if (exclude.has(key) || usedVars.has(key)) continue;

        const value = resolved[key]?.value;
        if (value && !value.includes("{{")) {
            outputVars[key] = { value, commented: varEntry.commented };
            if (!varEntry.commented) {
                usedVars.add(key);
            }
        }
    }

    if (Object.keys(outputVars).length === 0) return null;

    return {
        comment: `# ${settings.groups[groupName]?.comment || groupName}`,
        vars: outputVars,
    };
}

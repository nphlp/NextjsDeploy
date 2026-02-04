/**
 * Utilitaires pour le script de génération
 */

// Couleurs terminal ANSI
export const colors = {
    green: (s: string) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
    red: (s: string) => `\x1b[31m${s}\x1b[0m`,
};

/**
 * Vérifie si une clé est une variable d'environnement (UPPER_SNAKE_CASE)
 */
export const isEnvVar = (key: string): boolean => /^[A-Z][A-Z0-9_]*$/.test(key);

/**
 * Vérifie si une valeur est un objet (groupe de config)
 */
export const isGroup = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

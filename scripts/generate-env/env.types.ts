/**
 * Types pour la configuration des variables d'environnement
 */

// Structure d'un groupe dans settings
type GroupDefinition = {
    comment: string;
    variables: readonly string[];
};

// Structure de base pour settings
export type SettingsShape = {
    projectName: string;
    envs: Record<string, string>;
    groups: Record<string, GroupDefinition>;
};

// Inférence des types depuis settings
export type InferEnvName<T extends SettingsShape> = keyof T["envs"];
export type InferGroupName<T extends SettingsShape> = keyof T["groups"];

// Extraire les variables d'un groupe
type ExtractVariables<T extends GroupDefinition> = T["variables"][number];

// Valeur commentée (sera préfixée par # dans le .env)
const COMMENTED_SYMBOL = Symbol("commented");
export type CommentedValue = { [COMMENTED_SYMBOL]: true; value: string | number | boolean };

// Configuration d'un groupe (avec uniquement les variables déclarées)
type GroupConfig<T extends GroupDefinition> = Partial<
    Record<ExtractVariables<T>, string | number | boolean | CommentedValue>
>;

// Configuration globale (partielle, groupes optionnels)
export type GlobalConfig<T extends SettingsShape> = {
    [K in keyof T["groups"]]?: GroupConfig<T["groups"][K]>;
};

// Configuration par environnement (avec EXCLUDE)
export type EnvConfig<T extends SettingsShape> = {
    [K in keyof T["groups"]]?: GroupConfig<T["groups"][K]>;
} & {
    EXCLUDE?: string[];
};

// Configuration complète de tous les environnements
export type EnvsConfig<T extends SettingsShape> = {
    [E in InferEnvName<T>]: EnvConfig<T>;
};

// Helper pour marquer une chaîne comme template
export const template = (str: string): string => str;

// Helper pour marquer une valeur comme commentée
export const commented = (value: string | number | boolean): CommentedValue => ({
    [COMMENTED_SYMBOL]: true,
    value,
});

// Type guard pour vérifier si une valeur est commentée
export const isCommented = (value: unknown): value is CommentedValue =>
    typeof value === "object" && value !== null && COMMENTED_SYMBOL in value;

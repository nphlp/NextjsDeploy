/**
 * Types internes pour le générateur
 */

/** Définition d'un groupe dans settings */
export interface GroupDefinition {
    comment: string;
    variables: readonly string[];
}

/** Configuration chargée depuis env.config.ts */
export interface Settings {
    projectName: string;
    envs: Record<string, string>;
    groups: Record<string, GroupDefinition>;
}

/** Variable avec son statut (commentée ou non) */
export interface VarEntry {
    value: unknown;
    commented: boolean;
}

/** Variables extraites d'un groupe */
export interface ExtractedGroup {
    vars: Record<string, VarEntry>;
}

/** Groupe formaté pour la sortie */
export interface OutputGroup {
    comment: string;
    vars: Record<string, { value: string; commented: boolean }>;
}

/** Configuration complète chargée */
export interface LoadedConfig {
    settings: Settings;
    ENV_LIST: readonly string[];
    globalConfig: Record<string, Record<string, unknown>>;
    envConfig: Record<string, Record<string, unknown>>;
}

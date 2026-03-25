import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

export const subjects = ["improvement", "bug", "security", "other"] as const;
export type Subject = (typeof subjects)[number];

export const subjectLabels: Record<Subject, string> = {
    improvement: "Proposer une amélioration",
    bug: "Signaler un bug",
    security: "Problème de sécurité",
    other: "Autre",
};

/**
 * Query parameters for contact page
 */
export const queryParams = {
    subject: parseAsStringLiteral(subjects),
};

/**
 * Query parser for server-side usage
 */
export const queryParamsCached = createSearchParamsCache(queryParams);

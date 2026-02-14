/**
 * Auth error code translations
 *
 * Error codes are returned by the server (auth-middleware.ts + Better Auth plugins).
 * This map translates them to user-facing French messages.
 */
const authErrors: Record<string, string> = {
    // Auth middleware (lib/auth-middleware.ts)
    EMAIL_INVALID: "Ce domaine email n'est pas autorisé.",
    PASSWORD_MISSING: "Le mot de passe est requis.",
    PASSWORD_INVALID: "Le mot de passe ne respecte pas les critères de sécurité.",
    // Have I Been Pwned plugin (lib/auth.ts)
    PASSWORD_COMPROMISED: "Ce mot de passe a été compromis dans une fuite de données. Choisissez-en un autre.",
};

const DEFAULT_ERROR = "Une erreur est survenue. Veuillez réessayer.";

/**
 * Translate an auth error code to a user-facing message.
 * Falls back to the raw message if no translation exists,
 * or to a generic message if no message is provided.
 */
export function translateAuthError(message: string | undefined): string {
    if (!message) return DEFAULT_ERROR;
    return authErrors[message] ?? message;
}

/**
 * Check if an error is a validation error (user must fix their input).
 * Non-validation errors (e.g. "user already exists") can be hidden
 * to prevent email enumeration.
 */
export function isValidationError(message: string | undefined): boolean {
    if (!message) return false;
    return message in authErrors;
}

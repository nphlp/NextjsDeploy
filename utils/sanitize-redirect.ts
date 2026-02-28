/**
 * Sanitize a redirect URL to prevent open redirect attacks.
 * Returns a safe relative path or empty string if invalid.
 *
 * Rejects:
 * - Absolute URLs (https://evil.com)
 * - Protocol-relative URLs (//evil.com)
 * - Backslash tricks (/\evil.com → browsers normalize to //evil.com)
 * - Malformed percent-encoding (%GG)
 *
 * ```ts
 * sanitizeRedirect("/dashboard")         // "/dashboard"
 * sanitizeRedirect("%2Ffruit%2Fcreate")  // "/fruit/create"
 * sanitizeRedirect("//evil.com")         // ""
 * sanitizeRedirect("/\\evil.com")        // ""
 * sanitizeRedirect("https://evil.com")   // ""
 * sanitizeRedirect(null)                 // ""
 * ```
 */
export const sanitizeRedirect = (value: string | null | undefined): string => {
    if (!value) return "";

    try {
        const decoded = decodeURIComponent(value);
        if (!decoded.startsWith("/")) return "";
        if (/^\/[/\\]/.test(decoded)) return "";
        return decoded;
    } catch {
        return "";
    }
};

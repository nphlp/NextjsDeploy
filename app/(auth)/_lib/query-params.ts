import { sanitizeRedirect } from "@utils/sanitize-redirect";
import { createParser, createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Redirect parser
 * -> Sanitized relative path only, no open redirect
 */
const redirectParser = createParser({
    parse: (value: string) => sanitizeRedirect(value),
    serialize: (value: string) => value,
});

/**
 * Query parameters for auth pages (login, verify-2fa)
 */
export const queryParams = {
    redirect: redirectParser.withDefault(""),
};

/**
 * Query parser for server-side usage
 */
export const queryParamsCached = createSearchParamsCache(queryParams);

/**
 * Parsed query parameters type
 */
export type QueryParamsCachedType = Awaited<ReturnType<typeof queryParamsCached.parse>>;

/**
 * Query URL serializer for building redirect URLs
 */
export const queryUrlSerializer = createSerializer(queryParams);

import { createParser, createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Redirect parser
 * -> Relative path only, no open redirect (rejects "//" and non-"/" prefixed values)
 */
const redirectParser = createParser({
    parse: (value: string) => (value.startsWith("/") && !value.startsWith("//") ? value : ""),
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

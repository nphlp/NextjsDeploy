import { createSearchParamsCache, createSerializer, parseAsString } from "nuqs/server";

/**
 * Query parameters for reset password success page
 */
export const queryParams = {
    email: parseAsString.withDefault(""),
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

import { parseAsInteger } from "nuqs/server";
import { createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Server parsers structure for query parameters for fruits example
 */
export const fruitQueryParams = {
    /** Take: Number of fruits to display (default value: 3) */
    take: parseAsInteger.withDefault(3),
};

/**
 * Utility function to parse and cache fruit query parameters server side
 */
export const fruitQueryParamsCached = createSearchParamsCache(fruitQueryParams);

export type FruitQueryParamsCachedType = Awaited<ReturnType<typeof fruitQueryParamsCached.parse>>;

/**
 * Serializer to construct an URL with query params
 */
export const fruitUrlSerializer = createSerializer(fruitQueryParams);

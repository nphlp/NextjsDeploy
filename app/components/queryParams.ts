import { searchQueryParser, updatedAtQueryParser } from "@comps/SHARED/filters/queryParamsServerParsers";
import { createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Server parsers structure for query parameters for the home
 */
export const homeQueryParams = {
    /** Updated at order (default value: `"desc"`) */
    updatedAt: updatedAtQueryParser,
    /** Search (default value: `""`) */
    search: searchQueryParser,
};

/**
 * Utility function to parse and cache home query parameters server side
 */
export const homeQueryParamsCached = createSearchParamsCache(homeQueryParams);

export type HomeQueryParamsCachedType = Awaited<ReturnType<typeof homeQueryParamsCached.parse>>;

/**
 * Serializer to construct an URL with query params
 */
export const homeUrlSerializer = createSerializer(homeQueryParams);

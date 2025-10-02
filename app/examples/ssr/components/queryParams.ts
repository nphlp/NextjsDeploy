import { searchQueryParser, updatedAtQueryParser } from "@comps/SHARED/filters/queryParamsServerParsers";
import { createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Server parsers structure for query parameters for the exampleSrr
 */
export const exampleSrrQueryParams = {
    /** Updated at order (default value: `"desc"`) */
    updatedAt: updatedAtQueryParser,
    /** Search (default value: `""`) */
    search: searchQueryParser,
};

/**
 * Utility function to parse and cache exampleSrr query parameters server side
 */
export const exampleSrrQueryParamsCached = createSearchParamsCache(exampleSrrQueryParams);

export type ExampleSrrQueryParamsCachedType = Awaited<ReturnType<typeof exampleSrrQueryParamsCached.parse>>;

/**
 * Serializer to construct an URL with query params
 */
export const exampleSrrUrlSerializer = createSerializer(exampleSrrQueryParams);

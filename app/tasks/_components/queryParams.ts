import { searchQueryParser, updatedAtQueryParser } from "@comps/SHARED/filters/queryParamsServerParsers";
import { createSearchParamsCache, createSerializer } from "nuqs/server";

/**
 * Server parsers structure for query parameters for the task
 */
export const taskQueryParams = {
    /** Updated at order (default value: `"desc"`) */
    updatedAt: updatedAtQueryParser,
    /** Search (default value: `""`) */
    search: searchQueryParser,
};

/**
 * Utility function to parse and cache task query parameters server side
 */
export const taskQueryParamsCached = createSearchParamsCache(taskQueryParams);

export type TaskQueryParamsCachedType = Awaited<ReturnType<typeof taskQueryParamsCached.parse>>;

/**
 * Serializer to construct an URL with query params
 */
export const taskUrlSerializer = createSerializer(taskQueryParams);

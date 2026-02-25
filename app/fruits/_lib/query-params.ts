import { createParser, createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { z } from "zod";

/**
 * Items per page for pagination
 */
export const ITEMS_PER_PAGE = 30;

/**
 * Order values for fruit sorting
 */
const orderValues = ["asc", "desc"] as const;
export type OrderValue = (typeof orderValues)[number];

/**
 * Order parser
 * -> "asc" | "desc" (default: "asc")
 */
const orderParser = createParser({
    parse: (value: string) => z.enum(orderValues).parse(value),
    serialize: (value: OrderValue) => value,
});

/**
 * Query parameters for fruits page
 */
export const queryParams = {
    search: parseAsString.withDefault(""),
    order: orderParser.withDefault("asc"),
    page: parseAsInteger.withDefault(1),
};

/**
 * Query parser for server-side usage
 */
export const queryParamsCached = createSearchParamsCache(queryParams);

/**
 * Parsed query parameters type
 */
export type QueryParamsCachedType = Awaited<ReturnType<typeof queryParamsCached.parse>>;

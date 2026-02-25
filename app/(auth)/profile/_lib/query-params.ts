import { createParser, createSearchParamsCache, createSerializer } from "nuqs/server";
import { z } from "zod";

/**
 * Profile tab values
 */
const tabValues = ["profile", "edition", "security"] as const;
export type TabValue = (typeof tabValues)[number];

/**
 * Tab parser
 * -> "profile" | "edition" | "security" (default: "profile")
 */
const tabParser = createParser({
    parse: (value: string) => z.enum(tabValues).parse(value),
    serialize: (value: string) => value,
});

/**
 * Query parameters for profile page
 */
export const queryParams = {
    tab: tabParser.withDefault("profile"),
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
 * Query URL serializer for server-side usage
 */
export const queryUrlSerializer = createSerializer(queryParams);

import { parseAsString, parseAsStringEnum } from "nuqs/server";

/**
 * This file contains all server parsers for query parameters used in client components
 */

// Updated at order filter
export const updatedAtQueryParser = parseAsStringEnum(["asc", "desc"]).withDefault("desc");

// Search filter
export const searchQueryParser = parseAsString.withDefault("");

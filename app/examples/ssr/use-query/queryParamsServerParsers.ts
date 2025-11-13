import { parseAsInteger } from "nuqs/server";

/**
 * This file contains all server parsers for query parameters used in the fruits example
 */

// Take filter - number of fruits to display
export const takeQueryParser = parseAsInteger.withDefault(3);

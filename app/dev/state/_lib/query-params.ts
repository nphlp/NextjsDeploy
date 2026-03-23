import { parseAsInteger } from "nuqs/server";

export const queryParams = {
    count: parseAsInteger.withDefault(0),
};

import { Prisma } from "@prisma/client/client";
import { deepPropsSort } from "@utils/string-format";

type ModelName = keyof Prisma.TypeMap["model"];
type ModelNameLowerCase = Prisma.TypeMap["meta"]["modelProps"];

type PrismaOperations = keyof Prisma.TypeMap["model"][ModelName]["operations"];

// Fetch operations
export type FetchOps = Extract<
    PrismaOperations,
    "findMany" | "findUnique" | "findFirst" | "count" | "aggregate" | "groupBy"
>;

const tag = (model: ModelNameLowerCase, operation?: FetchOps, custom?: string | number | Record<string, unknown>) => {
    let tag = `${model}`;

    if (operation) {
        tag += `-${operation}`;
    }

    if (custom && typeof custom === "object") {
        tag += `-${deepPropsSort(custom)}`;
    }

    if (custom && typeof custom !== "object") {
        tag += `-${String(custom)}`;
    }

    // TODO: add 256 hash function to reduce tag length
    // Hash method ?
    tag = tag.length > 256 ? tag.slice(0, 255) : tag;

    return tag;
};

/**
 * Invalidate cache tag
 *
 * #### Mode "update"
 * Delete cache entry -> Cache will be regenerated on next request
 * **Pros**: Fresh data
 * **Cons**: Slow for the next user
 *
 * #### Mode "revalidate"
 * Revalidate cache entry -> Cache will be kept until next request, then regenerated in the background
 * **Pros**: Fast for the next user
 * **Cons**: Deprecated data
 */
// const invalidateCacheTag = (
//     mode: "update" | "revalidate",
//     model: ModelNameLowerCase,
//     operation?: FetchOps,
//     custom?: string | number | Record<string, unknown>,
// ) => {
//     const tagString = createCacheTag(model, operation, custom);

//     /**
//      * Delete cache entry
//      * -> Cache will be regenerated on next request
//      *
//      * **Pros**: Fresh data
//      * **Cons**: Slow for the next user
//      */
//     if (mode === "update") {
//         updateTag(tagString);
//     }

//     /**
//      * Revalidate cache entry
//      *
//      * -> Cache will be kept until next request, then regenerated in the background
//      *
//      * **Pros**: Fast for the next user
//      * **Cons**: Deprecated data
//      */
//     if (mode === "revalidate") {
//         revalidateTag(tagString, "max");
//     }
// };

export { tag };

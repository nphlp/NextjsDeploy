import "server-only";
import task from "../api/task";
import user from "../api/user";
import { SolidRouterStructure } from "./solid-types";

/**
 * API Prefix **(required)**
 *
 * Defines the base path segments for Solid API routes
 *
 * -> Nextjs App router: `/api/solid/[...segments]/routes.ts`
 * -> Solid Api structure: `/api/solid/{group}/{method}`
 */
export const apiPrefix: string[] = ["api", "solid"];

/**
 * Solid Router **(required)**
 *
 * Aggregates Solid API groups and methods
 * into a single router object
 *
 * Example:
 * - SolidRouter.task.list -> task list method
 * - SolidRouter.user.create -> user create method
 */
const SolidRouter = {
    task: {
        list: task.list,
        get: task.get,
        create: task.create,
        update: task.update,
        delete: task.delete,
    },
    user: {
        list: user.list,
        get: user.get,
        create: user.create,
        update: user.update,
        delete: user.delete,
    },
} satisfies SolidRouterStructure;

/**
 * Solid Router Type **(required)**
 *
 * Exports the type of the SolidRouter object
 */
export type SolidRouterType = typeof SolidRouter;

export default SolidRouter;

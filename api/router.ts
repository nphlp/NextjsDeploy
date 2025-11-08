import "server-only";
import { pageRoutes } from "./page";
import { taskRoutes } from "./task";
import { userRoutes } from "./user";

export const appRouter = {
    task: taskRoutes,
    user: userRoutes,
    page: pageRoutes,
};

export type AppRouter = typeof appRouter;

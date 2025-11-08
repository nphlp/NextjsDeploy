import "server-only";
import { taskRoutes } from "./task";
import { userRoutes } from "./user";

export const appRouter = {
    task: taskRoutes,
    user: userRoutes,
};

export type AppRouter = typeof appRouter;

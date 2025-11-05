import "server-only";
import { taskRoutes } from "../api/task";
import { userRoutes } from "../api/user";

export const appRouter = {
    task: taskRoutes,
    user: userRoutes,
};

export type AppRouter = typeof appRouter;

import "server-only";
import taskMutations from "./task/task-mutation";
import taskQueries from "./task/task-query";
import userMutations from "./user/user-mutation";
import userQueries from "./user/user-query";

export const appRouter = {
    task: {
        ...taskQueries(),
        ...taskMutations(),
    },
    user: {
        ...userQueries(),
        ...userMutations(),
    },
};

export type AppRouter = typeof appRouter;

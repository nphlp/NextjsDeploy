import "server-only";
import fruitQueries from "./fruit/fruit-query";
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
    fruit: {
        ...fruitQueries(),
    },
};

export type AppRouter = typeof appRouter;

import "server-only";
import basketQueries from "./basket/basket-query";
import fruitMutations from "./fruit/fruit-mutation";
import fruitQueries from "./fruit/fruit-query";
import taskMutations from "./task/task-mutation";
import taskQueries from "./task/task-query";
import userMutations from "./user/user-mutation";
import userQueries from "./user/user-query";

export const apiRouter = {
    task: {
        ...taskQueries,
        ...taskMutations,
    },
    user: {
        ...userQueries,
        ...userMutations,
    },
    fruit: {
        ...fruitQueries,
        ...fruitMutations,
    },
    basket: {
        ...basketQueries,
    },
};

export type ApiRouter = typeof apiRouter;

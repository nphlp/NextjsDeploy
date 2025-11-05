import task from "../api/task-routes";
import user from "../api/user-routes";
import { SolidBuilder } from "./solid-builder";

type SolidRouterStructure = {
    // eslint-disable-next-line
    [apiRoute: string]: SolidBuilder<any, any>;
};

const SolidRouter = {
    // User Routes
    "/user/list": user.list,
    "/user/get": user.get,
    "/user/create": user.create,
    "/user/update": user.update,
    "/user/delete": user.delete,

    // Task Routes
    "/task/list": task.list,
    "/task/get": task.get,
    "/task/create": task.create,
    "/task/update": task.update,
    "/task/delete": task.delete,
} satisfies SolidRouterStructure;

export default SolidRouter;

type SolidRouterType = typeof SolidRouter;
type SolidRoutes = keyof SolidRouterType;

export type { SolidRouterType, SolidRoutes };

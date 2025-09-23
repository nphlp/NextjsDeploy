import { HealthResponse } from "./health/route";
import { type Routes as InternalRoutes } from "./internal/Routes";

type SubRoutes<Input> = InternalRoutes<Input>;

export type Routes<Input> = SubRoutes<Input> & {
    "/health": () => {
        response: HealthResponse;
    };
};

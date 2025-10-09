import { HealthResponse } from "./health/route";
import { type Routes as InternalRoutes } from "./internal/Routes";
import { LocationProps, LocationResponse } from "./location/route";

type SubRoutes<Input> = InternalRoutes<Input>;

export type Routes<Input> = SubRoutes<Input> & {
    "/health": () => {
        response: HealthResponse;
    };
    "/location": () => {
        method: "GET";
        params: LocationProps;
        response: LocationResponse;
    };
};

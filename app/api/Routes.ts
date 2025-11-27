import { HealthResponse } from "./health/route";
import { LocationProps, LocationResponse } from "./location/route";
import { type Routes as SolidRoutes } from "./solid/Routes";

export type Routes<Input> = SolidRoutes<Input> & {
    "/health": () => {
        response: HealthResponse;
    };
    "/location": () => {
        method: "GET";
        params: LocationProps;
        response: LocationResponse;
    };
};

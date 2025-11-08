import { HealthResponse } from "./health/route";
import { LocationProps, LocationResponse } from "./location/route";
import { type Routes as SolidRoutes } from "./solid/Routes";

type SubRoutes<Input> = SolidRoutes<Input>;

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

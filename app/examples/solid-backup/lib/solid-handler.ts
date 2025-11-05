import { NextRequest } from "next/server";
import SolidRouter, { SolidRouterType, SolidRoutes } from "./solid-router";

const findFunctionInRouter = (router: SolidRouterType, segments: string[]) => {
    try {
        const path = `/${segments.join("/")}` as SolidRoutes;
        return router[path];
    } catch {
        return undefined;
    }
};

type ParamsProps = {
    params: Promise<{ segments: string[] }>;
};

const findCorrespondingRoute = async (request: NextRequest, props: ParamsProps) => {
    const { segments } = await props.params;

    // Find the function in the router based on segments
    const routeFunction = findFunctionInRouter(SolidRouter, segments);

    // Not found
    if (!routeFunction) return Response.json({ error: "Route not found" }, { status: 404 });

    // Execute function
    return routeFunction.execute(request);
};

export default function SolidHandler() {
    const GET = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);

    const POST = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);

    return { GET, POST };
}

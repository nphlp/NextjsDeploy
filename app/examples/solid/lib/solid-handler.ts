import { NextRequest } from "next/server";
import SolidRouter from "./solid";
import { SolidGroup, SolidRouterType } from "./solid-types";

const findFunctionInRouter = (router: SolidRouterType, segments: string[]) => {
    try {
        const group = segments[0] as SolidGroup;
        const method = segments[1] as keyof SolidRouterType[SolidGroup];
        return router[group][method];
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
    return routeFunction.executeRequest(request);
};

export default function SolidHandler() {
    const GET = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);
    const POST = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);
    const PUT = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);
    const PATCH = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);
    const DELETE = async (request: NextRequest, props: ParamsProps) => findCorrespondingRoute(request, props);

    return { GET, POST, PUT, PATCH, DELETE };
}

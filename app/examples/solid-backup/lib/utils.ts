import { NextRequest } from "next/server";

export const createApiURL = ({
    baseURL,
    prefix,
    route,
    searchParams,
}: {
    baseURL: string | undefined;
    prefix: string[];
    route: string;
    searchParams?: URLSearchParams;
}): URL => {
    const routeUrl = new URL(prefix.join("/") + route, baseURL);
    if (searchParams) routeUrl.search = searchParams.toString();
    return routeUrl;
};

export const encodeParams = (params: Record<string, unknown>): URLSearchParams => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(encodeURIComponent(key), encodeURIComponent(JSON.stringify(value)));
    }
    return searchParams;
};

export const decodeParams = (params: URLSearchParams) => {
    const keyValueArray: [string, string][] = Array.from(params.entries());
    const decodedKeyValueArray = keyValueArray.map(([key, value]) => [
        decodeURIComponent(key),
        JSON.parse(decodeURIComponent(value)),
    ]);
    return Object.fromEntries(decodedKeyValueArray);
};

export const extractParamsOrBody = async <T>(request: NextRequest): Promise<T> => {
    if (request.method === "GET") return decodeParams(request.nextUrl.searchParams);
    if (request.method === "POST") return await request.json();
    throw new Error("Unsupported request method");
};

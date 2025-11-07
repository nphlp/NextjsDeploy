import { ApiResponse } from "./solid-builder";
import { SolidClientType } from "./solid-types";
import { createApiURL } from "./utils";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

const isClient = typeof window !== "undefined";
const apiPrefix = ["api", "solid"];

/**
 * Creates a Proxy-based client that intercepts calls and makes fetch requests
 * This allows type-safe calls without knowing the routes at build time
 *
 * Example:
 * - client.task.list({ userId: "123" })
 * - Gets intercepted by Proxy
 * - Makes fetch to /api/solid/task/list
 */
export function createSolidClient(): SolidClientType {
    // eslint-disable-next-line
    const createProxy = (path: string[] = []): any => {
        return new Proxy(() => {}, {
            // Intercept property access (e.g., client.task)
            get(target, prop: string) {
                if (prop === "then" || prop === "catch" || typeof prop === "symbol") {
                    return undefined;
                }
                return createProxy([...path, prop]);
            },

            // Intercept function calls (e.g., client.task.list(...))
            // eslint-disable-next-line
            apply(target, thisArg, args: [any?, AbortSignal?]) {
                const [input, signal] = args;

                // Build route from path
                // path = ["task", "list"] -> route = "/task/list"
                const route = "/" + path.join("/");

                // Make fetch request
                return executeFetch(route, input, signal);
            },
        });
    };

    return createProxy() as SolidClientType;
}

// eslint-disable-next-line
async function executeFetch(route: string, input?: any, signal?: AbortSignal): Promise<any> {
    try {
        const baseUrl = isClient ? window.location.origin : NEXT_PUBLIC_BASE_URL;

        // For now, assume all routes use POST
        // TODO: Could be improved by storing method metadata
        const method = "POST";

        const url = createApiURL({
            baseUrl,
            prefix: apiPrefix,
            route,
            searchParams: undefined,
        });

        const headers = {
            "Content-Type": "application/json",
        };

        const body = input !== undefined ? JSON.stringify(input) : undefined;

        const response = await fetch(url, {
            method,
            headers,
            body,
            signal,
        });

        // eslint-disable-next-line
        const { data, error }: ApiResponse<any> = await response.json();

        if (error || data === undefined) {
            throw new Error(error ?? "Something went wrong...");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

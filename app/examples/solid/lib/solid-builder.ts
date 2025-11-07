import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { ZodType } from "zod";
import { extractParamsOrBody } from "./utils";

export type ApiResponse<Data> =
    | {
          data: Data;
          error?: undefined;
      }
    | {
          data?: undefined;
          error: string;
      };

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type BuilderProps<Input, Output> = {
    method?: Method;
    path?: string;
    inputSchema?: ZodType<Input>;
    outputSchema?: ZodType<Output>;
    middlewareFn?: (request: NextRequest) => Promise<NextRequest>;
    permissionsFn?: (input: Input) => Promise<boolean>;
    handlerFn?: (input: Input) => Promise<Output>;
};

class SolidBuilder<Input, Output> {
    public props?: BuilderProps<Input, Output>;

    // Input and Output types inference
    readonly _input!: Input;
    readonly _output!: Output;

    constructor(props?: BuilderProps<Input, Output>) {
        this.props = props;
    }

    input<T>(inputSchema: ZodType<T>) {
        return new SolidBuilder<T, Output>({
            ...this.props,
            inputSchema,
            // Overwrite types for middleware, permissions and handler functions
            middlewareFn: this.props?.middlewareFn as unknown as BuilderProps<T, Output>["middlewareFn"],
            permissionsFn: this.props?.permissionsFn as unknown as BuilderProps<T, Output>["permissionsFn"],
            handlerFn: this.props?.handlerFn as unknown as BuilderProps<T, Output>["handlerFn"],
        });
    }

    output<U>(outputSchema: ZodType<U>) {
        return new SolidBuilder<Input, U>({
            ...this.props,
            outputSchema,
            // Overwrite types for middleware, permissions and handler functions
            handlerFn: this.props?.handlerFn as unknown as BuilderProps<Input, U>["handlerFn"],
        });
    }

    middleware(middlewareFn: (request: NextRequest) => Promise<NextRequest>) {
        return new SolidBuilder({ ...this.props, middlewareFn });
    }

    permissions(permissionsFn: (input: Input) => Promise<boolean>) {
        return new SolidBuilder({ ...this.props, permissionsFn });
    }

    handler(handlerFn: (input: Input) => Promise<Output>) {
        return new SolidBuilder({ ...this.props, handlerFn });
    }

    // async generateFetcher(): Promise<(props: Input, signal?: AbortSignal) => Promise<Output>> {
    //     const { apiPrefix: prefix } = await import("./solid");

    //     const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    //     if (!NEXT_PUBLIC_BASE_URL) throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");

    //     const isClient = typeof window !== "undefined";

    //     const fetcher = async (props?: Input, signal?: AbortSignal): Promise<Output> => {
    //         try {
    //             if (!this.props?.path) throw new Error("Missing `path()`");
    //             if (!this.props?.method) throw new Error("Missing `method()`");

    //             // Route params
    //             const baseUrl = isClient ? "" : NEXT_PUBLIC_BASE_URL;
    //             const route = this.props.path;
    //             const method = this.props.method;
    //             const searchParams =
    //                 props !== undefined && method === "GET"
    //                     ? encodeParams(props as Record<string, unknown>)
    //                     : undefined;

    //             // Fetch params
    //             const url = createApiURL({ baseUrl, prefix, route, searchParams });
    //             const headers = {
    //                 "Content-Type": "application/json",
    //             };
    //             const body = props !== undefined && method === "POST" ? JSON.stringify(props) : undefined;

    //             // Execute fetch
    //             const response = await fetch(url, {
    //                 method,
    //                 headers,
    //                 body,
    //                 signal,
    //             });

    //             const { data, error }: ApiResponse<Output> = await response.json();

    //             if (error || data === undefined) {
    //                 throw new Error(error ?? "Something went wrong...");
    //             }

    //             return data;
    //         } catch (error) {
    //             throw error;
    //         }
    //     };

    //     return fetcher;
    // }

    async executeService(props?: Input): Promise<Output> {
        try {
            if (!this.props?.inputSchema) throw new Error("Missing `input()`");
            if (!this.props?.outputSchema) throw new Error("Missing `output()`");
            if (!this.props?.handlerFn) throw new Error("Missing `handler()`");

            // Parse input
            const input = this.props.inputSchema.parse(props);

            // Execute permissions if defined
            const hasPermission = (await this.props?.permissionsFn?.(input)) ?? true;
            if (!hasPermission) throw new Error("Unauthorized");

            // Execute handler
            const response = await this.props.handlerFn(input);

            // Validate output
            const output = this.props.outputSchema.parse(response);

            return output;
        } catch (error) {
            // TODO: improve error handling
            throw error;
        }
    }

    async executeRequest(request: NextRequest): Promise<NextResponse<ApiResponse<Output>>> {
        try {
            // Execute middleware if defined
            const middlewareRequest = await this.props?.middlewareFn?.(request);

            // Extract raw input data
            // -> from url for if GET
            // -> from body for if POST, PUT, PATCH, DELETE
            const rawInputData = await extractParamsOrBody<Input>(middlewareRequest ?? request);

            // Execute service
            const output = await this.executeService(rawInputData);

            return NextResponse.json({ data: output }, { status: 200 });
        } catch (error) {
            const message = (error as Error).message ?? "Something went wrong...";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}

type InferInput<T> = T extends { _input: infer I } ? I : never;
type InferOutput<T> = T extends { _output: infer O } ? O : never;

export const SolidApi = (props: { method: Method; path: string }) => new SolidBuilder(props);
export type { SolidBuilder, InferInput, InferOutput };

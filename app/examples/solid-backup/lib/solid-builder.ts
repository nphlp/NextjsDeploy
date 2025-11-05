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

type BuilderProps<Input, Output> = {
    inputSchema?: ZodType<Input>;
    outputSchema?: ZodType<Output>;
    middlewareFn?: (request: NextRequest) => Promise<NextRequest>;
    permissionsFn?: (input: Input) => Promise<boolean>;
    handlerFn?: (input: Input) => Promise<Output>;
};

class SolidBuilder<Input, Output> {
    public method: "GET" | "POST";
    public args?: BuilderProps<Input, Output>;

    // Type helpers to expose Input and Output types for inference
    readonly _input!: Input;
    readonly _output!: Output;

    constructor(method: "GET" | "POST", args?: BuilderProps<Input, Output>) {
        this.method = method;
        this.args = args;
    }

    input<T>(inputSchema: ZodType<T>) {
        return new SolidBuilder<T, Output>(this.method, {
            ...this.args,
            inputSchema,
            // Overwrite types for middleware, permissions and handler functions
            middlewareFn: this.args?.middlewareFn as unknown as BuilderProps<T, Output>["middlewareFn"],
            permissionsFn: this.args?.permissionsFn as unknown as BuilderProps<T, Output>["permissionsFn"],
            handlerFn: this.args?.handlerFn as unknown as BuilderProps<T, Output>["handlerFn"],
        });
    }

    output<U>(outputSchema: ZodType<U>) {
        return new SolidBuilder<Input, U>(this.method, {
            ...this.args,
            outputSchema,
            // Overwrite types for middleware, permissions and handler functions
            handlerFn: this.args?.handlerFn as unknown as BuilderProps<Input, U>["handlerFn"],
        });
    }

    middleware(middlewareFn: (request: NextRequest) => Promise<NextRequest>) {
        return new SolidBuilder(this.method, { ...this.args, middlewareFn });
    }

    permissions(permissionsFn: (input: Input) => Promise<boolean>) {
        return new SolidBuilder(this.method, { ...this.args, permissionsFn });
    }

    handler(handlerFn: (input: Input) => Promise<Output>) {
        return new SolidBuilder(this.method, { ...this.args, handlerFn });
    }

    async executeService(props: Input): Promise<Output> {
        try {
            if (!this.args?.inputSchema) throw new Error("Missing `input()` in solidApi builder");
            if (!this.args?.outputSchema) throw new Error("Missing `output()` in solidApi builder");
            if (!this.args?.handlerFn) throw new Error("Missing `handler()` in solidApi builder");

            // Parse input
            const input = this.args.inputSchema.parse(props);

            // Execute permissions if defined
            const hasPermission = await this.args?.permissionsFn?.(input);
            if (!hasPermission) throw new Error("Unauthorized");

            // Execute handler
            const response = await this.args.handlerFn(input);

            // Validate output
            const output = this.args.outputSchema.parse(response);

            return output;
        } catch (error) {
            // TODO: improve error handling
            throw error;
        }
    }

    async executeRequest(request: NextRequest): Promise<NextResponse<ApiResponse<Output>>> {
        try {
            // Execute middleware if defined
            const middlewareRequest = await this.args?.middlewareFn?.(request);

            // Extract raw input data
            // -> from url for if GET
            // -> from body for if POST
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

type SolidApiType = {
    method: "GET" | "POST";
};

export const SolidApi = (props: SolidApiType) => new SolidBuilder(props.method);

// Type helpers to extract Input and Output from SolidBuilder using phantom properties
type InferInput<T> = T extends { _input: infer I } ? I : never;
type InferOutput<T> = T extends { _output: infer O } ? O : never;

export type { SolidBuilder, InferInput, InferOutput };

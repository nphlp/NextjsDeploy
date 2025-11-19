import { Prisma } from "@prisma/client/client";
import { ZodError } from "zod";

type Response<T> = {
    data: T;
    error?: undefined;
};

type ErrorResponse = {
    data?: undefined;
    error: string;
};

export type ActionResponse<T> = Response<T> | ErrorResponse;

/**
 * An Error class to send safe error messages to the client.
 */
export class ClientError extends Error {
    public readonly clientMessage: string;

    constructor(message: string) {
        super();
        this.clientMessage = message;
    }
}

export const ActionError = (error: unknown): ErrorResponse => {
    // Server logging
    console.error(error);

    // Return client error message
    if (error instanceof ClientError) {
        return { error: error.clientMessage };
    }

    const isDev = process.env.NODE_ENV === "development";

    // Throw Zod validation error
    if (isDev && error instanceof ZodError) {
        throw error;
    }

    // Throw Prisma error
    if (isDev && error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
    }

    // Throw generic error in development
    if (isDev) {
        throw error;
    }

    // Fallback generic error message
    return { error: "Something went wrong" };
};

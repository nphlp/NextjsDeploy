import { type ZodType, z } from "zod";

export type CounterCookie = {
    count: number;
};

export const counterCookieSchema = z.object({
    count: z.number(),
}) satisfies ZodType<CounterCookie>;

export const defaultCounterCookie: CounterCookie = {
    count: 0,
};

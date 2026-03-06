import { type ZodType, z } from "zod";

export type CounterState = {
    count: number;
};

export const counterSchema = z.object({
    count: z.number(),
}) satisfies ZodType<CounterState>;

export const defaultCounterState: CounterState = {
    count: 0,
};

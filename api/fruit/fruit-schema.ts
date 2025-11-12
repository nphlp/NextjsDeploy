import { Fruit } from "@prisma/client";
import z, { ZodType } from "zod";

const fruitOutputSchema: ZodType<Fruit> = z.object({
    id: z.string().describe("Unique ID of the fruit (nanoid)"),
    name: z.string().describe("Name of the fruit"),
    description: z.string().nullable().describe("Description of the fruit"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

export {
    // Output schema
    fruitOutputSchema,
};

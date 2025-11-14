import { Fruit } from "@prisma/client";
import z, { ZodType } from "zod";

const fruitOutputSchema: ZodType<Fruit> = z.object({
    id: z.string().describe("Unique ID of the fruit (nanoid)"),
    name: z.string().describe("Name of the fruit"),
    description: z.string().describe("Description of the fruit"),
    userId: z.string().describe("ID of the user who created the fruit"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

const fruitWithUserOutputSchema = z.object({
    id: z.string().describe("Unique ID of the fruit (nanoid)"),
    name: z.string().describe("Name of the fruit"),
    description: z.string().describe("Description of the fruit"),
    userId: z.string().describe("ID of the user who created the fruit"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
    User: z.object({
        id: z.string().describe("User ID"),
        name: z.string().describe("User name"),
        lastname: z.string().nullable().describe("User lastname"),
        email: z.string().describe("User email"),
    }),
});

export {
    // Output schema
    fruitOutputSchema,
    fruitWithUserOutputSchema,
};

import { $Enums, User } from "@prisma/client";
import "server-only";
import { ZodType, z } from "zod";

const userOutputSchema: ZodType<User> = z.object({
    id: z.string().describe("Unique ID of the user (nanoid)"),
    name: z.string().describe("Firstname of the user"),
    lastname: z.string().nullable().describe("Lastname of the user"),
    email: z.string().describe("Email address"),
    emailVerified: z.boolean().describe("Email verification status (boolean)"),
    image: z.string().nullable().describe("Profile image URL"),
    role: z.enum($Enums.Role).describe("User role: ADMIN, USER (default)"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

export {
    // Input schema
    // Output schema
    userOutputSchema,
};

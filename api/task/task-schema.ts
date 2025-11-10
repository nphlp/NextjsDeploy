import { $Enums, Task } from "@prisma/client";
import z, { ZodType } from "zod";

const taskOutputSchema: ZodType<Task> = z.object({
    id: z.string().describe("Unique ID of the task (nanoid)"),
    title: z.string().describe("Title of the task"),
    status: z.enum($Enums.Status).describe("Status of the task: TODO, IN_PROGRESS, DONE"),
    userId: z.string().describe("Unique ID of the user who owns the task"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});

export {
    // Input schema
    // Output schema
    taskOutputSchema,
};

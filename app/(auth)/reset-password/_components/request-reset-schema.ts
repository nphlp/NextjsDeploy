import { z } from "zod";

export const requestResetSchema = z.object({
    email: z.email({ message: "Email invalide" }),
});

export type RequestResetFormValues = z.infer<typeof requestResetSchema>;

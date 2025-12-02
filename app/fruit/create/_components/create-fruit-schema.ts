import { z } from "zod";

export const createFruitSchema = z.object({
    name: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères"),
    description: z
        .string()
        .min(10, "La description doit contenir au moins 10 caractères")
        .max(500, "La description ne peut pas dépasser 500 caractères"),
});

export type FruitCreateFormValues = z.infer<typeof createFruitSchema>;

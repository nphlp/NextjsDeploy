"use client";

import Button from "@atoms/button";
import Field, { Description, Error, Label } from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import TextArea from "@atoms/input/text-area";
import { zodResolver } from "@hookform/resolvers/zod";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createFruitSchema = z.object({
    name: z
        .string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne doit pas dépasser 50 caractères")
        .regex(/^[\p{L}\s'-]+$/u, "Lettres, espaces, apostrophes et tirets uniquement"),
    description: z
        .string()
        .min(10, "La description doit contenir au moins 10 caractères")
        .max(500, "La description ne doit pas dépasser 500 caractères"),
});

type FruitCreateFormValues = z.infer<typeof createFruitSchema>;

export default function CreateFruitForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FruitCreateFormValues>({
        mode: "onChange",
        resolver: zodResolver(createFruitSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (values: FruitCreateFormValues) => {
        try {
            await oRPC.fruit.create(values);
            toast.success("Fruit créé avec succès !");
            router.push("/fruits");
        } catch (error) {
            toast.error((error as Error).message ?? "Erreur lors de la création du fruit");
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <Field invalid={!!errors.name}>
                <Label>Nom du fruit</Label>
                <Description>Entrer le nom du fruit</Description>
                <Input
                    {...register("name")}
                    placeholder="Mangue"
                    disabled={isSubmitting}
                    autoComplete="off"
                    autoFocus
                />
                <Error match>{errors.name?.message}</Error>
            </Field>

            {/* Description */}
            <Field invalid={!!errors.description}>
                <Label>Description du fruit</Label>
                <Description>Entrer une courte description pour le fruit</Description>
                <TextArea
                    {...register("description")}
                    placeholder="Un fruit tropical sucré et juteux."
                    disabled={isSubmitting}
                    autoComplete="off"
                />
                <Error match>{errors.description?.message}</Error>
            </Field>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Créer le fruit" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

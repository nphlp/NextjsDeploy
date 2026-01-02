"use client";

import Button from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import TextArea from "@atoms/input/text-area";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
    const toast = useToast();

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
            toast.add({ title: "Fruit créé", description: "Le fruit a été ajouté à la liste.", type: "success" });
            router.push("/fruits");
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de créer le fruit.", type: "error" });
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <Field label="Nom du fruit" description="Entrer le nom du fruit" error={errors.name?.message}>
                <Input
                    {...register("name")}
                    placeholder="Mangue"
                    disabled={isSubmitting}
                    autoComplete="off"
                    autoFocus
                />
            </Field>

            {/* Description */}
            <Field
                label="Description du fruit"
                description="Entrer une courte description pour le fruit"
                error={errors.description?.message}
            >
                <TextArea
                    {...register("description")}
                    placeholder="Un fruit tropical sucré et juteux."
                    disabled={isSubmitting}
                    autoComplete="off"
                />
            </Field>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Créer le fruit" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

"use client";

import Button from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import TextArea from "@atoms/input/text-area";
import { useToast } from "@atoms/toast";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

const validate = fieldValidator(createFruitSchema);

export default function CreateFruitForm() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = createFruitSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        try {
            await oRPC.fruit.create(result.data);
            toast.add({ title: "Fruit créé", description: "Le fruit a été ajouté à la liste.", type: "success" });
            router.push("/fruits");
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de créer le fruit.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <Form onFormSubmit={handleSubmit}>
            {/* Name */}
            <Field
                label="Nom du fruit"
                name="name"
                description="Entrer le nom du fruit"
                validate={validate("name")}
                validationMode="onChange"
            >
                <Control placeholder="Mangue" disabled={isSubmitting} autoComplete="off" render={<Input autoFocus />} />
            </Field>

            {/* Description */}
            <Field
                label="Description du fruit"
                name="description"
                description="Entrer une courte description pour le fruit"
                validate={validate("description")}
                validationMode="onChange"
            >
                <TextArea placeholder="Un fruit tropical sucré et juteux." disabled={isSubmitting} autoComplete="off" />
            </Field>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Créer le fruit" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

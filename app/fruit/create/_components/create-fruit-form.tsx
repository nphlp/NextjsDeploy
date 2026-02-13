"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import TextArea from "@atoms/input/text-area";
import { useToast } from "@atoms/toast";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function CreateFruitForm() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit } = useForm({
        name: {
            schema: z
                .string()
                .min(1, "Le champ est requis")
                .max(50, "Le nom ne doit pas dépasser 50 caractères")
                .regex(/^[\p{L}\s'-]+$/u, "Lettres, espaces, apostrophes et tirets uniquement"),
            setter: (value: string) => value,
            defaultValue: "",
        },
        description: {
            schema: z
                .string()
                .min(1, "Le champ est requis")
                .min(10, "La description doit contenir au moins 10 caractères")
                .max(500, "La description ne doit pas dépasser 500 caractères"),
            onChangeSchema: z.string().max(500, "La description ne doit pas dépasser 500 caractères"),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        try {
            await oRPC.fruit.create(values);

            toast.add({ title: "Fruit créé", description: "Le fruit a été ajouté à la liste.", type: "success" });

            router.push("/fruits");
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de créer le fruit.", type: "error" });
        }

        setIsSubmitting(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            {/* Name */}
            <Field
                name="name"
                label="Nom du fruit"
                description="Lettres, espaces, apostrophes et tirets uniquement"
                disabled={isSubmitting}
                required
            >
                <Input name="name" placeholder="Mangue" autoComplete="off" autoFocus useForm />
            </Field>

            {/* Description */}
            <Field
                name="description"
                label="Description du fruit"
                description="Entre 10 et 500 caractères"
                disabled={isSubmitting}
                required
            >
                <TextArea name="description" placeholder="Un fruit tropical sucré et juteux." useForm />
            </Field>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Créer le fruit" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

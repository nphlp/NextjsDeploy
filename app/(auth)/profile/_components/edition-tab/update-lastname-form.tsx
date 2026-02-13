"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { nameSchema } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { SessionRefetch, updateUser } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { useState } from "react";
import { z } from "zod";

type UpdateLastnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateLastnameForm = (props: UpdateLastnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        lastname: {
            schema: nameSchema,
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
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
            await updateUser({ lastname: values.lastname });

            await refetch();

            toast.add({
                title: "Nom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le nom.", type: "error" });
        }

        reset();

        setIsSubmitting(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre nom de famille</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau nom de famille</p>
            </div>

            <Field
                name="lastname"
                label="Nom de famille"
                description="Le champ est requis"
                disabled={isSubmitting}
                required
            >
                <Input
                    name="lastname"
                    placeholder={session.user.lastname ?? "Votre nom"}
                    autoComplete="family-name"
                    useForm
                />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

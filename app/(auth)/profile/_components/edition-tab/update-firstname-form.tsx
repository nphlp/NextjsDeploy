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

type UpdateFirstnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateFirstnameForm = (props: UpdateFirstnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        name: {
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
            await updateUser({ name: values.name });

            await refetch();

            toast.add({
                title: "Prénom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le prénom.", type: "error" });
        }

        reset();

        setIsSubmitting(false);
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre prénom</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau prénom</p>
            </div>

            <Field name="name" label="Prénom" description="Le champ est requis" disabled={isSubmitting} required>
                <Input name="name" placeholder={session.user.name} autoComplete="given-name" useForm />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

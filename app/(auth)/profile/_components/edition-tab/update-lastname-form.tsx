"use client";

import Button from "@atoms/button";
import Field, { Control } from "@atoms/filed";
import Form, { FormProps, fieldValidator } from "@atoms/form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { SessionRefetch, updateUser } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import { useRef, useState } from "react";
import { z } from "zod";

const updateLastnameSchema = z.object({
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
});

const validate = fieldValidator(updateLastnameSchema);

type UpdateLastnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateLastnameForm = (props: UpdateLastnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = updateLastnameSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        try {
            await updateUser({ lastname: result.data.lastname });
            await refetch();
            toast.add({
                title: "Nom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
            formRef.current?.reset();
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le nom.", type: "error" });
        }
        setIsSubmitting(false);
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre nom de famille</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau nom de famille</p>
            </div>

            <Field label="Nom de famille" name="lastname" validate={validate("lastname")} validationMode="onChange">
                <Control
                    placeholder={session.user.lastname ?? "Votre nom"}
                    autoComplete="family-name"
                    disabled={isSubmitting}
                    render={<Input />}
                />
            </Field>

            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

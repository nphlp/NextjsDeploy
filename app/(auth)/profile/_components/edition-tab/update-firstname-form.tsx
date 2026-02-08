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

const updateFirstnameSchema = z.object({
    name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
});

const validate = fieldValidator(updateFirstnameSchema);

type UpdateFirstnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateFirstnameForm = (props: UpdateFirstnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit: FormProps["onFormSubmit"] = async (formValues) => {
        const result = updateFirstnameSchema.safeParse(formValues);
        if (!result.success) return;

        setIsSubmitting(true);
        try {
            await updateUser({ name: result.data.name });
            await refetch();
            toast.add({
                title: "Prénom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
            formRef.current?.reset();
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le prénom.", type: "error" });
        }
        setIsSubmitting(false);
    };

    return (
        <Form ref={formRef} onFormSubmit={handleSubmit}>
            <div>
                <p className="font-medium">Mettre à jour votre prénom</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau prénom</p>
            </div>

            <Field label="Prénom" name="name" validate={validate("name")} validationMode="onChange">
                <Control
                    placeholder={session.user.name}
                    autoComplete="given-name"
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

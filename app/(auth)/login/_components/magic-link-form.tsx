"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { emailSchema, emailSchemaProgressive } from "@atoms/form/schemas";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { authClient } from "@lib/auth-client";
import { useState } from "react";
import z from "zod";

export default function MagicLinkForm() {
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const { register, submit } = useForm({
        email: {
            schema: emailSchema,
            onChangeSchema: emailSchemaProgressive,
            onBlurSchema: z.string(),
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        const values = submit();
        if (!values) return;

        setIsSubmitting(true);

        const { error } = await authClient.signIn.magicLink({
            email: values.email,
            callbackURL: "/",
        });

        if (error) {
            toast.add({ title: "Erreur", description: "Impossible d'envoyer le lien magique.", type: "error" });
            setIsSubmitting(false);
            return;
        }

        setSent(true);
        setIsSubmitting(false);
    };

    if (sent) {
        return (
            <p className="text-center text-sm text-gray-600">
                Un lien de connexion a été envoyé à votre adresse email. Vérifiez votre boîte de réception.
            </p>
        );
    }

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <Field name="email" label="Email" description="Entrez votre adresse email" disabled={isSubmitting} required>
                <Input
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    autoFocus
                    useForm
                />
            </Field>

            <div className="flex justify-center">
                <Button
                    type="submit"
                    label="Envoyer le lien magique"
                    loading={isSubmitting}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}

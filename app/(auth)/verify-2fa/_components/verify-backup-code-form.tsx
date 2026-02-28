"use client";

import Button from "@atoms/button";
import { Field } from "@atoms/form/field";
import Form, { OnSubmit } from "@atoms/form/form";
import { useForm } from "@atoms/form/use-form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { twoFactor } from "@lib/auth-client";
import { useState } from "react";
import { z } from "zod";
import { useQueryParams } from "../../_lib/use-query-params";

type VerifyBackupCodeFormProps = {
    trustDevice: boolean;
};

export default function VerifyBackupCodeForm(props: VerifyBackupCodeFormProps) {
    const { trustDevice } = props;

    const toast = useToast();
    const { redirect } = useQueryParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, submit, reset } = useForm({
        code: {
            schema: z.string().min(1, "Le code est requis"),
            onBlurSchema: z.string(), // Eviter l'erreur si le champ à juste été cliqué
            setter: (value: string) => value,
            defaultValue: "",
        },
    });

    const handleSubmit: OnSubmit = async (event) => {
        event.preventDefault();

        // Validation
        const values = submit();

        // Cancel if validation fails
        if (!values) return;

        // Set loader after validation
        setIsSubmitting(true);

        try {
            // Async submission
            const { error } = await twoFactor.verifyBackupCode({
                code: values.code,
                trustDevice,
            });

            if (error) {
                // Toast error
                toast.add({ title: "Code invalide", description: "Vérifiez votre code de secours.", type: "error" });
                setIsSubmitting(false);
                return;
            }

            // Toast success
            toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

            // Reset form (delayed to avoid visible field clearing)
            setTimeout(() => {
                reset();
                setIsSubmitting(false);
            }, 1000);

            // Hard navigation to bypass Router Cache (proxy redirects are cached)
            window.location.href = redirect || "/";
        } catch {
            // Toast error
            toast.add({ title: "Erreur", description: "Une erreur est survenue.", type: "error" });
            setIsSubmitting(false);
        }
    };

    return (
        <Form register={register} onSubmit={handleSubmit}>
            <p className="text-sm text-gray-600">Entrez l&apos;un de vos codes de secours.</p>
            <Field
                name="code"
                label="Code de secours"
                description="Code à usage unique"
                disabled={isSubmitting}
                required
            >
                <Input name="code" placeholder="XXXXXXXXXX" autoComplete="off" autoFocus useForm />
            </Field>
            <div className="flex justify-center">
                <Button type="submit" label="Vérifier" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

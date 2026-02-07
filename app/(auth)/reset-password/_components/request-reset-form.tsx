"use client";

import Button, { Link } from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@lib/auth-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const requestResetSchema = z.object({
    email: z.email({ message: "Email invalide" }),
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;

export default function RequestResetForm() {
    const [emailSent, setEmailSent] = useState(false);
    const toast = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestResetFormValues>({
        resolver: zodResolver(requestResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: RequestResetFormValues) => {
        const { data } = await requestPasswordReset({
            email: values.email,
            redirectTo: "/reset-password",
        });

        if (!data) {
            toast.add({
                title: "Erreur",
                description: "Impossible d'envoyer l'email de réinitialisation.",
                type: "error",
            });
            return;
        }

        setEmailSent(true);

        toast.add({ title: "Email envoyé", description: "Vérifiez votre boîte de réception.", type: "success" });

        setTimeout(() => reset(), 2000);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Field label="Email" error={errors.email?.message}>
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting || emailSent}
                />
            </Field>

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Mot de passe retrouvé ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button
                    type="submit"
                    label={emailSent ? "Email envoyé !" : "Envoyer l'email"}
                    loading={isSubmitting}
                    disabled={emailSent}
                    className="w-full sm:w-auto"
                />
            </div>
        </Form>
    );
}

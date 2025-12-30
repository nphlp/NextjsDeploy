"use client";

import Button, { Link } from "@atoms/button";
import Field, { Error, Label } from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@lib/auth-client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const requestResetSchema = z.object({
    email: z.email({ message: "Email invalide" }),
});

type RequestResetFormValues = z.infer<typeof requestResetSchema>;

export default function RequestResetForm() {
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
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
            toast.error("Erreur lors de l'envoi de l'email...");
            return;
        }

        setEmailSent(true);
        toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.");
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <Field invalid={!!errors.email}>
                <Label>Email</Label>
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    autoFocus
                    disabled={isSubmitting || emailSent}
                />
                <Error match>{errors.email?.message}</Error>
            </Field>

            {/* Login link */}
            <div className="flex justify-center gap-2 text-sm text-gray-500">
                <p>Mot de passe retrouvé ?</p>
                <Link href="/login" label="Se connecter" className="text-sm hover:underline" noStyle />
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

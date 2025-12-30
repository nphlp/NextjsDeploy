"use client";

import Button, { Link } from "@atoms/button";
import Field, { Error, Label } from "@atoms/filed";
import Form from "@atoms/form";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type ResetPasswordFormProps = {
    token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const toast = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        const { data } = await resetPassword({
            newPassword: values.password,
            token,
        });

        if (!data) {
            toast.add({ title: "Erreur", description: "Impossible de réinitialiser le mot de passe.", type: "error" });
            return;
        }

        toast.add({
            title: "Mot de passe réinitialisé",
            description: "Vous allez être redirigé vers la connexion.",
            type: "success",
        });
        setTimeout(() => router.push("/login"), 1000);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Password */}
            <Field invalid={!!errors.password}>
                <Label>Nouveau mot de passe</Label>
                <InputPassword
                    {...register("password")}
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
                <Error match>{errors.password?.message}</Error>
            </Field>

            {/* Login link */}
            <div className="flex justify-center gap-2 text-sm text-gray-500">
                <p>Mot de passe retrouvé ?</p>
                <Link href="/login" label="Se connecter" className="text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Réinitialiser" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

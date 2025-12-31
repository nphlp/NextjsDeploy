"use client";

import Button, { Link } from "@atoms/button";
import Field from "@atoms/filed";
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
            <Field label="Nouveau mot de passe" error={errors.password?.message}>
                <InputPassword
                    {...register("password")}
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
            </Field>

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Mot de passe retrouvé ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Réinitialiser" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

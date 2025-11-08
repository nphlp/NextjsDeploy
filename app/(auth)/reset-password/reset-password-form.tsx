"use client";

import PasswordInput from "@comps/SHADCN/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@lib/auth-client";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ResetPasswordFormValues, resetPasswordSchema } from "./reset-password-schema";

type ResetPasswordFormProps = {
    token: string;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const handleResetPassword = async (values: ResetPasswordFormValues) => {
        setIsLoading(true);

        const { password } = values;

        const { data } = await resetPassword({
            newPassword: password,
            token,
        });

        if (!data) {
            toast.error("Erreur lors de la réinitialisation...");
            setIsLoading(false);
            return;
        }

        toast.success("Mot de passe réinitialisé avec succès !");

        setTimeout(() => {
            router.push("/login");
        }, 1000);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Minimum 8 caractères"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirmez votre mot de passe"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Login link */}
                <div className="text-muted-foreground flex justify-center gap-2 text-sm">
                    <p>Mot de passe retrouvé ?</p>
                    <Link href="/login" className="hover:text-foreground underline underline-offset-4">
                        Se connecter
                    </Link>
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Réinitialisation en cours..." : "Réinitialiser"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

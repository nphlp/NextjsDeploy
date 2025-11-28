"use client";

import Link from "@comps/SHADCN/components/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@lib/auth-client";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/ui/form";
import { Input } from "@shadcn/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RequestResetFormValues, requestResetSchema } from "./request-reset-schema";

export default function RequestResetForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<RequestResetFormValues>({
        resolver: zodResolver(requestResetSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleRequestReset = async (values: RequestResetFormValues) => {
        setIsLoading(true);

        const { email } = values;

        const { data } = await requestPasswordReset({
            email,
            redirectTo: "/reset-password",
        });

        if (!data) {
            toast.error("Erreur lors de l'envoi de l'email...");
            setIsLoading(false);
            return;
        }

        setEmailSent(true);
        toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.");
        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRequestReset)} className="space-y-4">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="exemple@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    disabled={isLoading || emailSent}
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
                    <Link href="/login" className="hover:text-foreground underline underline-offset-4" noStyle>
                        Se connecter
                    </Link>
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                    <Button type="submit" disabled={isLoading || emailSent} className="w-full sm:w-auto">
                        {isLoading ? "Envoi en cours..." : emailSent ? "Email envoyé !" : "Envoyer l'email"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

"use client";

import PasswordInput from "@comps/SHADCN/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@lib/authClient";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/ui/form";
import { Input } from "@shadcn/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoginFormValues, loginSchema } from "./login-schema";

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (values: LoginFormValues) => {
        setIsLoading(true);

        const { email, password } = values;

        const { data } = await signIn.email({
            email,
            password,
        });

        if (!data) {
            toast.error("Échec de la connexion, identifiants invalides.");
            setIsLoading(false);
            return;
        }

        toast.success("Connexion réussie !");

        router.push("/tasks");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="Votre mot de passe"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Forgot password link */}
                <div className="flex justify-end">
                    <Link
                        href="/reset-password"
                        className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
                    >
                        Mot de passe oublié ?
                    </Link>
                </div>

                {/* Register link */}
                <div className="text-muted-foreground flex justify-center gap-2 text-sm">
                    <p>Pas encore de compte ?</p>
                    <Link href="/register" className="hover:text-foreground underline underline-offset-4">
                        S&apos;inscrire
                    </Link>
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Connexion en cours..." : "Connexion"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

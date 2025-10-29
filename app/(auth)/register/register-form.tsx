"use client";

import { UpdateUserAction } from "@actions/UpdateUserAction";
import PasswordInput from "@comps/SHADCN/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@lib/authClient";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/ui/form";
import { Input } from "@shadcn/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RegisterFormValues, registerSchema } from "./register-schema";

export default function RegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleRegister = async (values: RegisterFormValues) => {
        setIsLoading(true);

        const { firstname, lastname, email, password } = values;

        const { data } = await signUp.email({
            name: firstname,
            email,
            password,
        });

        if (!data) {
            toast.error("Échec de l'inscription, veuillez réessayer.");
            setIsLoading(false);
            return;
        }

        await UpdateUserAction({ lastname });

        toast.success("Inscription réussie ! Bienvenue !");
        router.push("/");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
                {/* Firstname */}
                <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Jean"
                                    autoComplete="given-name"
                                    autoFocus
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Lastname */}
                <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Dupont"
                                    autoComplete="family-name"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                            <FormLabel>Confirmation mot de passe</FormLabel>
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
                    <p>Déjà un compte ?</p>
                    <Link href="/login" className="hover:text-foreground underline underline-offset-4">
                        Se connecter
                    </Link>
                </div>

                {/* Submit button */}
                <div className="flex justify-center">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

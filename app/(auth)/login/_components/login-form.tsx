"use client";

import Button, { Link } from "@atoms/button";
import Field, { Error, Label } from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        const { data } = await signIn.email(values);

        if (!data) {
            toast.error("Échec de la connexion, identifiants invalides.");
            return;
        }

        toast.success("Connexion réussie !");
        router.push("/");
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
                    disabled={isSubmitting}
                />
                <Error match>{errors.email?.message}</Error>
            </Field>

            {/* Password */}
            <Field invalid={!!errors.password}>
                <Label>Mot de passe</Label>
                <InputPassword
                    {...register("password")}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                />
                <Error match>{errors.password?.message}</Error>
                <div className="flex w-full justify-end">
                    <Link
                        href="/reset-password"
                        label="Mot de passe oublié ?"
                        className="text-xs text-gray-500 hover:underline"
                        noStyle
                    />
                </div>
            </Field>

            {/* Register link */}
            <div className="flex justify-center gap-2 text-sm text-gray-500">
                <p>Pas encore de compte ?</p>
                <Link href="/register" label="S'inscrire" className="text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

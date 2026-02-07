"use client";

import Button, { Link } from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { useTurnstile } from "@atoms/use-turnstile";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const toast = useToast();
    const { token, captchaHeaders, reset: resetCaptcha, widget: captchaWidget } = useTurnstile();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        const { data } = await signIn.email({ ...values, ...captchaHeaders });

        if (!data) {
            toast.add({ title: "Échec de la connexion", description: "Identifiants invalides.", type: "error" });
            resetCaptcha();
            return;
        }

        toast.add({ title: "Connexion réussie", description: "Bienvenue sur l'application.", type: "success" });

        resetCaptcha();
        setTimeout(() => reset(), 1000);

        router.push("/");
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
                    disabled={isSubmitting}
                />
            </Field>

            {/* Password */}
            <Field label="Mot de passe" error={errors.password?.message}>
                <InputPassword
                    {...register("password")}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                />
            </Field>

            {/* Forgot password link */}
            <div className="flex w-full justify-end">
                <Link
                    href="/reset-password"
                    label="Mot de passe oublié ?"
                    className="text-xs text-gray-500 hover:underline"
                    noStyle
                />
            </div>

            {/* Captcha */}
            {captchaWidget}

            {/* Register link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Pas encore de compte ?</span>
                <Link href="/register" label="S'inscrire" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="Connexion" loading={isSubmitting || !token} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

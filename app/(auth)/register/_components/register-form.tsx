"use client";

import Button, { Link } from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@lib/auth-client";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
    firstname: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const toast = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        const { firstname, lastname, email, password } = values;

        const { data } = await signUp.email({
            name: firstname,
            email,
            password,
        });

        if (!data) {
            toast.add({ title: "Échec de l'inscription", description: "Veuillez réessayer.", type: "error" });
            return;
        }

        await oRPC.user.update({ id: data.user.id, lastname });

        toast.add({ title: "Inscription réussie", description: "Bienvenue sur l'application !", type: "success" });

        setTimeout(() => reset(), 1000);

        router.push("/");
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Firstname */}
            <Field label="Prénom" error={errors.firstname?.message}>
                <Input
                    {...register("firstname")}
                    placeholder="Jean"
                    autoComplete="given-name"
                    autoFocus
                    disabled={isSubmitting}
                />
            </Field>

            {/* Lastname */}
            <Field label="Nom" error={errors.lastname?.message}>
                <Input
                    {...register("lastname")}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    disabled={isSubmitting}
                />
            </Field>

            {/* Email */}
            <Field label="Email" error={errors.email?.message}>
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                />
            </Field>

            {/* Password */}
            <Field label="Mot de passe" error={errors.password?.message}>
                <InputPassword
                    {...register("password")}
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
            </Field>

            {/* Login link */}
            <div className="space-x-2 text-center text-sm text-gray-500">
                <span>Déjà un compte ?</span>
                <Link href="/login" label="Se connecter" className="inline text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="S'inscrire" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

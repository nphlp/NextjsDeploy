"use client";

import Button, { Link } from "@atoms/button";
import Field, { Error, Label } from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@lib/auth-client";
import oRPC from "@lib/orpc";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

    const {
        register,
        handleSubmit,
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
            toast.error("Échec de l'inscription, veuillez réessayer.");
            return;
        }

        await oRPC.user.update({ id: data.user.id, lastname });

        toast.success("Inscription réussie ! Bienvenue !");
        router.push("/");
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Firstname */}
            <Field invalid={!!errors.firstname}>
                <Label>Prénom</Label>
                <Input
                    {...register("firstname")}
                    placeholder="Jean"
                    autoComplete="given-name"
                    autoFocus
                    disabled={isSubmitting}
                />
                <Error match>{errors.firstname?.message}</Error>
            </Field>

            {/* Lastname */}
            <Field invalid={!!errors.lastname}>
                <Label>Nom</Label>
                <Input
                    {...register("lastname")}
                    placeholder="Dupont"
                    autoComplete="family-name"
                    disabled={isSubmitting}
                />
                <Error match>{errors.lastname?.message}</Error>
            </Field>

            {/* Email */}
            <Field invalid={!!errors.email}>
                <Label>Email</Label>
                <Input
                    {...register("email")}
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                />
                <Error match>{errors.email?.message}</Error>
            </Field>

            {/* Password */}
            <Field invalid={!!errors.password}>
                <Label>Mot de passe</Label>
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
                <p>Déjà un compte ?</p>
                <Link href="/login" label="Se connecter" className="text-sm hover:underline" noStyle />
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <Button type="submit" label="S'inscrire" loading={isSubmitting} className="w-full sm:w-auto" />
            </div>
        </Form>
    );
}

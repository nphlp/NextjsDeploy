"use client";

import Button from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@lib/auth-client";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    newPassword: z.string().min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" }),
});
type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export const UpdatePasswordForm = () => {
    const toast = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordFormValues>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: { currentPassword: "", newPassword: "" },
    });

    const onSubmit = async (values: UpdatePasswordFormValues) => {
        const { data } = await changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: true,
        });

        if (!data) {
            toast.add({
                title: "Échec",
                description: "Le mot de passe actuel est peut-être incorrect.",
                type: "error",
            });
            return;
        }

        toast.add({
            title: "Mot de passe modifié",
            description: "Vos modifications ont été enregistrées.",
            type: "success",
        });
        reset();
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="font-medium">Mettre à jour votre mot de passe</p>
                <p className="text-sm text-gray-600">
                    Entrer votre mot de passe actuel puis votre nouveau mot de passe
                </p>
            </div>
            <Field label="Mot de passe actuel" error={errors.currentPassword?.message}>
                <InputPassword
                    {...register("currentPassword")}
                    placeholder="Mot de passe actuel"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                />
            </Field>
            <Field label="Nouveau mot de passe" error={errors.newPassword?.message}>
                <InputPassword
                    {...register("newPassword")}
                    placeholder="Nouveau mot de passe"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
            </Field>
            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

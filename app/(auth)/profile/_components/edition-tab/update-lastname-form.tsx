"use client";

import Button from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import { useToast } from "@atoms/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SessionRefetch } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateLastnameSchema = z.object({
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
});
type UpdateLastnameFormValues = z.infer<typeof updateLastnameSchema>;

type UpdateLastnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateLastnameForm = (props: UpdateLastnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateLastnameFormValues>({
        resolver: zodResolver(updateLastnameSchema),
        defaultValues: { lastname: "" },
    });

    const onSubmit = async (values: UpdateLastnameFormValues) => {
        try {
            await oRPC.user.update({ id: session.user.id, lastname: values.lastname });
            await refetch();
            toast.add({
                title: "Nom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
            reset();
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le nom.", type: "error" });
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="font-medium">Mettre à jour votre nom de famille</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau nom de famille</p>
            </div>
            <Field label="Nom de famille" error={errors.lastname?.message}>
                <Input
                    {...register("lastname")}
                    placeholder={session.user.lastname ?? "Votre nom"}
                    autoComplete="family-name"
                    disabled={isSubmitting}
                />
            </Field>
            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

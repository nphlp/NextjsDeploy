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

const updateFirstnameSchema = z.object({
    name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
});
type UpdateFirstnameFormValues = z.infer<typeof updateFirstnameSchema>;

type UpdateFirstnameFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

export const UpdateFirstnameForm = (props: UpdateFirstnameFormProps) => {
    const { session, refetch } = props;
    const toast = useToast();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateFirstnameFormValues>({
        resolver: zodResolver(updateFirstnameSchema),
        defaultValues: { name: "" },
    });

    const onSubmit = async (values: UpdateFirstnameFormValues) => {
        try {
            await oRPC.user.update({ id: session.user.id, name: values.name });
            await refetch();
            toast.add({
                title: "Prénom modifié",
                description: "Vos modifications ont été enregistrées.",
                type: "success",
            });
            reset();
        } catch {
            toast.add({ title: "Erreur", description: "Impossible de modifier le prénom.", type: "error" });
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <p className="font-medium">Mettre à jour votre prénom</p>
                <p className="text-sm text-gray-600">Entrer votre nouveau prénom</p>
            </div>
            <Field label="Prénom" error={errors.name?.message}>
                <Input
                    {...register("name")}
                    placeholder={session.user.name}
                    autoComplete="given-name"
                    disabled={isSubmitting}
                />
            </Field>
            <div className="flex justify-center">
                <Button type="submit" label="Valider" loading={isSubmitting} className="w-full md:w-fit" />
            </div>
        </Form>
    );
};

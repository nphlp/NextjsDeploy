"use client";

import Button from "@atoms/button";
import Field from "@atoms/filed";
import Form from "@atoms/form";
import Input from "@atoms/input/input";
import InputPassword from "@atoms/input/input-password";
import { useToast } from "@atoms/toast";
import { Separator } from "@base-ui/react/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { SessionRefetch, changePassword, useSession } from "@lib/auth-client";
import { Session } from "@lib/auth-server";
import oRPC from "@lib/orpc";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateLastnameSchema = z.object({
    lastname: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
});
type UpdateLastnameFormValues = z.infer<typeof updateLastnameSchema>;

const updateFirstnameSchema = z.object({
    name: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
});
type UpdateFirstnameFormValues = z.infer<typeof updateFirstnameSchema>;

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis" }),
    newPassword: z.string().min(8, { message: "Le nouveau mot de passe doit contenir au moins 8 caractères" }),
});
type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

type EditionTabProps = {
    session: NonNullable<Session>;
};

export default function EditionTab(props: EditionTabProps) {
    const { session: serverSession } = props;
    const { data: clientSession, refetch } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold">Édition</h2>
                <p className="text-sm text-gray-500">Modifier vos données personnelles.</p>
            </div>
            <div className="space-y-6">
                <UpdateLastnameForm session={session} refetch={refetch} />
                <Separator className="h-px bg-gray-200" />
                <UpdateFirstnameForm session={session} refetch={refetch} />
                <Separator className="h-px bg-gray-200" />
                <UpdatePasswordForm />
            </div>
        </div>
    );
}

type UpdateFormProps = {
    session: NonNullable<Session>;
    refetch: SessionRefetch;
};

const UpdateLastnameForm = (props: UpdateFormProps) => {
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
        <div>
            <h3 className="mb-2 text-sm font-bold text-gray-500">Modifier mon nom</h3>
            <Form onSubmit={handleSubmit(onSubmit)} className="gap-2">
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
        </div>
    );
};

const UpdateFirstnameForm = (props: UpdateFormProps) => {
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
        <div>
            <h3 className="mb-2 text-sm font-bold text-gray-500">Modifier mon prénom</h3>
            <Form onSubmit={handleSubmit(onSubmit)} className="gap-2">
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
        </div>
    );
};

const UpdatePasswordForm = () => {
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
        <div>
            <h3 className="mb-2 text-sm font-bold text-gray-500">Modifier mon mot de passe</h3>
            <Form onSubmit={handleSubmit(onSubmit)} className="gap-4">
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
        </div>
    );
};

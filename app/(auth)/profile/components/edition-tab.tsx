"use client";

import { UserUpdateAction } from "@actions/UserUpdateAction";
import PasswordInput from "@comps/SHADCN/components/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword, updateUser, useSession } from "@lib/authClient";
import { Session } from "@lib/authServer";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@shadcn/ui/form";
import { Input } from "@shadcn/ui/input";
import { Separator } from "@shadcn/ui/separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpdateFirstnameFormValues, updateFirstnameSchema } from "./update-firstname-schema";
import { UpdateLastnameFormValues, updateLastnameSchema } from "./update-lastname-schema";
import { UpdatePasswordFormValues, updatePasswordSchema } from "./update-password-schema";

type EditionTabProps = {
    session: NonNullable<Session>;
};

export default function EditionTab(props: EditionTabProps) {
    const { session: serverSession } = props;
    const { data: clientSession } = useSession();

    // SSR session
    const session = clientSession ?? serverSession;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-bold">Édition</h2>
                <p className="text-muted-foreground text-sm">Modifier vos données personnelles.</p>
            </div>
            <div className="space-y-6">
                <UpdateLastnameForm session={session} />
                <Separator />
                <UpdateFirstnameForm session={session} />
                <Separator />
                <UpdatePasswordForm />
            </div>
        </div>
    );
}

type UpdateFormProps = {
    session: NonNullable<Session>;
};

const UpdateLastnameForm = (props: UpdateFormProps) => {
    const { session } = props;
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UpdateLastnameFormValues>({
        resolver: zodResolver(updateLastnameSchema),
        defaultValues: {
            lastname: "",
        },
    });

    const handleSubmit = async (values: UpdateLastnameFormValues) => {
        setIsLoading(true);

        const { lastname } = values;

        const updateResponse = await UserUpdateAction({ lastname });

        if (!updateResponse) {
            toast.error("Erreur lors de la modification du nom");
            setIsLoading(false);
            return;
        }

        toast.success("Nom modifié avec succès !");
        form.reset();
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-bold">Modifier mon nom</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-center gap-2">
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        placeholder={session.user.lastname ?? "Votre nom"}
                                        autoComplete="family-name"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="sm" className="w-full">
                        {isLoading ? "Modification..." : "Valider"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

const UpdateFirstnameForm = (props: UpdateFormProps) => {
    const { session } = props;
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UpdateFirstnameFormValues>({
        resolver: zodResolver(updateFirstnameSchema),
        defaultValues: {
            name: "",
        },
    });

    const handleSubmit = async (values: UpdateFirstnameFormValues) => {
        setIsLoading(true);

        const { name } = values;

        try {
            await updateUser({ name });
            toast.success("Prénom modifié avec succès !");
            form.reset();
        } catch {
            toast.error("Erreur lors de la modification du prénom");
        }

        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-bold">Modifier mon prénom</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-center gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        placeholder={session.user.name}
                                        autoComplete="given-name"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="sm" className="w-full">
                        {isLoading ? "Modification..." : "Valider"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

const UpdatePasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UpdatePasswordFormValues>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const handleSubmit = async (values: UpdatePasswordFormValues) => {
        setIsLoading(true);

        const { currentPassword, newPassword } = values;

        const { data } = await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });

        if (!data) {
            toast.error("Échec du changement de mot de passe, le mot de passe actuel est peut-être incorrect.");
            setIsLoading(false);
            return;
        }

        toast.success("Mot de passe modifié avec succès !");
        form.reset();
        setIsLoading(false);
    };

    return (
        <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-bold">Modifier mon mot de passe</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-center gap-4">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Mot de passe actuel"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Nouveau mot de passe"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading} size="sm" className="w-full">
                        {isLoading ? "Modification..." : "Valider"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

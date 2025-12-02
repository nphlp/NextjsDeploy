"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import oRPC from "@lib/orpc";
import { Button } from "@shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/ui/form";
import { Input } from "@shadcn/ui/input";
import { Textarea } from "@shadcn/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FruitCreateFormValues, createFruitSchema } from "./create-fruit-schema";

export default function CreateFruitForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FruitCreateFormValues>({
        resolver: zodResolver(createFruitSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const handleCreate = async (values: FruitCreateFormValues) => {
        setIsLoading(true);

        const { name, description } = values;

        try {
            await oRPC.fruit.create({ name, description });
            toast.success("Fruit créé avec succès !");
            router.push("/fruits");
        } catch (error) {
            toast.error((error as Error).message ?? "Erreur lors de la création du fruit");
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Nom du fruit"
                                    autoComplete="off"
                                    autoFocus
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description du fruit..."
                                    disabled={isLoading}
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button */}
                <div className="flex justify-center">
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Création en cours..." : "Créer le fruit"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export const CreateFruitFormSkeleton = () => {
    return (
        <div className="animate-pulse space-y-4">
            {/* Name */}
            <div className="space-y-2">
                <div className="bg-foreground/5 h-3.5 w-[38px] flex-none rounded"></div>
                <div className="rounded-md border px-3 py-2 shadow-xs">
                    <div className="bg-foreground/5 h-4.5 w-[120px] flex-none rounded"></div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="bg-foreground/5 h-3.5 w-[82px] flex-none rounded"></div>
                <div className="rounded-md border px-3 pt-2 pb-9 shadow-xs">
                    <div className="bg-foreground/5 h-4.5 w-[170px] flex-none rounded"></div>
                </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center">
                <div className="bg-foreground rounded-md px-5 py-2.5 shadow-xs">
                    <div className="bg-background/80 h-4 w-[76px] flex-none rounded"></div>
                </div>
            </div>
        </div>
    );
};

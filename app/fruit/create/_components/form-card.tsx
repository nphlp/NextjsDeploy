import { getSession } from "@lib/auth-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { redirect } from "next/navigation";
import CreateFruitForm, { CreateFruitFormSkeleton } from "./create-fruit-form";

export default async function FormCard() {
    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <div className="mt-8 flex w-full items-center justify-center">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle>Créer un fruit</CardTitle>
                    <CardDescription>Ajoutez un nouveau fruit à la liste.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateFruitForm />
                </CardContent>
            </Card>
        </div>
    );
}

export const FormCardSkeleton = async () => {
    "use cache";

    return (
        <div className="mt-8 flex w-full items-center justify-center">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <div className="bg-foreground/5 h-4 w-[100px] flex-none rounded"></div>
                    <div className="bg-foreground/5 h-5 w-[250px] flex-none rounded"></div>
                </CardHeader>
                <CardContent>
                    <CreateFruitFormSkeleton />
                </CardContent>
            </Card>
        </div>
    );
};

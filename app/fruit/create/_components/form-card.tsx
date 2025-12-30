import Card from "@atoms/card";
import { getSession } from "@lib/auth-server";
import { redirect } from "next/navigation";
import CreateFruitForm from "./create-fruit-form";

export default async function FormCard() {
    "use cache: private";

    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <div className="mt-8 flex w-full items-center justify-center">
            <Card className="max-w-80">
                <div>
                    <h3 className="font-semibold">Créer un fruit</h3>
                    <p className="text-gray-500">Ajoutez un nouveau fruit à la liste.</p>
                </div>
                <CreateFruitForm />
            </Card>
        </div>
    );
}

import Logout from "@comps/UI/logout";
import { getSession } from "@lib/authServer";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    if (!session) redirect("/login");

    return (
        <div className="space-y-4 p-7">
            <h1 className="text-2xl font-bold">Profil</h1>
            <p>Connecté !</p>
            <Logout>
                <div>Déconnexion</div>
                <LogOut className="size-4" />
            </Logout>
        </div>
    );
}

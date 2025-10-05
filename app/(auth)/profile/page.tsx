import Logout from "@comps/UI/logout";
import { getSession } from "@lib/authServer";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    if (!session) redirect("/login");

    // const userList = await UserFindManyAction({});

    return (
        <div className="space-y-4 p-7">
            <h1 className="text-2xl font-bold">Profil</h1>

            <p>Connecté !</p>

            {/* <div className="space-y-2">
                <div>Liste des utilisateurs</div>
                <ul className="flex flex-col gap-1">
                    {userList.map((u) => (
                        <li key={u.id} className="list-disc ml-6 pl-2">{u.email}</li>
                    ))}
                </ul>
            </div> */}

            <Logout>
                <div>Déconnexion</div>
                <LogOut className="size-4" />
            </Logout>
        </div>
    );
}

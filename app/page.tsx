import Link from "@comps/UI/button/link";
import { getSession } from "@lib/authServer";
import { ChevronRight } from "lucide-react";

export default async function Page() {
    const session = await getSession();

    return (
        <div className="space-y-4 p-7">
            <h1 className="text-2xl font-bold">Bienvenue sur Task Manger 📝</h1>
            {session ? (
                <div>
                    <Link href="/task" label="Voir mes tâches" variant="outline">
                        <span className="px-2">Voir mes tâches</span>
                        <ChevronRight className="size-5" />
                    </Link>
                </div>
            ) : (
                <div className="flex justify-center gap-2">
                    <Link href="/register" label="Inscription" variant="outline" />
                    <Link href="/login" label="Connexion" />
                </div>
            )}
        </div>
    );
}

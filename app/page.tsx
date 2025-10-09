import Link from "@comps/UI/button/link";
import { getSession } from "@lib/authServer";

export default async function Page() {
    const session = await getSession();

    return (
        <div className="space-y-4 p-7">
            <h1 className="text-2xl font-bold">Task Manger 📝</h1>
            {session ? (
                <div>
                    <Link href="/task" label="Accéder à mes tâches" variant="outline" />
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

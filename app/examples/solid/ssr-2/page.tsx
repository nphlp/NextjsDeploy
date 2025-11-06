import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SolidServer from "../lib/solid-server";
import Tasks from "./tasks";

export default async function Page() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    );
}

const SuspendedPage = async () => {
    const session = await getSession();
    if (!session) redirect("/login");

    const isAdmin = session.user.role === "ADMIN";
    if (!isAdmin) throw new Error("Loggin as admin to access this page.");

    const tasks = await SolidServer.task.list({
        userId: session.user.id,
    });

    const users = await SolidServer.user.list();

    return (
        <div>
            <Tasks tasks={tasks} users={users} />
        </div>
    );
};

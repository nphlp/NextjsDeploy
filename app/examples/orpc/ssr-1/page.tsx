import { client } from "@app/examples/orpc/lib/orpc-client";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import { Suspense } from "react";
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

    const tasks = await client.task.list({
        userId: session.user.id,
    });

    const users = await client.user.list();

    return (
        <div>
            <Tasks tasks={tasks} users={users} />
        </div>
    );
};

import { getSession } from "@lib/auth-server";
import oRPC from "@lib/orpc";
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

    const tasks = await oRPC.task.findMany({
        userId: session.user.id,
        take: 3,
    });

    const users = await oRPC.user.findMany();

    return (
        <div>
            <Tasks tasks={tasks} users={users} />
        </div>
    );
};

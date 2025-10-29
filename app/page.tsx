import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();

    if (!session) redirect("/login");

    redirect("/tasks");
}

import { getSession } from "@lib/authServer";
import { UserFindUniqueServer } from "@services/server";
import { redirect } from "next/navigation";
import DisplayPeriods from "./components/display-periods";
import { exampleSchedulesInputPageParams } from "./components/fetch";
import Form from "./components/form";
import Provider from "./components/provider";

export const dynamic = "force-dynamic";

export default async function Page() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await UserFindUniqueServer(exampleSchedulesInputPageParams({ userId: session.user.id }));

    if (!user) throw new Error("User not found");

    return (
        <Provider initialData={user} sessionServer={session}>
            <div className="grid grid-cols-1 gap-4 p-7 lg:grid-cols-2">
                <DisplayPeriods />
                <Form />
            </div>
        </Provider>
    );
}

import Card from "@comps/UI/card";
import { createComboOptions } from "@comps/UI/comboboxes/utils";
import { createSelectOptions } from "@comps/UI/select/utils";
import { AccountFindManyServer, TaskFindManyServer, UserFindManyServer } from "@services/server";
import Form from "./form";

export const dynamic = "force-dynamic";

export default async function Page() {
    // Fetch the data
    const userListRaw = await UserFindManyServer({
        select: { id: true, name: true },
    });
    const taskListRaw = await TaskFindManyServer({
        select: { id: true, title: true },
    });
    const accountListRaw = await AccountFindManyServer({
        select: { id: true, providerId: true },
    });

    // Format the options
    const userList = createSelectOptions(userListRaw, { slug: "id", label: "name" });
    const taskList = createComboOptions(taskListRaw, { slug: "id", name: "title" });
    const accountList = createComboOptions(accountListRaw, { slug: "id", name: "providerId", type: "product" });

    return (
        <div className="p-7">
            <Card className="h-fit max-w-[450px] space-y-4">
                <div className="text-2xl font-bold">Formulaire</div>
                <div className="text-sm text-gray-500">
                    Ce formulaire est un exemple de formulaire avec des champs de type texte, sélection, checkbox,
                    bouton, etc.
                </div>
                <Form userList={userList} taskList={taskList} accountList={accountList} />
            </Card>
        </div>
    );
}

import { createComboOptions } from "@comps/UI/comboboxes/utils";
import { createSelectOptions } from "@comps/UI/select/utils";
import { TaskFindManyServer, UserFindManyServer } from "@services/server";
import ButtonSection from "./components/button";
import InputSection from "./components/input";
import PopupSection from "./components/popup";

export const dynamic = "force-dynamic";

export default async function Page() {
    // Fetch the data
    const taskList = await TaskFindManyServer({
        select: { slug: true, title: true },
    });
    const userList = await UserFindManyServer({
        select: { id: true, name: true },
    });

    // Format the select options
    const taskSelectOptions = createSelectOptions(taskList, { slug: "slug", label: "title" });

    // Format combo options
    const userComboOptions = createComboOptions(userList, { slug: "id", name: "name" });

    // Format multicombo options
    const userMultiComboOptions = createComboOptions(userList, { slug: "id", name: "name", type: "user" });
    const taskMultiComboOptions = createComboOptions(taskList, { slug: "slug", name: "title", type: "task" });
    const mergedMultiComboOptions = [...userMultiComboOptions, ...taskMultiComboOptions];

    return (
        <div className="max-w-[600px] space-y-12 px-4 py-4 sm:px-12">
            <ButtonSection className="space-y-4" />
            <InputSection
                className="space-y-4"
                initialData={{ taskSelectOptions, userComboOptions, mergedMultiComboOptions }}
            />
            <PopupSection className="space-y-4" />
        </div>
    );
}

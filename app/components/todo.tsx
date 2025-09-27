import { TaskFindManyServer } from "@services/server";
import AddTodo from "./addTodo";
import { tasksParams } from "./fetch";
import List from "./list";
import Provider from "./provider";

export default async function Todo() {
    const taskList = await TaskFindManyServer(tasksParams());

    return (
        <Provider initialData={taskList}>
            <AddTodo />
            <hr className="border-gray-low mx-2" />
            <List />
        </Provider>
    );
}

"use client";

import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@comps/SHADCN/ui/select";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { Task, User } from "@prisma/client";
import { useState } from "react";

type TasksProps = {
    tasks: Task[];
    users: User[];
};

export default function Tasks(props: TasksProps) {
    const { tasks, users } = props;

    const [selectedUser, setSelectedUser] = useState(users[0]?.id);

    const { data } = useFetch({
        client: oRPC.task.list,
        args: {
            userId: selectedUser,
            take: 3,
        },
        keys: [selectedUser],
        initialData: tasks,
    });

    const userName = users.find((u) => u.id === selectedUser)?.name;

    return (
        <div className="w-[500px] space-y-4">
            <Card>
                <CardHeader className="flex items-end justify-between">
                    <h2 className="text-xl font-medium">Tasks</h2>
                    <Select onValueChange={setSelectedUser} value={selectedUser}>
                        <SelectTrigger>{userName ?? "Select User"}</SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <ul>
                        {data.map((task) => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

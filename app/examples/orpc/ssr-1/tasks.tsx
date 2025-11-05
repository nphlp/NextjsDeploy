"use client";

import { client } from "@app/examples/orpc/lib/orpc-client";
import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@comps/SHADCN/ui/select";
import { Task, User } from "@prisma/client";
import { useState } from "react";

type TasksProps = {
    tasks: Task[];
    users: User[];
};

export default function Tasks(props: TasksProps) {
    const { tasks, users } = props;

    const [selectedUser, setSelectedUser] = useState(users[0]?.id);
    const [displayedTasks, setDisplayedTasks] = useState(tasks);

    const handleUserChange = async (userId: string) => {
        setSelectedUser(userId);

        const newTasks = await client.task.list({
            userId: userId,
        });

        setDisplayedTasks(newTasks);
    };

    const userName = users.find((u) => u.id === selectedUser)?.name;

    return (
        <div className="w-[500px] space-y-4">
            <Select onValueChange={handleUserChange} value={selectedUser}>
                <SelectTrigger>{userName ?? "Select User"}</SelectTrigger>
                <SelectContent>
                    {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            {user.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-medium">Tasks</h2>
                </CardHeader>
                <CardContent>
                    <ul>
                        {displayedTasks.map((task) => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

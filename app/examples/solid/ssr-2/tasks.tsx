"use client";

import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@comps/SHADCN/ui/select";
import { Task, User } from "@prisma/client";
import { useEffect, useState } from "react";
import SolidClient from "../lib/solid-client";

type TasksProps = {
    tasks: Task[];
    users: User[];
};

export default function Tasks(props: TasksProps) {
    const { tasks, users } = props;

    const [selectedUser, setSelectedUser] = useState(users[0]?.id);

    const [data, setData] = useState<Task[]>(tasks);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            const newTasks = await SolidClient.task.list({
                userId: selectedUser,
            });
            setData(newTasks);
            setIsLoading(false);
        };
        if (false) fetchTasks();
    }, [selectedUser]);

    const userName = users.find((u) => u.id === selectedUser)?.name;

    return (
        <div className="w-[500px] space-y-4">
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
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-medium">Tasks</h2>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <ul>
                            <li className="h-[200px]">Loading...</li>
                        </ul>
                    ) : (
                        <ul>
                            {data.map((task) => (
                                <li key={task.id}>{task.title}</li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

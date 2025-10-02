"use client";

import Loader from "@comps/UI/loader";
import { useContext } from "react";
import { Context } from "./context";

export default function List() {
    const { data, isLoading } = useContext(Context);

    if (isLoading) {
        return <Loader />;
    }

    if (!data?.length) {
        return <div>No tasks found</div>;
    }

    return (
        <div className="space-y-2">
            {data.map((task) => (
                <div key={task.id}>{task.title}</div>
            ))}
        </div>
    );
}

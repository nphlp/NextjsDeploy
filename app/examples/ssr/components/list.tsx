"use client";

import Loader from "@comps/UI/loader";
import { useContext } from "react";
import { Context } from "./context";

export default function List() {
    const { data } = useContext(Context);

    if (!data?.length) {
        return <Loader />;
    }

    return (
        <div className="space-y-2">
            {data.map((task) => (
                <div key={task.id}>{task.title}</div>
            ))}
        </div>
    );
}

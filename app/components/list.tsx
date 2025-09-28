"use client";

import { useContext } from "react";
import { Context } from "./context";
import Item from "./item";

export default function List() {
    const { optimisticData } = useContext(Context);

    return (
        <div className="space-y-2">
            {optimisticData.map((task) => (
                <Item key={task.id} task={task} />
            ))}
        </div>
    );
}

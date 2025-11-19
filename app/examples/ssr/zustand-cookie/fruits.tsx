"use client";

import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import { Switch } from "@comps/SHADCN/ui/switch";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { Fruit } from "@prisma/client/client";
import { useFruitDisplayStore } from "./store";

type FruitsProps = {
    initialFruits: Fruit[];
};

export default function Fruits(props: FruitsProps) {
    const { initialFruits } = props;

    // Zustand store with cookie persistence
    const { take, toggleTake } = useFruitDisplayStore();

    // Initial data setup
    const { data } = useFetch({
        client: oRPC.fruit.findMany,
        args: {
            take: take,
        },
        keys: [take],
        initialData: initialFruits,
    });

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Fruits</h2>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm">Show 3</span>
                    <Switch checked={take === 10} onCheckedChange={toggleTake} />
                    <span className="text-sm">Show 10</span>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {data?.map((fruit) => (
                        <li key={fruit.id} className="">
                            <div className="font-semibold">{fruit.name}</div>
                            <div className="text-muted-foreground text-xs">{fruit.description}</div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

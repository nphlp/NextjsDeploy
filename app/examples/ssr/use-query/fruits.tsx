"use client";

import { Card, CardContent, CardHeader } from "@comps/SHADCN/ui/card";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { Fruit } from "@prisma/client/client";
import { useTakeQueryParams } from "./queryParamsClientHooks";
import ToggleTake from "./toggle-take";

type FruitsProps = {
    initialFruits: Fruit[];
};

export default function Fruits(props: FruitsProps) {
    const { initialFruits } = props;

    const { take } = useTakeQueryParams();

    // useFetch with query params - automatically refetches when take changes
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
                <ToggleTake />
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

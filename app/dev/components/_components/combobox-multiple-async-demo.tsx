"use client";

import ComboboxMultipleAsync from "@atoms/combobox/combobox-multiple-async";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { useState } from "react";

export default function ComboboxMultipleAsyncDemo() {
    const [search, setSearch] = useState("");

    const { data, isFetching } = useFetch({
        client: oRPC.fruit.findMany,
        args: {
            searchByName: search || undefined,
            orderByName: "asc",
            take: 10,
        },
        keys: [search],
        fetchOnFirstRender: true,
        debounce: 250,
    });

    const items = data?.map((fruit) => fruit.name) ?? [];

    return <ComboboxMultipleAsync items={items} isFetching={isFetching} onSearchChange={setSearch} />;
}

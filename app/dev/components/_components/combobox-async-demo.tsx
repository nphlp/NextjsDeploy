"use client";

import ComboboxAsync from "@atoms/combobox/combobox-async";
import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";
import { useState } from "react";

export default function ComboboxAsyncDemo() {
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

    return <ComboboxAsync items={items} isFetching={isFetching} onSearchChange={setSearch} />;
}

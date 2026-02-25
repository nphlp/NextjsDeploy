"use client";

import Button from "@atoms/button";
import Input from "@atoms/input/input";
import { X } from "lucide-react";
import { useQueryParams } from "../_lib/use-query-params";

export default function SearchFilter() {
    const { search, setSearch } = useQueryParams();

    return (
        <div className="relative w-full">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value || null)}
                placeholder="Search..."
                className="pr-9"
            />
            {search && (
                <Button
                    label="Clear search"
                    onClick={() => setSearch(null)}
                    className="absolute top-0 right-0 px-3 py-3 text-gray-600"
                    noStyle
                >
                    <X className="size-4" />
                </Button>
            )}
        </div>
    );
}

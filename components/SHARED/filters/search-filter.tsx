"use client";

import Button from "@comps/atoms/button/button";
import Input from "@comps/atoms/input/input";
import Label from "@comps/atoms/label";
import Skeleton from "@comps/atoms/skeleton";
import { X } from "lucide-react";
import { ChangeEvent } from "react";
import { useSearchQueryParams } from "./queryParamsClientHooks";

type SearchFilterProps = {
    className?: string;
    noLabel?: boolean;
};

export default function SearchFilter(props: SearchFilterProps) {
    const { noLabel, className } = props;

    const { search, setSearch } = useSearchQueryParams();

    return (
        <div className="space-y-1">
            {!noLabel && <Label>Search</Label>}
            <div className="relative">
                <Input
                    placeholder="Rechercher"
                    autoComplete="off"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    value={search}
                />
                {!!search.length && (
                    <Button
                        label="Effacer la recherche"
                        onClick={() => setSearch("")}
                        className="absolute top-1/2 right-0 -translate-y-1/2 rounded p-0.5"
                        colors="link"
                    >
                        <X className="size-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}

export const SearchFilterSkeleton = () => {
    return (
        <div>
            <Skeleton className="mb-1 h-4 w-[90px]" />
            <Skeleton className="h-9 w-full" />
        </div>
    );
};

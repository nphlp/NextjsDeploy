"use client";

import { Button } from "@comps/SHADCN/ui/button";
import { Input } from "@comps/SHADCN/ui/input";
import { Label } from "@comps/SHADCN/ui/label";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import { X } from "lucide-react";
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
                    aria-label="Rechercher"
                    placeholder="Rechercher"
                    className={className}
                    autoComplete="off"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                {!!search.length && (
                    <Button
                        aria-label="Effacer la recherche"
                        onClick={() => setSearch("")}
                        className="absolute top-1/2 right-0 -translate-y-1/2 rounded p-0.5"
                        variant="link"
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

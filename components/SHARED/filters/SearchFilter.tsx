"use client";

import Button from "@comps/UI/button/button";
import Input, { InputClassName } from "@comps/UI/input/input";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { X } from "lucide-react";
import { useSearchQueryParams } from "./queryParamsClientHooks";

type SearchFilterProps = {
    className?: InputClassName;
    noLabel?: boolean;
};

export default function SearchFilter(props: SearchFilterProps) {
    const { noLabel, className } = props;

    const { search, setSearch } = useSearchQueryParams();

    return (
        <div className="relative">
            <Input
                label="Rechercher"
                placeholder="Rechercher"
                className={className}
                autoComplete="off"
                setValue={setSearch}
                value={search}
                noLabel={noLabel}
            />
            {!!search.length && (
                <Button
                    label="Effacer la recherche"
                    onClick={() => setSearch("")}
                    className={{ button: "absolute top-[calc(100%/2)] right-2 rounded p-0.5" }}
                    variant="none"
                >
                    <X className="size-5" />
                </Button>
            )}
        </div>
    );
}

export const SearchFilterSkeleton = () => {
    return (
        <div>
            <SkeletonText className="mb-1" fontSize="sm" width="90px" />
            <SkeletonContainer>
                <SkeletonText />
            </SkeletonContainer>
        </div>
    );
};

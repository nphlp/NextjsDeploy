"use client";

import Select from "@comps/UI/select/select";
import { SkeletonContainer, SkeletonText } from "@comps/UI/skeleton";
import { useUpdatedAtQueryParams } from "./queryParamsClientHooks";

export default function UpdatedAtFilter() {
    const { updatedAt, setUpdatedAt } = useUpdatedAtQueryParams();

    return (
        <Select
            label="Tri par date"
            options={[
                { label: "Asc", slug: "asc" },
                { label: "Desc", slug: "desc" },
            ]}
            setSelected={(value) => setUpdatedAt(value as "asc" | "desc")}
            selected={updatedAt}
            canNotBeEmpty
        />
    );
}

export const UpdatedAtFilterSkeleton = () => {
    return (
        <div>
            <SkeletonText className="mb-1" fontSize="sm" width="110px" />
            <SkeletonContainer>
                <SkeletonText />
            </SkeletonContainer>
        </div>
    );
};

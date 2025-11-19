"use client";

import { Label } from "@comps/SHADCN/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comps/SHADCN/ui/select";
import { Skeleton } from "@comps/SHADCN/ui/skeleton";
import { Prisma } from "@prisma/client/client";
import { useUpdatedAtQueryParams } from "./queryParamsClientHooks";

export default function UpdatedAtFilter() {
    const { updatedAt, setUpdatedAt } = useUpdatedAtQueryParams();

    return (
        <div className="space-y-1">
            <Label>Tri par date</Label>
            <Select value={updatedAt} onValueChange={(value) => setUpdatedAt(value as Prisma.SortOrder)}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export const UpdatedAtFilterSkeleton = () => {
    return (
        <div>
            <Skeleton className="mb-1 h-4 w-[110px]" />
            <Skeleton className="h-9 w-full" />
        </div>
    );
};

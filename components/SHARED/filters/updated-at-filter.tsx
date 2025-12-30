"use client";

import Label from "@comps/atoms/label";
import { Item, List, Popup, Portal, Positioner, Root, Trigger, Value } from "@comps/atoms/select/atoms";
import Skeleton from "@comps/atoms/skeleton";
import { Prisma } from "@prisma/client/client";
import { useUpdatedAtQueryParams } from "./queryParamsClientHooks";

export default function UpdatedAtFilter() {
    const { updatedAt, setUpdatedAt } = useUpdatedAtQueryParams();

    return (
        <div className="space-y-1">
            <Label>Tri par date</Label>
            <Root
                selected={updatedAt}
                onSelect={(value: string | string[] | null) => setUpdatedAt(value as Prisma.SortOrder)}
            >
                <Trigger>
                    <Value />
                </Trigger>
                <Portal>
                    <Positioner>
                        <Popup>
                            <List>
                                <Item label="Asc" itemKey="asc" />
                                <Item label="Desc" itemKey="desc" />
                            </List>
                        </Popup>
                    </Positioner>
                </Portal>
            </Root>
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

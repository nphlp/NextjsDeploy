"use client";

import { type UniqueIdentifier, useDndContext } from "@dnd-kit/core";
import { useContext } from "react";
import { SortableItemContext, type SortableItemState } from "./context";

/**
 * Returns the id of the currently dragged item (or `null`). Must be called
 * from a descendant of `<Root>` / `<Sortable>`.
 */
export const useSortableActiveId = (): UniqueIdentifier | null => {
    const { active } = useDndContext();
    return active?.id ?? null;
};

/**
 * Returns the per-item state (e.g. `isDragging`) for the closest enclosing
 * `<Item>`. Returns `{ isDragging: false }` when called outside any item —
 * lets a card render statically when reused outside a Sortable list.
 */
export const useSortableItem = (): SortableItemState => useContext(SortableItemContext);

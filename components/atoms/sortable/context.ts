"use client";

import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { createContext } from "react";

/**
 * Per-item state propagated to descendants of `<Item>`. Lets children opt
 * into a "lift" visual (shadow, …) without coupling the atom to a specific
 * card component — consume via `useSortableItem()`.
 */
export type SortableItemState = { isDragging: boolean };

export const SortableItemContext = createContext<SortableItemState>({ isDragging: false });

/**
 * Carries dnd-kit's activator listeners + attributes from `<Item>` down to a
 * `<Handle>` descendant. When `<Item withHandle>` is set, the wrapper div
 * does NOT bind the listeners — only the `<Handle>` does, so a click
 * elsewhere on the item keeps its native behaviour (e.g. selecting a
 * Base UI Select.Item without triggering a drag).
 */
export type SortableHandleState = {
    listeners: DraggableSyntheticListeners;
    attributes: DraggableAttributes;
    setActivatorNodeRef: (node: HTMLElement | null) => void;
};

export const SortableHandleContext = createContext<SortableHandleState | null>(null);

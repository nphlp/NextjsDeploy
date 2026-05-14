"use client";

import Sortable, { Container, Handle, Item, useSortableItem } from "@atoms/sortable";
import { useToast } from "@atoms/toast";
import { type DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import cn from "@lib/cn";
import { GripVertical } from "lucide-react";
import { type ReactNode, useState } from "react";
import { RAW_ITEMS } from "../_lib/mock-data";

/**
 * Section 1 — bare atoms with knob configurations. Each variant shows how
 * the same `<Sortable>` atom adapts via its `mouseHoldDelay` /
 * `touchHoldDelay` props and the Item's `withHandle`.
 */
export default function SortableRawDemo() {
    return (
        <div className="space-y-6">
            <Variant
                title="1a · Default — no hold, whole item"
                desc="Drag fires on mousedown / touchstart. Best for inert chips with no inner clickable elements."
            >
                <RawSortableList mouseHoldDelay={0} touchHoldDelay={0} />
            </Variant>

            <Variant
                title="1b · Mouse instant, touch hold"
                desc="Desktop drag fires on mousedown; touch needs a 250ms hold so native vertical scroll keeps priority on mobile."
            >
                <RawSortableList mouseHoldDelay={0} touchHoldDelay={250} />
            </Variant>

            <Variant
                title="1c · Both — hold on mouse + touch"
                desc="Same press-and-hold gesture across desktop and mobile. Lets native scroll keep priority on touch."
            >
                <RawSortableList mouseHoldDelay={250} touchHoldDelay={250} />
            </Variant>

            <Variant
                title="1d · Handle — no delay, only the grip drags"
                desc="A dedicated handle is its own activation signal — no delay needed. Clicking the chip body does nothing."
            >
                <RawSortableList mouseHoldDelay={0} touchHoldDelay={0} withHandle />
            </Variant>
        </div>
    );
}

type RawSortableListProps = {
    mouseHoldDelay?: number;
    touchHoldDelay?: number;
    holdTolerance?: number;
    withHandle?: boolean;
};

function RawSortableList(props: RawSortableListProps) {
    const { withHandle = false, ...sortableProps } = props;
    const [items, setItems] = useState<string[]>(RAW_ITEMS);
    const toast = useToast();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setItems((order) => arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id))));
        toast.add({ title: "Ordre enregistré", description: "Les chips ont été réordonnées.", type: "success" });
    };

    return (
        <Sortable collisionDetection={closestCenter} onDragEnd={handleDragEnd} {...sortableProps}>
            <Container items={items} strategy={rectSortingStrategy}>
                {/* Auto-fill grid keeps every cell the same width — dnd-kit's
                    rectSortingStrategy assumes uniform tile sizes, so a
                    flex-wrap layout with variable-width chips makes the
                    hit-testing feel jittery. */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,max-content))] gap-2">
                    {items.map((id) => (
                        <Item key={id} id={id} withHandle={withHandle}>
                            <Chip label={id} withHandle={withHandle} />
                        </Item>
                    ))}
                </div>
            </Container>
        </Sortable>
    );
}

function Chip(props: { label: string; withHandle: boolean }) {
    const { label, withHandle } = props;
    const { isDragging } = useSortableItem();
    // Without a handle: content centred in the grid cell.
    // With a handle: handle pinned to the left, label centred in the
    //   remaining space (`flex-1 text-center`).
    return (
        <div
            className={cn(
                "bg-background flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm capitalize",
                "shadow-xs transition-shadow duration-250 ease-out",
                isDragging && "shadow-lg",
            )}
        >
            {withHandle && (
                <Handle
                    label="Réordonner"
                    className="-my-1.25 -ml-1 inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                    <GripVertical className="size-4" />
                </Handle>
            )}
            <span className="flex-1 text-center">{label}</span>
        </div>
    );
}

function Variant(props: { title: string; desc: string; children: ReactNode }) {
    const { title, desc, children } = props;
    return (
        <div className="space-y-2">
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
            {children}
        </div>
    );
}

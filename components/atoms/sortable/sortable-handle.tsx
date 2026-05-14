"use client";

import { type DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import cn from "@lib/cn";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { Container, Handle, Item, Root, type SortableRootProps } from "./atoms";
import { useSortableItem } from "./hooks";

/**
 * Built-in demo for the `<Item withHandle>` + `<Handle>` pattern. Mirrors
 * `<Sortable />` (same items, layout, lift effect) but only the six-dots
 * grip on the left starts a drag — clicks on the chip body stay inert.
 *
 * Use as a quick reference when wiring "Notion-style" reorderable lists.
 */
export default function SortableHandle(props: Omit<SortableRootProps, "children">) {
    const [items, setItems] = useState<string[]>(["alpha", "beta", "gamma", "delta", "epsilon"]);

    // A dedicated handle is its own activation signal — instant drag, no
    // delay needed, on both mouse and touch.
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setItems((order) => arrayMove(order, order.indexOf(String(active.id)), order.indexOf(String(over.id))));
    };

    return (
        <Root collisionDetection={closestCenter} onDragEnd={handleDragEnd} {...props} sensors={sensors}>
            <Container items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,max-content))] gap-2">
                    {items.map((id) => (
                        <Item key={id} id={id} withHandle>
                            <DemoHandleChip label={id} />
                        </Item>
                    ))}
                </div>
            </Container>
        </Root>
    );
}

function DemoHandleChip({ label }: { label: string }) {
    const { isDragging } = useSortableItem();
    return (
        <div
            className={cn(
                "bg-background flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm capitalize",
                "shadow-xs transition-shadow duration-250 ease-out",
                isDragging && "shadow-lg",
            )}
        >
            <Handle
                label="Réordonner"
                className="-my-1.25 -ml-1 inline-flex items-center justify-center rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
                <GripVertical className="size-4" />
            </Handle>
            <span className="flex-1 text-center">{label}</span>
        </div>
    );
}

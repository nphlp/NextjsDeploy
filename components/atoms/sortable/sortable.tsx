"use client";

import { type DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import cn from "@lib/cn";
import { useState } from "react";
import { Container, Item, Root, type SortableRootProps } from "./atoms";
import { useSortableItem } from "./hooks";

export type SortableProps = SortableRootProps & {
    /**
     * Press-and-hold delay (ms) before a mouse drag activates. `0` makes the
     * drag start instantly on mousedown — best when there's no inner clickable
     * element to disambiguate from. Defaults to 250ms.
     */
    mouseHoldDelay?: number;
    /**
     * Press-and-hold delay (ms) before a touch drag activates. Higher values
     * keep native vertical scroll feeling natural on mobile (the gesture
     * window for the drag is wider). Defaults to 250ms.
     */
    touchHoldDelay?: number;
    /**
     * Pixels of movement tolerated during the hold before it cancels back to
     * a click / scroll. Useful on touch where finger jitter is normal.
     * Defaults to 5px.
     */
    holdTolerance?: number;
};

// Default modifiers applied unless the consumer passes `modifiers` explicitly.
// `restrictToFirstScrollableAncestor` clamps the drag to the closest scrollable
// ancestor — keeps the item from sliding off-screen while still letting that
// ancestor scroll naturally (e.g. the popup of a Select stays draggable inside
// itself; a long page lets you drag down to its bottom).
const DEFAULT_MODIFIERS = [restrictToFirstScrollableAncestor];

export default function Sortable(props: SortableProps) {
    const {
        mouseHoldDelay = 250,
        touchHoldDelay = 250,
        holdTolerance = 5,
        sensors: customSensors,
        modifiers: customModifiers,
        children,
        ...rootProps
    } = props;

    // Default sensors: same press-and-hold gesture across mouse + touch unless
    // the consumer overrides via the `sensors` prop or one of the *HoldDelay
    // shortcuts. A `delay: 0` MouseSensor falls back to instant drag on
    // mousedown — pick that when there's no inner clickable element.
    const defaultSensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { delay: mouseHoldDelay, tolerance: holdTolerance } }),
        useSensor(TouchSensor, { activationConstraint: { delay: touchHoldDelay, tolerance: holdTolerance } }),
    );
    const sensors = customSensors ?? defaultSensors;
    const modifiers = customModifiers ?? DEFAULT_MODIFIERS;

    // Composable usage
    if (children) {
        return (
            <Root sensors={sensors} modifiers={modifiers} {...rootProps}>
                {children}
            </Root>
        );
    }

    // Composable demo
    return <SortableDemo sensors={sensors} modifiers={modifiers} {...rootProps} />;
}

function SortableDemo(props: Omit<SortableRootProps, "children">) {
    const [items, setItems] = useState<string[]>(["alpha", "beta", "gamma", "delta", "epsilon"]);

    // Demo owns its sensors (instant drag, mouse + touch) regardless of how
    // the outer `<Sortable>` is configured — the example matches the "1a"
    // raw variant out of the box.
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
                {/* Auto-fill grid keeps every cell the same width — dnd-kit's
                    rectSortingStrategy assumes uniform tile sizes, so a flex
                    row with variable-width chips makes the hit-testing feel
                    erratic. */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,max-content))] gap-2">
                    {items.map((id) => (
                        <Item key={id} id={id}>
                            <DemoChip label={id} />
                        </Item>
                    ))}
                </div>
            </Container>
        </Root>
    );
}

/**
 * Demo chip used by the built-in `<Sortable />` example. Carries the same
 * shadow → shadow-2xl transition pattern recommended for real consumers,
 * so the atom's example showcases the lift effect out of the box.
 */
function DemoChip({ label }: { label: string }) {
    const { isDragging } = useSortableItem();
    return (
        <div
            className={cn(
                "bg-background flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm capitalize",
                "shadow-xs transition-shadow duration-250 ease-out",
                isDragging && "shadow-lg",
            )}
        >
            <span className="flex-1 text-center">{label}</span>
        </div>
    );
}

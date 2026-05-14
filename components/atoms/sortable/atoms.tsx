/**
 * Drag-and-drop sortable atoms — thin wrappers around @dnd-kit/core +
 * @dnd-kit/sortable. Mirrors the project's Base UI atom philosophy: each
 * sub-component is a faithful pass-through that exposes the underlying
 * library's full props surface, with project-friendly defaults baked in.
 *
 * @see https://docs.dndkit.com/api-documentation/context-provider
 * @see https://docs.dndkit.com/presets/sortable
 */

"use client";

import { LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { DndContext, DragOverlay, type UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, type UseSortableArguments, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import cn from "@lib/cn";
import {
    type ComponentProps,
    type MouseEvent,
    type ReactNode,
    useContext,
    useId,
    useLayoutEffect,
    useRef,
} from "react";
import { SortableHandleContext, SortableItemContext } from "./context";

// ----- Root (DndContext) ----- //

export type SortableRootProps = {
    children?: ReactNode;
} & ComponentProps<typeof DndContext>;

/**
 * `DndContext` wrapper. Falls back to a `useId()`-based id when none is
 * supplied so dnd-kit's internal `aria-describedby` counter stays
 * deterministic between SSR and CSR (avoids hydration mismatches).
 */
export const Root = (props: SortableRootProps) => {
    const { id, children, ...otherProps } = props;
    const fallbackId = useId();

    return (
        <DndContext id={id ?? fallbackId} {...otherProps}>
            {children}
        </DndContext>
    );
};

// ----- Container (SortableContext) ----- //

export type SortableContainerProps = {
    children?: ReactNode;
} & ComponentProps<typeof SortableContext>;

/**
 * `SortableContext` wrapper — declares the ordered list of items and the
 * sorting strategy (e.g. `rectSortingStrategy` for a grid).
 */
export const Container = (props: SortableContainerProps) => {
    const { children, ...otherProps } = props;

    return <SortableContext {...otherProps}>{children}</SortableContext>;
};

// ----- Item (useSortable) ----- //

export type SortableItemProps = {
    id: UniqueIdentifier;
    className?: string;
    children?: ReactNode;
    legacyProps?: LegacyProps<StandardAttributes>;
    /** Restrict the drag activator to a `<Handle>` descendant. The wrapper
     *  drops listeners + click-swallow + touch-action so the rest of the
     *  item stays fully interactive (clicks on inner Select.Item / buttons
     *  keep working). Use this for "Notion-style" reorderable lists. */
    withHandle?: boolean;
} & Omit<UseSortableArguments, "id">;

/**
 * `useSortable` wrapper. By default the whole element acts as the drag
 * activator. With `withHandle`, the listeners are forwarded down via
 * context to a `<Handle>` descendant — the rest of the item stays
 * interactive (e.g. Select.Item selection on click).
 */
// Match dnd-kit's `defaultDropAnimationConfiguration` (DragOverlay drop anim).
const DROP_ANIMATION_MS = 250;
const DROP_ANIMATION_EASING = "ease";

export const Item = (props: SortableItemProps) => {
    const {
        id,
        className,
        children,
        legacyProps,
        withHandle = false,
        // useSortable args
        animateLayoutChanges,
        attributes: sortableAttributes,
        data,
        disabled,
        getNewIndex,
        resizeObserverConfig,
        strategy,
        transition: sortableTransition,
    } = props;

    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id,
        animateLayoutChanges,
        attributes: sortableAttributes,
        data,
        disabled,
        getNewIndex,
        resizeObserverConfig,
        strategy,
        transition: sortableTransition,
    });

    // Manual drop animation via Web Animations API. dnd-kit's built-in FLIP
    // skips the dropped item (it assumes a `DragOverlay` handles its drop
    // animation), so without an Overlay the item snaps to its new slot
    // without transition. We capture the visual rect during the drag, then
    // on release compute the delta from that rect to the new DOM position
    // and play it back via `node.animate(...)` — which runs independently
    // of React state and is reliable across paint frames.
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const lastVisualRectRef = useRef<DOMRect | null>(null);
    const wasDraggingRef = useRef(false);
    const dragEndedAtRef = useRef(0);

    const setRefs = (node: HTMLDivElement | null) => {
        nodeRef.current = node;
        setNodeRef(node);
    };

    // Capture the visual rect on every render while dragging — by the last
    // pre-drop render this ref holds the position the item is visually at.
    useLayoutEffect(() => {
        if (isDragging && nodeRef.current) {
            lastVisualRectRef.current = nodeRef.current.getBoundingClientRect();
        }
    });

    // Detect drop, compute the delta, play the animation.
    useLayoutEffect(() => {
        if (isDragging) {
            wasDraggingRef.current = true;
            return;
        }
        if (!wasDraggingRef.current) return;
        wasDraggingRef.current = false;
        dragEndedAtRef.current = performance.now();

        const oldRect = lastVisualRectRef.current;
        const node = nodeRef.current;
        lastVisualRectRef.current = null;
        if (!oldRect || !node) return;

        const newRect = node.getBoundingClientRect();
        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;
        if (dx === 0 && dy === 0) return;

        // Keep the dropped item above its siblings for the duration of the
        // animation. Set the styles on the DOM node directly (not via React
        // state) to avoid cascading renders from a setState in this effect.
        node.style.position = "relative";
        node.style.zIndex = "10";

        const animation = node.animate(
            [{ transform: `translate3d(${dx}px, ${dy}px, 0)` }, { transform: "translate3d(0, 0, 0)" }],
            { duration: DROP_ANIMATION_MS, easing: DROP_ANIMATION_EASING },
        );
        const release = () => {
            node.style.position = "";
            node.style.zIndex = "";
        };
        animation.onfinish = release;
        animation.oncancel = release;
    }, [isDragging]);

    // The wrapper drives translate3d + dnd-kit's own transition (used to
    // animate sibling shifting; null on the dragged item so the pointer is
    // followed instantly). Visual lift effects (scale, shadow, …) are opted
    // into by descendants via `useSortableItem()` — keeps the atom agnostic
    // and lets the card own its own border-radius / transition shape.
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Swallow the synthetic click that follows a drag's `pointerup` so children
    // like <Link> or <button> don't get triggered when the user releases.
    const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
        if (performance.now() - dragEndedAtRef.current < 200) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    return (
        <div
            ref={setRefs}
            style={style}
            data-dragging={isDragging || undefined}
            className={cn(
                // Without a handle: the whole div is the drag activator, so we
                //   keep native vertical scroll (`touch-pan-y`) and block text
                //   selection / iOS context menu on long-press. Idle cursor is
                //   `grab` (open hand); during the drag it flips to `grabbing`
                //   (closed fist) for the wrapper *and* every descendant
                //   (cursor isn't inherited, so we force it on children too).
                // With a handle: only the `<Handle>` carries those constraints
                //   (set on the handle itself), the wrapper stays neutral so
                //   inner buttons / Select.Items behave normally.
                !withHandle && [
                    "touch-pan-y select-none [-webkit-touch-callout:none]",
                    "cursor-grab data-dragging:cursor-grabbing data-dragging:**:cursor-grabbing",
                ],
                // The dragged item rises above its siblings. Visual lift
                // (shadow, …) is the descendants' job via
                // `useSortableItem()` — the source item itself stays visible
                // and follows the pointer through dnd-kit's translate3d.
                "data-dragging:relative data-dragging:z-10",
                className,
            )}
            onClickCapture={handleClickCapture}
            {...(!withHandle && attributes)}
            {...(!withHandle && listeners)}
            {...legacyProps}
        >
            <SortableItemContext.Provider value={{ isDragging }}>
                <SortableHandleContext.Provider value={{ listeners, attributes, setActivatorNodeRef }}>
                    {children}
                </SortableHandleContext.Provider>
            </SortableItemContext.Provider>
        </div>
    );
};

// ----- Handle ----- //

export type SortableHandleProps = {
    children?: ReactNode;
    className?: string;
    /** ARIA label for the drag button. Defaults to "Drag to reorder". */
    label?: string;
    legacyProps?: LegacyProps<StandardAttributes>;
};

/**
 * Drag activator element — must be rendered inside a `<Item withHandle>`.
 * Renders a `<button type="button">` carrying dnd-kit's listeners +
 * `setActivatorNodeRef`. Click outside the handle stays inert (no drag),
 * which lets sibling controls (selection, links, …) keep their default
 * behaviour.
 */
export const Handle = (props: SortableHandleProps) => {
    const { children, className, label = "Drag to reorder", legacyProps } = props;
    const ctx = useContext(SortableHandleContext);
    // Destructured up-front so ESLint's react-hooks/refs rule doesn't flag
    // `ctx.setActivatorNodeRef` as a ref accessed during render.
    const { listeners, attributes, setActivatorNodeRef } = ctx ?? {
        listeners: undefined,
        attributes: undefined,
        setActivatorNodeRef: undefined,
    };
    if (!ctx) return <span className={className}>{children}</span>;
    return (
        <button
            type="button"
            ref={setActivatorNodeRef}
            aria-label={label}
            className={cn(
                "cursor-grab touch-none select-none [-webkit-touch-callout:none]",
                "active:cursor-grabbing",
                className,
            )}
            {...attributes}
            {...listeners}
            {...legacyProps}
        >
            {children}
        </button>
    );
};

// ----- Overlay (DragOverlay) ----- //

export type SortableOverlayProps = {
    children?: ReactNode;
} & ComponentProps<typeof DragOverlay>;

/**
 * `DragOverlay` wrapper — opt-in escape hatch for cases where the source
 * item can't follow the pointer naturally (e.g. it lives inside a scrollable
 * Base UI `Popup` and would be clipped). Pair with `useSortableActiveId()`
 * to look up the active id and render the matching node here. The default
 * Sortable usage doesn't need this — the source item follows the pointer
 * via dnd-kit's `translate3d`, like the official docs recommend.
 */
export const Overlay = (props: SortableOverlayProps) => {
    const { children, ...otherProps } = props;
    return <DragOverlay {...otherProps}>{children}</DragOverlay>;
};

# Base UI

Reference: https://base-ui.com/react/components

> **For LLMs:** Use the `context7` MCP server (`resolve-library-id` + `query-docs`) to look up Base UI documentation when you need details on a specific component's API, props, or behavior.

## Philosophy

Base UI provides **unstyled, composable** React primitives (dialogs, menus, selects, etc.). Each primitive is a collection of sub-components (`Root`, `Trigger`, `Popup`, etc.) that the consumer assembles.

Our atom system wraps each Base-UI sub-component in a **thin styled layer** that:

1. **Applies project styles** — Tailwind classes from the Base UI docs, adapted to our theme tokens
2. **Exposes a typed API** — explicit props (`className`, `children`, `onClick`), styling props (`ButtonStyleProps`), and a `legacyProps` escape hatch for native HTML attributes
3. **Stays as close to Base UI as possible** — no custom logic, no renamed callbacks, no transformed props. The wrapper is purely presentational. This means the official Base UI documentation remains the primary reference for behavior, and any Base UI example can be adapted with minimal effort

The result: composable atoms that can be assembled exactly like the Base UI docs show, with project styling baked in.

---

## Patterns

### Standard pattern (this guide)

Faithful wrappers around Base-UI sub-components. Styles from the docs, props split into explicit + legacy + BaseUI-specific.

Components: `alert-dialog`, `dialog`, `collapsible`, `tabs`, `switch`, `drawer`, `popover`, `slider`, `combobox`, `accordion`, `checkbox`, `context-menu`, `select`, `menu`.

### Project-specific overrides (not covered)

Custom API with transformed props, project logic (FormContext, variant system, etc.). Case-by-case.

Components: `toast`, `button`, `input`, `_form`.

---

## File structure

```
components/atoms/
├── _core/
│   ├── types.ts              # Shared utility types (LegacyProps, BaseUiProps)
│   └── button-variants.ts    # buttonVariants, buttonStyle, loaderColor, ButtonStyleProps
├── _form/                    # Form system (adapters, context, schemas) — see 5-form.md
└── [component]/
    ├── atoms.tsx              # Styled Base-UI wrappers (shared across variants)
    ├── atoms-[variant].tsx    # Variant-specific atoms (optional, e.g. atoms-snap.tsx)
    ├── [component].tsx        # "use client" + conditional children (main variant)
    ├── [component]-[variant].tsx  # Derived component (optional, e.g. select-multiple.tsx)
    ├── utils.tsx              # Shared helpers (optional, e.g. renderValue for select)
    └── index.ts               # export { default } + export * from "./atoms" + optional variant atoms
```

**Derived components:**

- `select/` → `select.tsx` + `select-multiple.tsx`
- `combobox/` → `combobox.tsx` + `combobox-multiple.tsx` + `combobox-async.tsx` + `combobox-multiple-async.tsx`
- `drawer/` → `drawer.tsx` + `drawer-non-modal.tsx` + `drawer-snap-points.tsx`
- `input/` → `input.tsx` + `input-password.tsx` + `input-otp.tsx` + `text-area.tsx`
- `tabs/` → `tabs.tsx` + `tabs-vertical.tsx`
- `switch/` → `switch.tsx` + `switch-chip.tsx`
- `slider/` → `slider.tsx` + `slider-range.tsx`
- `checkbox/` → `checkbox.tsx` + `checkbox-chip.tsx`

---

## Utility types (`_core/types.ts`)

| Type                 | Purpose                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `StandardAttributes` | `HTMLAttributes<HTMLElement>` — for div, heading, paragraph atoms                                         |
| `ButtonAttributes`   | `ButtonHTMLAttributes<HTMLButtonElement>` — for button atoms                                              |
| `LegacyProps<T, K>`  | All native props except `className`, `children`, and keys in `K`                                          |
| `BaseUiProps<C, T>`  | `ComponentProps<C>` minus `keyof T` — only BaseUI-specific props                                          |
| `ButtonStyleProps`   | Shared styling props for Trigger/Close (`colors`, `rounded`, `padding`, `noFlex`, `noOutline`, `noStyle`) |

---

## Atom categories

Every atom falls into one of 3 categories:

| Category      | Element                | Explicit props                     | Intersection                                          |
| ------------- | ---------------------- | ---------------------------------- | ----------------------------------------------------- |
| Behavior-only | —                      | `children`                         | `ComponentProps<BaseUi.X>`                            |
| Button        | `<button>`             | `className`, `children`, `onClick` | `ButtonStyleProps & BaseUiProps<X, ButtonAttributes>` |
| Container     | `<div>`, `<h2>`, `<p>` | `className`, `children`            | `BaseUiProps<X, StandardAttributes>`                  |

Button atoms use `buttonStyle()` for styling. Button and container atoms accept `legacyProps` for native HTML escape hatch.

### Behavior-only (Root, Portal)

No HTML element. Full `ComponentProps` spread.

```tsx
export type AlertDialogProps = {
    children?: ReactNode;
} & ComponentProps<typeof AlertDialogBaseUi.Root>;

export const Root = (props: AlertDialogProps) => {
    const { children, ...otherProps } = props;
    return <AlertDialogBaseUi.Root {...otherProps}>{children}</AlertDialogBaseUi.Root>;
};
```

### Button atom (Trigger, Close)

Renders `<button>`. Uses `buttonStyle()` + `ButtonStyleProps` + `LegacyProps` + `BaseUiProps`.

```tsx
type AlertDialogTriggerProps = {
    className?: string;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & ButtonStyleProps &
    BaseUiProps<typeof AlertDialogBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: AlertDialogTriggerProps) => {
    const {
        className,
        children,
        colors = "outline",
        rounded = "md",
        padding = "md",
        noFlex = false,
        noOutline = false,
        noStyle = false,
        legacyProps,
        ...otherProps
    } = props;

    return (
        <AlertDialogBaseUi.Trigger
            className={cn(buttonStyle({ colors, rounded, padding, noFlex, noOutline, noStyle }), className)}
            {...legacyProps}
            {...otherProps}
        >
            {children}
        </AlertDialogBaseUi.Trigger>
    );
};
```

### Container atom (Backdrop, Popup, Title, Description)

Renders `<div>`, `<h2>`, `<p>`, etc. Same pattern with `StandardAttributes`.

```tsx
type AlertDialogPopupProps = {
    className?: string;
    children?: ReactNode;
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Popup, StandardAttributes>;

export const Popup = (props: AlertDialogPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;
    return (
        <AlertDialogBaseUi.Popup className={cn("...", className)} {...legacyProps} {...otherProps}>
            {children}
        </AlertDialogBaseUi.Popup>
    );
};
```

---

## Step-by-step

### 1. Copy the Tailwind example

Go to `https://base-ui.com/react/components/[component]` and copy the **Tailwind CSS** hero example.

### 2. Create `atoms.tsx`

One named export per Base-UI sub-component. Add JSDoc link at the top:

```tsx
/**
 * @see https://base-ui.com/react/components/alert-dialog
 */
import { BaseUiProps, ButtonAttributes, ButtonStyleProps, LegacyProps, StandardAttributes } from "@atoms/_core/types";
import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { buttonStyle } from "../_core/button-variants";
```

### 3. Type each atom

Identify the category (behavior-only / button / container) and apply the corresponding pattern.

### 4. Organize `cn()` classes

```tsx
className={cn(
    // Layout      — position, display, flex, size, spacing
    // Border      — rounded, border, outline
    // Background  — bg-*
    // Text        — text-*, font-*, select-none
    // Shadow      — shadow-*
    // Animation   — transition, duration, data-*-style
    // State       — hover, active, focus-visible, disabled
    // Overrides   — className (always last)
)}
```

### 5. Theme substitutions

| Base-UI docs                 | Theme token        |
| ---------------------------- | ------------------ |
| `bg-gray-50` / `bg-[canvas]` | `bg-background`    |
| `text-gray-900`              | `text-foreground`  |
| `text-red-800`               | `text-destructive` |
| `outline-blue-800`           | `outline-outline`  |

**Keep as-is:** `bg-black` (overlays), `dark:opacity-70`, `dark:outline-gray-300`, `gray-*` classes (100–800).

### 6. Focus outline offset

Focus outlines must sit **outside** the border. Use `outline-offset-0`, never `-outline-offset-1`:

```tsx
"focus-visible:outline-outline focus-visible:outline-2 focus-visible:outline-offset-0";
```

> `dark:-outline-offset-1` on Popup containers is a static border style, not a focus ring — this is fine.

### 7. Tailwind v4 migration

| v3 (Base-UI docs)                               | v4                             |
| ----------------------------------------------- | ------------------------------ |
| `data-[ending-style]:opacity-0`                 | `data-ending-style:opacity-0`  |
| `data-[starting-style]:scale-90`                | `data-starting-style:scale-90` |
| `outline outline-1`                             | `outline-1`                    |
| `focus-visible:outline focus-visible:outline-2` | `focus-visible:outline-2`      |

### 8. Replace SVG icons

Replace inline SVG components from Base-UI examples with Lucide React imports:

```tsx
import { Check, ChevronDown } from "lucide-react";
```

### 9. Create `[component].tsx`

Pattern: `"use client"` + conditional children.

```tsx
"use client";

import { AlertDialogProps, Backdrop, Close, Description, Popup, Portal, Root, Title, Trigger } from "./atoms";

export default function AlertDialog(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root {...otherProps}>
            <Trigger colors="destructive">Discard draft</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Discard draft?</Title>
                    <Description>You can&apos;t undo this action.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Cancel</Close>
                        <Close colors="destructive">Discard</Close>
                    </div>
                </Popup>
            </Portal>
        </Root>
    );
}
```

### 10. Create `index.ts`

```tsx
export { default } from "./alert-dialog";
export * from "./atoms";
```

### 11. Verify

```bash
pnpm checks
```

---

## Component inventory

| Component    | Pattern  | Sub-components | Derived                                                    |
| ------------ | -------- | -------------- | ---------------------------------------------------------- |
| alert-dialog | Standard | 8              | —                                                          |
| dialog       | Standard | 8              | —                                                          |
| collapsible  | Standard | 3              | —                                                          |
| tabs         | Standard | 5              | tabs-vertical                                              |
| switch       | Standard | 2              | switch-chip                                                |
| drawer       | Standard | 9 + variants   | drawer-non-modal, drawer-snap-points                       |
| popover      | Standard | 11             | —                                                          |
| slider       | Standard | 6              | slider-range                                               |
| combobox     | Standard | 14 + multiple  | combobox-multiple, combobox-async, combobox-multiple-async |
| accordion    | Standard | 5              | —                                                          |
| checkbox     | Standard | 2              | checkbox-chip                                              |
| context-menu | Standard | 8              | —                                                          |
| select       | Standard | 15             | select-multiple                                            |
| menu         | Standard | 15             | —                                                          |
| toast        | Custom   | 8              | —                                                          |
| button       | Custom   | 2              | —                                                          |
| input        | Custom   | 1              | input-password, input-otp, text-area                       |
| \_form       | Custom   | —              | —                                                          |

### Removed

- ~~tooltip~~ — Hover-only, doesn't work on mobile. Use popover instead.

---

## Button variant defaults

Default `colors` is `"outline"` for all Triggers/Close. Available colors: `solid`, `outline`, `ghost`, `primary`, `destructive`, `link`.

---

## Usage

```tsx
import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@atoms/alert-dialog";

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <Portal>
        <Backdrop />
        <Popup>
            <Title>My title</Title>
            <Description>My description</Description>
            <div className="flex justify-end gap-4">
                <Close>Cancel</Close>
                <Close colors="destructive">Confirm</Close>
            </div>
        </Popup>
    </Portal>
</AlertDialog>;
```

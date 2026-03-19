# Component Inventory

Detailed typing and pattern for every implemented Base-UI component.

---

## Summary

| Component    | Pattern  | Sub-components                                                                                                      | Derived                                                    | Collision K                        |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| alert-dialog | Standard | 8 (Root, Trigger, Backdrop, Portal, Popup, Title, Description, Close)                                               | —                                                          | —                                  |
| dialog       | Standard | 8 (Root, Trigger, Backdrop, Portal, Popup, Title, Description, Close)                                               | —                                                          | —                                  |
| collapsible  | Standard | 3 (Root, Trigger, Panel)                                                                                            | —                                                          | —                                  |
| tabs         | Standard | 5 (Root, List, Tab, Indicator, Panel)                                                                               | tabs-vertical                                              | Root: `defaultValue`, Tab: `value` |
| switch       | Standard | 2 (Root, Thumb)                                                                                                     | switch-chip                                                | Root: `defaultChecked`             |
| drawer       | Standard | 9 + variants (Root, Trigger, Portal, Backdrop, Popup, Viewport, Title, Description, Content, Close)                 | drawer-non-modal, drawer-snap-points                       | —                                  |
| popover      | Standard | 9 (Root, Trigger, Backdrop, Portal, Positioner, Popup, Arrow, Viewport, Title, Description, Close)                  | —                                                          | —                                  |
| slider       | Standard | 6 (Root, Control, Track, Indicator, Thumb, Value)                                                                   | slider-range                                               | Root: `defaultValue`               |
| combobox     | Standard | 14 + multiple atoms (Root, Input, Trigger, Portal, Positioner, Popup, List, Item, ItemIndicator, Empty, Clear, ...) | combobox-multiple, combobox-async, combobox-multiple-async | —                                  |
| accordion    | Standard | 5 (Root, Item, Header, Trigger, Panel)                                                                              | —                                                          | —                                  |
| checkbox     | Standard | 2 (Root, Indicator)                                                                                                 | checkbox-chip                                              | —                                  |
| context-menu | Standard | 8 (Root, Trigger, Portal, Positioner, Popup, Item, Separator, SubmenuRoot, SubmenuTrigger)                          | —                                                          | —                                  |
| select       | Custom   | 12                                                                                                                  | select-multiple                                            | —                                  |
| menu         | Custom   | 17                                                                                                                  | —                                                          | —                                  |
| toast        | Custom   | 8                                                                                                                   | —                                                          | —                                  |
| button       | Custom   | 2 (Button, Link)                                                                                                    | —                                                          | —                                  |
| input        | Custom   | 1                                                                                                                   | input-password, input-otp, text-area                       | —                                  |
| form/field   | Custom   | 5                                                                                                                   | —                                                          | —                                  |

### Removed

- ~~tooltip~~ — Removed. Hover-only, doesn't work on mobile. Use popover instead.

---

## Typing system (`types.ts`)

| Type                   | Purpose                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `StandardAttributes`   | `HTMLAttributes<HTMLElement>` — div, heading, paragraph                                                   |
| `ButtonAttributes`     | `ButtonHTMLAttributes<HTMLButtonElement>` — button                                                        |
| `LegacyProps<T, K>`    | All native props except className, children, and keys in K                                                |
| `BaseUiProps<C, T, K>` | ComponentProps minus native HTML — K = keys to keep (collisions)                                          |
| `ButtonStyleProps`     | Shared styling props for Trigger/Close (`colors`, `rounded`, `padding`, `noFlex`, `noOutline`, `noStyle`) |

### 3 atom categories

| Category      | Element                | Explicit props                     | Intersection                                          |
| ------------- | ---------------------- | ---------------------------------- | ----------------------------------------------------- |
| Behavior-only | —                      | `children`                         | `ComponentProps<BaseUi.X>`                            |
| Button        | `<button>`             | `className`, `children`, `onClick` | `ButtonStyleProps & BaseUiProps<X, ButtonAttributes>` |
| Container     | `<div>`, `<h2>`, `<p>` | `className`, `children`            | `BaseUiProps<X, StandardAttributes>`                  |

Button atoms use `buttonStyle()` for styling and accept `ButtonStyleProps` (`colors`, `rounded`, `padding`, `noFlex`, `noOutline`, `noStyle`).
Button and container atoms also accept `legacyProps` for native HTML escape hatch.

### Button variant defaults

Default `colors` is `"outline"` for all Triggers/Close. Color variant `"default"` has been renamed to `"solid"`.

Available colors: `solid`, `outline`, `ghost`, `primary`, `destructive`, `link`.

---

## Standard pattern — `ButtonStyleProps` + `buttonStyle()`

### alert-dialog

| Atom          | Category      | Explicit props                               | Legacy                           |
| ------------- | ------------- | -------------------------------------------- | -------------------------------- |
| `Root`        | Behavior-only | `children`                                   | —                                |
| `Trigger`     | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |
| `Backdrop`    | Container     | `className`                                  | `LegacyProps<Standard>`          |
| `Portal`      | Behavior-only | `children`                                   | —                                |
| `Popup`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Title`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Description` | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Close`       | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |

### dialog

Same structure as alert-dialog.

### collapsible

| Atom      | Category      | Explicit props                               | Legacy                           |
| --------- | ------------- | -------------------------------------------- | -------------------------------- |
| `Root`    | Behavior-only | `children`                                   | —                                |
| `Trigger` | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |
| `Panel`   | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |

### tabs

| Atom        | Category  | Explicit props                              | Legacy                           |
| ----------- | --------- | ------------------------------------------- | -------------------------------- |
| `Root`      | Container | `className`, `children`, `defaultValue`     | `LegacyProps<Standard>`          |
| `List`      | Container | `className`, `children`                     | `LegacyProps<Standard>`          |
| `Tab`       | Button    | `className`, `children`, `value`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Indicator` | Container | `className`                                 | `LegacyProps<Standard>`          |
| `Panel`     | Container | `className`, `children`                     | `LegacyProps<Standard>`          |

Tab uses standard outline focus (no `before:` pseudo-element). Supports `orientation="vertical"` on Root.

### switch

| Atom    | Category  | Explicit props          | Legacy                  |
| ------- | --------- | ----------------------- | ----------------------- |
| `Root`  | Container | `className`, `children` | `LegacyProps<Standard>` |
| `Thumb` | Container | `className`             | `LegacyProps<Standard>` |

### drawer

Base atoms (`atoms.tsx`):

| Atom          | Category      | Explicit props                               | Legacy                           |
| ------------- | ------------- | -------------------------------------------- | -------------------------------- |
| `Root`        | Behavior-only | `children`                                   | —                                |
| `Trigger`     | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |
| `Backdrop`    | Container     | `className`                                  | `LegacyProps<Standard>`          |
| `Portal`      | Behavior-only | `children`                                   | —                                |
| `Viewport`    | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Popup`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Title`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Description` | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Content`     | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Close`       | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |

Variant atoms in `atoms-non-modal.tsx`: `NonModalViewport`, `NonModalPopup`.
Variant atoms in `atoms-snap.tsx`: `SnapViewport`, `SnapPopup`, `DragHandle`, `SnapContent`.

### popover

| Atom          | Category      | Explicit props                               | Legacy                           |
| ------------- | ------------- | -------------------------------------------- | -------------------------------- |
| `Root`        | Behavior-only | `children`                                   | —                                |
| `Trigger`     | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |
| `Backdrop`    | Container     | `className`                                  | `LegacyProps<Standard>`          |
| `Portal`      | Behavior-only | `children`                                   | —                                |
| `Positioner`  | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Popup`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Arrow`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Viewport`    | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Title`       | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Description` | Container     | `className`, `children`                      | `LegacyProps<Standard>`          |
| `Close`       | Button        | `className`, `children`, `onClick` + styling | `LegacyProps<Button, "onClick">` |

### slider

| Atom        | Category  | Explicit props          | Legacy                                  |
| ----------- | --------- | ----------------------- | --------------------------------------- |
| `Root`      | Container | `className`, `children` | `LegacyProps<Standard, "defaultValue">` |
| `Control`   | Container | `className`, `children` | `LegacyProps<Standard>`                 |
| `Track`     | Container | `className`, `children` | `LegacyProps<Standard>`                 |
| `Indicator` | Container | `className`             | `LegacyProps<Standard>`                 |
| `Thumb`     | Container | `className`             | `LegacyProps<Standard>`                 |
| `Value`     | Container | `className`, `children` | `LegacyProps<Standard>`                 |

Value's `children` is a render function `(formattedValues, values) => ReactNode`.

### combobox

Base atoms (`atoms.tsx`):

| Atom            | Category      | Explicit props                     | Legacy                           |
| --------------- | ------------- | ---------------------------------- | -------------------------------- |
| `Root`          | Behavior-only | `children`                         | —                                |
| `Input`         | Container     | `className`                        | `LegacyProps<Standard>`          |
| `Trigger`       | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Portal`        | Behavior-only | `children`                         | —                                |
| `Positioner`    | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Popup`         | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `List`          | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Item`          | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `ItemIndicator` | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Empty`         | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Clear`         | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Chips`         | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Chip`          | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `ChipRemove`    | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |

Multiple atoms (`atoms-multiple.tsx`): `Value`, `ChipsContainer`, `ChipsInput`, `MultipleChip`, `MultipleChipRemove`.

### accordion

| Atom      | Category      | Explicit props                     | Legacy                           |
| --------- | ------------- | ---------------------------------- | -------------------------------- |
| `Root`    | Container     | `className`, `children`            | —                                |
| `Item`    | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Header`  | Behavior-only | `children`                         | —                                |
| `Trigger` | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Panel`   | Container     | `className`, `children`            | `LegacyProps<Standard>`          |

Accordion Trigger uses custom full-width layout (not `buttonStyle`).

### checkbox

| Atom        | Category | Explicit props          | Legacy |
| ----------- | -------- | ----------------------- | ------ |
| `Root`      | Button   | `className`, `children` | —      |
| `Indicator` | —        | `className`, `children` | —      |

Root uses `ComponentProps` directly. Indicator includes default `Check` icon from Lucide.

### context-menu

| Atom             | Category      | Explicit props          | Legacy |
| ---------------- | ------------- | ----------------------- | ------ |
| `Root`           | Behavior-only | `children`              | —      |
| `Trigger`        | Container     | `className`, `children` | —      |
| `Portal`         | Behavior-only | `children`              | —      |
| `Positioner`     | Container     | `className`, `children` | —      |
| `Popup`          | Container     | `className`, `children` | —      |
| `Item`           | Container     | `className`, `children` | —      |
| `Separator`      | Container     | `className`             | —      |
| `SubmenuRoot`    | Behavior-only | `children`              | —      |
| `SubmenuTrigger` | Container     | `className`, `children` | —      |

Uses `ComponentProps` directly. Shared `itemClasses` for Item/SubmenuTrigger highlight styles.

---

## Custom pattern — transformed API

### select

| Atom          | Props type                                                        | Notes                                                      |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `Root`        | `{ selected?; onSelect?; multiple?; children }`                   | Renames `value` → `selected`, `onValueChange` → `onSelect` |
| `Trigger`     | `{ className?; children }`                                        |                                                            |
| `Value`       | `{ children? }`                                                   |                                                            |
| `Portal`      | `{ children }`                                                    |                                                            |
| `Positioner`  | `{ side?; align?; sideOffset?; alignItemWithTrigger?; children }` |                                                            |
| `Popup`       | `{ withScrollArrows?; children }`                                 | Custom prop `withScrollArrows`                             |
| `List`        | `{ children }`                                                    |                                                            |
| `Item`        | `{ label; itemKey; className? }`                                  | Renames `value` → `itemKey`                                |
| `Placeholder` | `{ label; className? }`                                           |                                                            |
| `Separator`   | `{ className? }`                                                  |                                                            |
| `Group`       | `{ label; children; className? }`                                 |                                                            |
| `ScrollArrow` | `{ visible; direction }`                                          |                                                            |

### menu

| Atom            | Props type                                                          | Notes                                          |
| --------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| `Root`          | `{ children }`                                                      | Wrapped in `<div>` to prevent space-y shifting |
| `Trigger`       | `{ className?; openOnHover? } & ({ label } \| { children })`        | Discriminated union                            |
| `Portal`        | `{ children }`                                                      |                                                |
| `Positioner`    | `{ children; sideOffset?; side?; align? }`                          |                                                |
| `Popup`         | `{ popoverWithoutArrow?; children; className? }`                    | Custom prop                                    |
| `Arrow`         | _(none)_                                                            |                                                |
| `ButtonItem`    | `{ value; onItemClick?; className? } & ({ label } \| { children })` | Discriminated union                            |
| `CheckboxItem`  | `{ label; checked?; setCheckedChange?; defaultChecked? }`           | Renames `onCheckedChange`                      |
| `RadioSet`      | `{ selectedRadio?; setSelectedRadio?; defaultValue?; children }`    | Renames `onValueChange`                        |
| `RadioItem`     | `{ label; value }`                                                  | Uses CheckIcon (same as CheckboxItem)          |
| `Group`         | `{ label; children }`                                               |                                                |
| `Separator`     | _(none)_                                                            |                                                |
| `SubMenu`       | `{ children }`                                                      |                                                |
| `SubTrigger`    | `{ label; className?; openOnHover? }`                               |                                                |
| `SubPortal`     | `{ children }`                                                      |                                                |
| `SubPositioner` | `{ children; sideOffset? }`                                         |                                                |
| `SubPopup`      | `{ children }`                                                      |                                                |

---

## Project-specific — custom logic

### button

| Component | Props type                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`  | `{ type?; label; children?; colors?; rounded?; padding?; noFlex?; noOutline?; noStyle?; className?; loaderColorClass?; loading?; disabled?; legacyProps?; ref?; onClick?; onFocus? }` |
| `Link`    | `{ href; label; children?; colors?; rounded?; padding?; noFlex?; noOutline?; noStyle?; className?; loaderColorClass?; loading?; disabled?; legacyProps?; ref?; onNavigate? }`         |

Uses `buttonStyle()` from `button-variants.ts`. Default `colors` is `"outline"`.
Available colors: `solid`, `outline`, `ghost`, `primary`, `destructive`, `link`.

### input

| Atom   | Props type                                                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Root` | `{ className?; type?; name?; placeholder?; disabled?; required?; autoComplete?; autoFocus?; ref?; setValue?; value?; onFocus?; onChange?; onBlur?; useForm?; render?; legacyProps? }` |

FormContext integration (`useForm`, `register`), `setValue` for useState compatibility.

### form/field

| Component      | Props type                                                                                |
| -------------- | ----------------------------------------------------------------------------------------- |
| `Form`         | `{ onSubmit; register; className?; children?; legacyProps? }`                             |
| `Field`        | `{ name; label; description; className?; children?; disabled?; required?; legacyProps? }` |
| `Label`        | `{ label; name; className?; required?; legacyProps? }`                                    |
| `RequiredNote` | `{ className?; classNameLabel?; classNameText? }`                                         |
| `Indication`   | `{ name; description; className? }`                                                       |

Native HTML elements with custom `useFormContext`.

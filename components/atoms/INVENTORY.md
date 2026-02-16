# Component Inventory

Detailed typing and pattern for every implemented Base-UI component.

---

## Summary

| Component    | Pattern  | Sub-components                                                                                                         | Collision K                        |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| alert-dialog | Standard | 8 (Root, Trigger, Backdrop, Portal, Popup, Title, Description, Close)                                                  | —                                  |
| dialog       | Standard | 8 (Root, Trigger, Backdrop, Portal, Popup, Title, Description, Close)                                                  | —                                  |
| collapsible  | Standard | 3 (Root, Trigger, Panel)                                                                                               | —                                  |
| tabs         | Standard | 5 (Root, List, Tab, Indicator, Panel)                                                                                  | Root: `defaultValue`, Tab: `value` |
| switch       | Standard | 2 (Root, Thumb)                                                                                                        | Root: `defaultChecked`             |
| drawer       | Standard | 9 (Root, Trigger, Portal, Backdrop, Popup, Viewport, Title, Description, Close)                                        | —                                  |
| tooltip      | Standard | 7 (Provider, Root, Trigger, Portal, Positioner, Popup, Arrow)                                                          | —                                  |
| slider       | Standard | 6 (Root, Control, Track, Indicator, Thumb, Value)                                                                      | Root: `defaultValue`               |
| combobox     | Standard | 14 (Root, Input, Trigger, Portal, Positioner, Popup, List, Item, ItemIndicator, Empty, Clear, Chips, Chip, ChipRemove) | —                                  |
| select       | Custom   | 12                                                                                                                     | —                                  |
| menu         | Custom   | 17                                                                                                                     | —                                  |
| toast        | Custom   | 8                                                                                                                      | —                                  |
| button       | Custom   | 1                                                                                                                      | —                                  |
| input        | Custom   | 1                                                                                                                      | —                                  |
| form/field   | Custom   | 5                                                                                                                      | —                                  |

---

## Typing system (`types.ts`)

| Type                   | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| `StandardAttributes`   | `HTMLAttributes<HTMLElement>` — div, heading, paragraph          |
| `ButtonAttributes`     | `ButtonHTMLAttributes<HTMLButtonElement>` — button               |
| `LegacyProps<T, K>`    | All native props except className, children, and keys in K       |
| `BaseUiProps<C, T, K>` | ComponentProps minus native HTML — K = keys to keep (collisions) |

### 3 atom categories

| Category      | Element                | Explicit props                     | Intersection                         |
| ------------- | ---------------------- | ---------------------------------- | ------------------------------------ |
| Behavior-only | —                      | `children`                         | `ComponentProps<BaseUi.X>`           |
| Button        | `<button>`             | `className`, `children`, `onClick` | `BaseUiProps<X, ButtonAttributes>`   |
| Container     | `<div>`, `<h2>`, `<p>` | `className`, `children`            | `BaseUiProps<X, StandardAttributes>` |

Button and container atoms also accept `legacyProps` for native HTML escape hatch.

---

## Standard pattern — `LegacyProps` + `BaseUiProps`

### alert-dialog

| Atom          | Category      | Explicit props                     | Legacy                           |
| ------------- | ------------- | ---------------------------------- | -------------------------------- |
| `Root`        | Behavior-only | `children`                         | —                                |
| `Trigger`     | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Backdrop`    | Container     | `className`                        | `LegacyProps<Standard>`          |
| `Portal`      | Behavior-only | `children`                         | —                                |
| `Popup`       | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Title`       | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Description` | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Close`       | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |

### dialog

Same structure as alert-dialog. Only difference: `Trigger` uses `text-foreground` instead of `text-destructive`.

### collapsible

| Atom      | Category      | Explicit props                     | Legacy                           |
| --------- | ------------- | ---------------------------------- | -------------------------------- |
| `Root`    | Behavior-only | `children`                         | —                                |
| `Trigger` | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Panel`   | Container     | `className`, `children`            | `LegacyProps<Standard>`          |

### tabs

| Atom        | Category  | Explicit props                              | Legacy                           |
| ----------- | --------- | ------------------------------------------- | -------------------------------- |
| `Root`      | Container | `className`, `children`, `defaultValue`     | `LegacyProps<Standard>`          |
| `List`      | Container | `className`, `children`                     | `LegacyProps<Standard>`          |
| `Tab`       | Button    | `className`, `children`, `value`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Indicator` | Container | `className`                                 | `LegacyProps<Standard>`          |
| `Panel`     | Container | `className`, `children`                     | `LegacyProps<Standard>`          |

Root and Tab use the `K` generic of `BaseUiProps` to keep `defaultValue` and `value` (collide with native HTML attributes).

### switch

| Atom    | Category  | Explicit props          | Legacy                  |
| ------- | --------- | ----------------------- | ----------------------- |
| `Root`  | Container | `className`, `children` | `LegacyProps<Standard>` |
| `Thumb` | Container | `className`             | `LegacyProps<Standard>` |

Root uses `K = "defaultChecked"` in `BaseUiProps` to keep `defaultChecked` (collides with native HTML). `"use client"` directive.

### drawer

| Atom          | Category      | Explicit props                     | Legacy                           |
| ------------- | ------------- | ---------------------------------- | -------------------------------- |
| `Root`        | Behavior-only | `children`                         | —                                |
| `Trigger`     | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Backdrop`    | Container     | `className`                        | `LegacyProps<Standard>`          |
| `Portal`      | Behavior-only | `children`                         | —                                |
| `Viewport`    | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Popup`       | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Title`       | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Description` | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Close`       | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |

Same structure as dialog. Imported as `DrawerPreview` (preview API in Base-UI).

### tooltip

| Atom         | Category      | Explicit props                     | Legacy                           |
| ------------ | ------------- | ---------------------------------- | -------------------------------- |
| `Provider`   | Behavior-only | (spread)                           | —                                |
| `Root`       | Behavior-only | `children`                         | —                                |
| `Trigger`    | Button        | `className`, `children`, `onClick` | `LegacyProps<Button, "onClick">` |
| `Portal`     | Behavior-only | `children`                         | —                                |
| `Positioner` | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Popup`      | Container     | `className`, `children`            | `LegacyProps<Standard>`          |
| `Arrow`      | Container     | `className`, `children`            | `LegacyProps<Standard>`          |

Provider wraps everything to coordinate tooltip delays. Arrow includes built-in SVG. `"use client"` directive.

### slider

| Atom        | Category  | Explicit props          | Legacy                                  |
| ----------- | --------- | ----------------------- | --------------------------------------- |
| `Root`      | Container | `className`, `children` | `LegacyProps<Standard, "defaultValue">` |
| `Control`   | Container | `className`, `children` | `LegacyProps<Standard>`                 |
| `Track`     | Container | `className`, `children` | `LegacyProps<Standard>`                 |
| `Indicator` | Container | `className`             | `LegacyProps<Standard>`                 |
| `Thumb`     | Container | `className`             | `LegacyProps<Standard>`                 |
| `Value`     | Container | `className`, `children` | `LegacyProps<Standard>`                 |

Root uses `K = "defaultValue"` in `BaseUiProps`. Value's `children` is a render function `(formattedValues, values) => ReactNode`. `"use client"` directive.

### combobox

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

Root uses `ComponentProps` directly (generic `<Value, Multiple>`). Trigger/Clear/ChipRemove include default Lucide icons. `"use client"` directive.

### toast

| Atom          | Props type                               | Pattern             |
| ------------- | ---------------------------------------- | ------------------- |
| `Provider`    | `{ children }`                           | Custom              |
| `Portal`      | `{ children }`                           | Custom              |
| `Viewport`    | `{ children }`                           | Custom              |
| `Root`        | `{ children } & ComponentProps<Root>`    | **Spread**          |
| `Content`     | `{ children } & ComponentProps<Content>` | **Spread**          |
| `Title`       | `ComponentProps<Title>`                  | **Spread** (direct) |
| `Description` | `ComponentProps<Description>`            | **Spread** (direct) |
| `Close`       | `{ children } & ComponentProps<Close>`   | **Spread**          |

Containers (Provider, Portal, Viewport) are custom. Content atoms are spread.

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
| `RadioItem`     | `{ label; value; displayUnselectedIcon? }`                          | Custom prop                                    |
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

Uses `ButtonBaseUi` as render root only. Variant system via `button-variants.ts`.

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

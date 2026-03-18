# Atoms — Homogenization TODO

Goal: align all Base-UI atoms on a unified system of structure, props, variants, and derived components.

---

## Scope

### In scope

**Existing atoms to homogenize:**
alert-dialog, dialog, collapsible, tabs, switch, drawer, popover, slider, combobox, select, menu.

**New Base-UI components to import:**
accordion, checkbox, context-menu.

**New non-Base-UI components:**
input-date (react-aria-components), input-calendar (react-day-picker).

### Out of scope

- **button / link** — Source of `buttonVariants`, already custom. Will be refactored to share logic (DRY loaderColorClass).
- **input / form / field** — useForm integration, separate concern.
- **toast** — Global context pattern, separate concern.
- **card / carousel / skeleton / use-turnstile** — Standalone files, no Base-UI sub-components.

### Removed

- **tooltip** — Removed. Doesn't work on mobile (hover-only). Replaced by popover (click-based, mobile-friendly).

---

## 1. Component inventory

Full list of atoms with their existing and planned derived components.

### Existing atoms

- **Alert Dialog** — [docs](https://base-ui.com/react/components/alert-dialog)
    - alert-dialog _(done)_

- **Dialog** — [docs](https://base-ui.com/react/components/dialog)
    - dialog _(done)_

- **Collapsible** — [docs](https://base-ui.com/react/components/collapsible)
    - collapsible _(done)_

- **Tabs** — [docs](https://base-ui.com/react/components/tabs)
    - tabs _(done)_
    - tabs-vertical

- **Switch** — [docs](https://base-ui.com/react/components/switch)
    - switch _(done)_
    - switch-chip

- **Drawer** — [docs](https://base-ui.com/react/components/drawer)
    - drawer _(done)_
    - drawer-non-modal _(done)_
    - drawer-snap-points _(done)_

- **Popover** — [docs](https://base-ui.com/react/components/popover)
    - popover _(done)_

- **Slider** — [docs](https://base-ui.com/react/components/slider)
    - slider _(done)_
    - slider-range

- **Combobox** — [docs](https://base-ui.com/react/components/combobox)
    - combobox _(done)_
    - combobox-multiple
    - combobox-async
    - combobox-multiple-async

- **Select** — [docs](https://base-ui.com/react/components/select)
    - select _(done)_
    - select-multiple _(done)_

- **Menu** — [docs](https://base-ui.com/react/components/menu)
    - menu _(done)_

### New Base-UI components to import

- **Accordion** — [docs](https://base-ui.com/react/components/accordion)
    - accordion
    - Sub-components: Root, Item, Header, Trigger, Panel

- **Checkbox** — [docs](https://base-ui.com/react/components/checkbox)
    - checkbox
    - checkbox-chip
    - Sub-components: Root, Indicator
    - Also: CheckboxGroup (`@base-ui/react/checkbox-group`)

- **Context Menu** — [docs](https://base-ui.com/react/components/context-menu)
    - context-menu
    - Sub-components: Root, Trigger, Portal, Backdrop, Positioner, Popup, Arrow, Item, LinkItem, Separator, Group, GroupLabel, RadioGroup, RadioItem, CheckboxItem, SubmenuRoot, SubmenuTrigger

### New non-Base-UI components (lower priority)

- **Input Date** — react-aria-components (DateInput + DateSegment)
    - input-date
    - Own pattern, not Base-UI

- **Input Calendar** — react-day-picker
    - input-calendar
    - Own pattern, not Base-UI

### Removed

- ~~**Tooltip**~~ — Removed. Hover-only, doesn't work on mobile. Use Popover instead.

---

## 2. Triggers → `buttonVariants`

Every Trigger currently hardcodes its own Tailwind classes. They should all use `buttonVariants` from `@atoms/button/button-variants` and expose the same styling props:

```
colors?: ButtonColorsType    (default varies per component)
rounded?: ButtonRoundedType  (default "md")
padding?: ButtonPaddingType  (default "md")
noFlex?: boolean
noOutline?: boolean
noStyle?: boolean
```

### Standard Triggers (standalone button, straightforward)

| Component    | Atom      | Default colors | Notes                                 |
| ------------ | --------- | -------------- | ------------------------------------- |
| alert-dialog | `Trigger` | `outline`      | Currently `text-destructive`          |
| alert-dialog | `Close`   | `outline`      | Two variants in demo (cancel/confirm) |
| dialog       | `Trigger` | `outline`      | —                                     |
| dialog       | `Close`   | `outline`      | —                                     |
| drawer       | `Trigger` | `outline`      | —                                     |
| drawer       | `Close`   | `outline`      | —                                     |
| popover      | `Trigger` | `outline`      | Square (size-10), icon button         |
| popover      | `Close`   | `outline`      | —                                     |
| collapsible  | `Trigger` | `outline`      | Has group + ChevronRight animation    |

### Special Triggers (component-specific behavior)

| Component | Atom      | Default colors | Notes                                                                                                                                 |
| --------- | --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| combobox  | `Trigger` | —              | Small icon (w-6) inside input, may keep noStyle                                                                                       |
| combobox  | `Clear`   | —              | Small icon inside input, same as above                                                                                                |
| tabs      | `Tab`     | —              | **Keep custom.** Focus ring uses `before:` pseudo-element to inset vertically and match Indicator height — deliberate Base UI design. |
| select    | `Trigger` | —              | Contains Value + Icon, custom layout — keep custom                                                                                    |
| menu      | `Trigger` | `outline`      | Discriminated union (label \| children), `openOnHover`                                                                                |

### Decisions

- [x] **tabs Tab**: ~~Use `buttonVariants` or keep custom?~~ → **Keep custom.** The `before:` pseudo focus ring is inset vertically (0.25rem) to align with the Indicator — this is the official Base UI pattern.
- [ ] **select Trigger**: Has Value + Icon inside — keep custom API but use `buttonVariants` for base styles?
- [ ] **combobox Trigger/Clear**: Tiny icon buttons inside the input — `buttonVariants` with `noStyle` + `padding: false`?

---

## 3. Close buttons → `buttonVariants`

Same treatment as Triggers. Components with Close: alert-dialog, dialog, drawer, popover.

---

## 4. Drawer refactor — extract variant atoms from `atoms.tsx`

Currently `atoms.tsx` (488 lines) contains variant-specific atoms inline:

- `NonModalViewport`, `NonModalPopup`
- `SnapViewport`, `SnapPopup`, `DragHandle`, `SnapContent`

These should be in their respective derived component files or a dedicated `atoms-snap.tsx` / `atoms-non-modal.tsx`.

---

## 5. JSDoc — docs links

Add Base UI documentation link in JSDoc for every component's main file:

```tsx
/**
 * @see https://base-ui.com/react/components/alert-dialog
 */
```

---

## 6. Structure alignment

### Missing `index.ts`

- [ ] `input/index.ts` — needs barrel export
- [ ] `form/index.ts` — needs barrel export

### Main component file (demo / anatomy)

Every `[component].tsx` should have:

1. `"use client"` directive
2. Composable mode (if children, pass through)
3. Demo mode (if no children, render default anatomy)

---

## 7. Dev pages

### Existing (`/app/dev/components/`)

Single page with all components (default + composed versions).

### To improve

- [ ] Dedicated page per component with all variants, derived components, and prop combinations
- [ ] Show Trigger with different `buttonVariants` (colors, rounded, padding)
- [ ] Show noStyle / noOutline / noFlex usage

---

## 8. Bugs to fix

- [ ] `form/_context/context.tsx` — Typo: error message says `"useFromContext"` instead of `"useFormContext"`
- [ ] `button/` + `link/` — DRY `loaderDefaultColor` logic (duplicated ~8 lines)
- [ ] `input/input-password.tsx` — Toggle button uses `noStyle` without focus outline

---

## 9. Non-priority

- [ ] `input/input-otp.tsx` — Clean up and align with standard pattern

---

## Priority order

1. **buttonVariants on standard Triggers/Close** — Biggest homogeneity win
2. **Drawer atoms.tsx refactor** — Extract variant atoms to dedicated files
3. **Remove tooltip** — Delete component, update imports to use popover
4. **New Base-UI components** — accordion, checkbox (+chip), context-menu
5. **Derived components** — tabs-vertical, switch-chip, slider-range, combobox variants
6. **JSDoc docs links** — Add to every component
7. **Missing index.ts** — input, form
8. **Dev pages** — Test everything
9. **Bug fixes** — Typo, DRY, focus outline
10. **Non-Base-UI components** — input-date, input-calendar (when needed)
11. **Import cleanup** — Uniformize `@atoms/` imports across codebase (last)

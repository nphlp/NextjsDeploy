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
    - tabs-vertical _(done)_

- **Switch** — [docs](https://base-ui.com/react/components/switch)
    - switch _(done)_
    - switch-chip _(done)_

- **Drawer** — [docs](https://base-ui.com/react/components/drawer)
    - drawer _(done)_
    - drawer-non-modal _(done)_
    - drawer-snap-points _(done)_

- **Popover** — [docs](https://base-ui.com/react/components/popover)
    - popover _(done)_

- **Slider** — [docs](https://base-ui.com/react/components/slider)
    - slider _(done)_
    - slider-range _(done)_

- **Combobox** — [docs](https://base-ui.com/react/components/combobox)
    - combobox _(done)_
    - combobox-multiple _(done)_
    - combobox-async _(done)_
    - combobox-multiple-async _(done)_

- **Select** — [docs](https://base-ui.com/react/components/select)
    - select _(done)_
    - select-multiple _(done)_

- **Menu** — [docs](https://base-ui.com/react/components/menu)
    - menu _(done)_

### New Base-UI components

- **Accordion** — [docs](https://base-ui.com/react/components/accordion)
    - accordion _(done)_

- **Checkbox** — [docs](https://base-ui.com/react/components/checkbox)
    - checkbox _(done)_
    - checkbox-chip _(done)_

- **Context Menu** — [docs](https://base-ui.com/react/components/context-menu)
    - context-menu _(done)_

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

## Done

- [x] **buttonStyle helper** — `ButtonStyleProps` + `buttonStyle()` in `button-variants.ts`
- [x] **buttonStyle on Triggers/Close** — alert-dialog, dialog, drawer, popover, collapsible
- [x] **buttonStyle on Button/Link** — replaced `noStyleMode`/`styledMode` boilerplate
- [x] **Rename "default" → "solid"** — set "outline" as default colors for Button, Link, all Triggers
- [x] **Drawer refactor** — extract variant atoms into `atoms-non-modal.tsx` + `atoms-snap.tsx`
- [x] **Remove tooltip** — deleted component
- [x] **New components** — accordion, checkbox (+chip), context-menu
- [x] **Derived components** — tabs-vertical, switch-chip, slider-range, combobox (×4)
- [x] **Combobox atoms-multiple** — `Value`, `ChipsContainer`, `ChipsInput`, `MultipleChip`, `MultipleChipRemove`
- [x] **Dev page** — single page with all components, trigger variants, derived components
- [x] **Tab focus outline** — simplified from `before:` pseudo to standard `outline`
- [x] **Menu RadioItem** — replaced `CircleSmallIcon` with `CheckIcon`
- [x] **Removed composed demos** — 9 files deleted, page simplified

---

## Remaining

- [ ] **JSDoc docs links** — Add `@see` to every atoms.tsx that doesn't have it yet
- [ ] **Missing index.ts** — input, form
- [ ] **Bug fixes**
    - [ ] `form/_context/context.tsx` — Typo: `"useFromContext"` → `"useFormContext"`
    - [ ] `button/` + `link/` — DRY `loaderDefaultColor` logic (duplicated ~8 lines)
    - [ ] `input/input-password.tsx` — Toggle button uses `noStyle` without focus outline
- [ ] `input/input-otp.tsx` — Clean up and align with standard pattern (non-priority)
- [ ] **Non-Base-UI components** — input-date, input-calendar (when needed)
- [ ] **Import cleanup** — Uniformize `@atoms/` imports across codebase (last)
- [ ] **Update documentation** — IMPORT.md, INVENTORY.md, CLAUDE.md to reflect all changes

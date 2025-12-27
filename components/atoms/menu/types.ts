type ButtonItemType = { type: "button"; label: string; value: string; onItemClick?: (value: string) => void };

type CheckboxItemType = {
    type: "checkbox";
    label: string;
    value: string;
    defaultChecked?: boolean;
    checked?: boolean;
    setCheckedChange?: (checked: boolean) => void;
};

type SeparatorItemType = { type: "separator" };

// Radio selector requires a group wrapper
type RadioItemType = { label: string; value: string };
type RadioGroupType = {
    type: "radio-group";
    items: RadioItemType[];
    defaultValue?: string;
    selectedRadio?: string;
    setSelectedRadio?: (value: string) => void;
    displayUnselectedIcon?: boolean;
};

// Group or sub-menu that contains any other type of menu items
type GroupType = { type: "group"; label: string; items: MenuItem[] };
type SubMenuItemsType = { type: "sub-menu"; label: string; items: MenuItem[] };

// Reccursive type of menu items, groups, sub-menus, etc
type MenuItem = ButtonItemType | CheckboxItemType | SeparatorItemType | RadioGroupType | SubMenuItemsType | GroupType;

export type {
    MenuItem,
    ButtonItemType,
    CheckboxItemType,
    SeparatorItemType,
    RadioItemType,
    RadioGroupType,
    GroupType,
    SubMenuItemsType,
};

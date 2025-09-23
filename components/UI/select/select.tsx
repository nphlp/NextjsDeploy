"use client";

import { type ButtonHTMLAttributes } from "react";
import Button from "./sub-components/button";
import Component from "./sub-components/component";
import Dropdown from "./sub-components/dropdown";
import Label from "./sub-components/label";
import Option from "./sub-components/options";
import Provider from "./sub-components/provider";
import { VariantType } from "./theme";
import { SelectOptionType } from "./utils";

export type SelectClassName = {
    component?: string;
    label?: string;

    displayedValue?: string;
    placeholder?: string;

    buttonGroup?: string;
    button?: string;

    subButton?: string;
    subCross?: string;

    subDiv?: string;
    subChevron?: string;

    optionList?: string;
    optionButton?: string;
    optionIcon?: string;
    optionLabel?: string;
};

export type CommonProps = {
    // Props
    label: string;
    placeholder?: string;

    // Styles
    variant: VariantType;
    className?: SelectClassName;
    dropdownGap: number;
    noLabel?: boolean;

    canNotBeEmpty?: boolean;
    required?: boolean;

    // External States
    options: SelectOptionType[];
    setSelected: (value: SelectOptionType["slug"]) => void;
    selected: SelectOptionType["slug"];

    // Additional Callbacks
    onSelectChange?: (value: SelectOptionType["slug"]) => void;

    // Components Props
    buttonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "label" | "placeholder" | "required" | "className">;
    optionsButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "label" | "className" | "onClick">;
};

type SelectProps = Omit<CommonProps, "variant" | "dropdownGap"> & {
    // Override this props to set a default value
    variant?: VariantType;
    dropdownGap?: number;
};

/**
 * Select component
 * 
 * @example
 * #### Server side
 * ```tsx
    // Fetch data
    const categoryList = await CategoryFindManyServer({
        select: { slug: true, name: true },
    });

    // Format options
    const categoryOptions = createSelectOptions(categoryList, { slug: "slug", label: "name" });
 * ```
 * 
 * #### Client side
 * ```tsx
    const [category, setCategory] = useState("");
    
    return (
        <Select
            label="Catégorie"
            placeholder="Sélectionnez une catégorie"
            options={categoryOptions}
            setSelected={setCategory}
            selected={category}
            className={{ component: "w-full" }}
            canNotBeEmpty
        />
    )
 * ```
 */
export default function Select(props: SelectProps) {
    // Define default values
    const { options, variant = "default", noLabel = false, dropdownGap = 8, ...others } = props;

    return (
        <Provider {...{ options, variant, noLabel, dropdownGap, ...others }}>
            <Component>
                <Label />
                <Button />
                <Dropdown>
                    {options?.map((option, index) => (
                        <Option key={index} option={option} />
                    ))}
                </Dropdown>
            </Component>
        </Provider>
    );
}

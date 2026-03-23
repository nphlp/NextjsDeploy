"use client";

import { CheckboxProps, Indicator, Root } from "./atoms";

export default function Checkbox(props: CheckboxProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <label className="text-foreground flex items-center gap-2 text-base">
            <Root defaultChecked {...otherProps}>
                <Indicator />
            </Root>
            <span className="text-sm font-medium select-none">Enable notifications</span>
        </label>
    );
}

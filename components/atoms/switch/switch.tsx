"use client";

import { Root, SwitchProps, Thumb } from "./atoms";

export default function Switch(props: SwitchProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <label className="text-foreground flex items-center gap-2 text-base">
            <Root defaultChecked {...otherProps}>
                <Thumb />
            </Root>
            <span className="text-sm font-medium select-none">Enable notifications</span>
        </label>
    );
}

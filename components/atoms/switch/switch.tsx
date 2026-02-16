"use client";

import { Root, SwitchProps, Thumb } from "./atoms";

export default function Switch(props: SwitchProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultChecked {...otherProps}>
            <Thumb />
        </Root>
    );
}

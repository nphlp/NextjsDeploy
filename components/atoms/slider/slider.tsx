"use client";

import { Control, Indicator, Root, SliderProps, Thumb, Track, Value } from "./atoms";

export default function Slider(props: SliderProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultValue={25} className="w-56" {...otherProps}>
            <span className="text-sm font-medium">Volume</span>
            <Value className="text-end" />
            <Control>
                <Track>
                    <Indicator />
                    <Thumb />
                </Track>
            </Control>
        </Root>
    );
}

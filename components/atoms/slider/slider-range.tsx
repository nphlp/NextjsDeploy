"use client";

import { Control, Indicator, Root, SliderProps, Thumb, Track, Value } from "./atoms";

export default function SliderRange(props: SliderProps) {
    const { children, ...otherProps } = props;

    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    return (
        <Root defaultValue={[25, 75]} className="w-56" {...otherProps}>
            <span className="text-sm font-medium">Price range</span>
            <Value className="text-end">{(_, values) => `${values[0]} – ${values[1]}`}</Value>
            <Control>
                <Track>
                    <Indicator />
                    <Thumb />
                    <Thumb />
                </Track>
            </Control>
        </Root>
    );
}

"use client";

import Slider, { Control, Indicator, Thumb, Track, Value } from "@atoms/slider";

export default function SliderComposed() {
    return (
        <Slider defaultValue={50} className="w-56">
            <span className="text-sm font-medium">Bass</span>
            <Value className="text-end" />
            <Control>
                <Track>
                    <Indicator />
                    <Thumb />
                </Track>
            </Control>
        </Slider>
    );
}

"use client";

import { Carousel, Slide } from "@atoms/carousel";

const SLIDES = [
    { id: 1, title: "Slide 1", color: "bg-orange-100 text-orange-900" },
    { id: 2, title: "Slide 2", color: "bg-blue-100 text-blue-900" },
    { id: 3, title: "Slide 3", color: "bg-green-100 text-green-900" },
    { id: 4, title: "Slide 4", color: "bg-pink-100 text-pink-900" },
    { id: 5, title: "Slide 5", color: "bg-purple-100 text-purple-900" },
    { id: 6, title: "Slide 6", color: "bg-yellow-100 text-yellow-900" },
];

/**
 * Default Carousel demo — 6 colored slides with arrows. The atom auto-adapts
 * `slidePerView` per breakpoint (1.2 mobile → 5.2 on 3xl).
 */
export default function CarouselDemo() {
    return (
        <div className="w-full">
            <Carousel withArrows>
                {SLIDES.map((slide) => (
                    <Slide key={slide.id}>
                        <div
                            className={`flex h-32 cursor-grab items-center justify-center rounded-lg font-semibold shadow-sm select-none active:cursor-grabbing ${slide.color}`}
                        >
                            {slide.title}
                        </div>
                    </Slide>
                ))}
            </Carousel>
        </div>
    );
}

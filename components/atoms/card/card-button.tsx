"use client";

import { useToast } from "@atoms/toast";
import { Box, Star } from "lucide-react";
import { Button, HigherButton, Root, type RootProps } from "./atoms";

/**
 * Demo: a clickable card using a `Button` overlay. In composable usage it
 * just wraps `children` in `Root`; user composes the internals (thumbnail,
 * title wrapped in `Button`, higher buttons). Without children, renders a
 * full demo.
 */
export default function CardButton(props: RootProps) {
    const { children, ...otherProps } = props;
    const toast = useToast();

    // Composable usage
    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    // Composable demo
    return (
        <Root {...otherProps} className="flex flex-row items-center gap-4 p-4">
            <div className="flex size-20 flex-none items-center justify-center">
                <Box className="size-10 text-gray-300" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="truncate text-base font-semibold">
                    <Button
                        label="Demo card button"
                        onClick={() =>
                            toast.add({
                                title: "Button card clicked",
                                description: "The button overlay was triggered.",
                                type: "success",
                            })
                        }
                    >
                        Demo card button
                    </Button>
                </h3>
                <p className="line-clamp-2 text-sm text-gray-500">
                    Click anywhere to trigger. Favorite button floats above.
                </p>
            </div>
            <HigherButton
                label="Favori"
                padding="icon"
                colors="ghost"
                onClick={() =>
                    toast.add({
                        title: "Favorite clicked",
                        description: "The higher button was triggered.",
                        type: "success",
                    })
                }
            >
                <Star className="size-5" />
            </HigherButton>
        </Root>
    );
}

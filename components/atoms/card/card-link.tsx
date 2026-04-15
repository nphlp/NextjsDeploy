"use client";

import { useToast } from "@atoms/toast";
import { Box, Star } from "lucide-react";
import { HigherButton, Link, Root, type RootProps } from "./atoms";

/**
 * Demo: a clickable card using a `Link` overlay. In composable usage it just
 * wraps `children` in `Root`; user composes the internals (thumbnail, title
 * wrapped in `Link`, higher buttons). Without children, renders a full demo.
 */
export default function CardLink(props: RootProps) {
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
                    <Link
                        href={"#" as never}
                        label="Demo card link"
                        onNavigate={(e) => {
                            e.preventDefault();
                            toast.add({
                                title: "Link card clicked",
                                description: "The link overlay was triggered.",
                                type: "success",
                            });
                        }}
                    >
                        Demo card link
                    </Link>
                </h3>
                <p className="line-clamp-2 text-sm text-gray-500">
                    Click anywhere to navigate. Favorite button floats above.
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

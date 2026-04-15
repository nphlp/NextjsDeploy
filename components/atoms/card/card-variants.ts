import cn from "@lib/cn";
import { type VariantProps, cva } from "class-variance-authority";

/**
 * Card visual variants. Hover and focus-visible styles are gated behind
 * `has-data-card-overlay:*` / `has-[[data-card-overlay]:focus-visible]:*`
 * so they only apply when the card contains a `CardLink` or `CardButton`
 * overlay (i.e. when the card is truly clickable).
 */
const cardVariants = cva(
    cn(
        "relative w-full rounded-lg",
        "transition-colors",
        // Focus ring on Root when a child overlay is focus-visible.
        "outline-2 outline-transparent has-[[data-card-overlay]:focus-visible]:outline-outline",
    ),
    {
        variants: {
            colors: {
                solid: cn("border border-gray-200 bg-white shadow-sm", "has-data-card-overlay:hover:border-gray-300"),
                dashed: cn(
                    "border border-dashed border-gray-300 text-gray-600",
                    "has-data-card-overlay:hover:border-gray-500 has-data-card-overlay:hover:text-gray-800",
                ),
                ghost: cn("border border-transparent", "has-data-card-overlay:hover:bg-gray-50"),
            },
        },
        defaultVariants: {
            colors: "solid",
        },
    },
);

export type CardColorsType = NonNullable<VariantProps<typeof cardVariants>["colors"]>;

export default cardVariants;
